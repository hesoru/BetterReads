"""
Recommendation system microservice:
- Uses collaborative filtering with a user-item matrix to generate recommendations for users.
- Uses Redis to cache the user-item matrix and the trained model.
- Trains a LightFM implicit feedback model, which optimizes precision@k using WARP (Weighted Approximate Ranking Pairwise) loss.
- Distances between user ratings calculated using cosine similarity.
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Dict, Any
import pandas as pd
import numpy as np
import redis
import json
import os
import time
import asyncio
import pymongo
import scipy.sparse as sp
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime
from lightfm import LightFM
from sklearn.metrics.pairwise import cosine_similarity

# Import utility functions
from utils import (
    cache_trained_model,
    get_cached_model,
    invalidate_cached_model,
    get_redis_client,
    get_redis_keys,
    train_model
)

# Load environment variables
load_dotenv()

app = FastAPI()

# Get Redis client from utils
redis_client = get_redis_client()

# MongoDB connection
mongo_uri = os.getenv('MONGO_URI', 'mongodb+srv://rex015:iDPU4rvt5HjtDrW1@sandbox.bcebozm.mongodb.net/bookdb?retryWrites=true&w=majority&appName=Sandbox')
mongo_client = MongoClient(mongo_uri)
db = mongo_client['bookdb']
reviews_collection = db['reviews']
users_collection = db['users']

# Get Redis keys from utils
redis_keys = get_redis_keys()
USER_ITEM_MATRIX_KEY = redis_keys['USER_ITEM_MATRIX_KEY']
# Path to initial user-item matrix Parquet file (absolute path in container)
INITIAL_MATRIX_PATH = '/app/data/initial-user-item-matrix.parquet'
# Update interval in seconds (1 hour)
REDIS_UPDATE_INTERVAL = int(os.getenv('REDIS_UPDATE_INTERVAL', 3600))
# Default expiration time in seconds (24 hours)
REDIS_EXPIRE_TIME = int(os.getenv('REDIS_EXPIRE_TIME', 86400))

# Request format
class RecommendRequest(BaseModel):
    username: str
    
# Response format
class RecommendResponse(BaseModel):
    recommendations: List[str]      # list of book IDs
    message: str = "Recommendations generated successfully"


# Initialize user-item matrix from JSON file and start background update task
@app.on_event("startup")
async def startup_event():
    # Initialize the user-item matrix from the JSON file
    initialize_user_item_matrix(force_reload=True)

    update_matrix()
    
    # Start background task for periodic updates
    # asyncio.create_task(periodic_update_matrix())

# Initialize user-item matrix from JSON file
def initialize_user_item_matrix(force_reload=False):
    try:
        print(f"Initializing user-item matrix from {INITIAL_MATRIX_PATH}")
        
        # Check if the matrix already exists in Redis (skip if force_reload is True)
        if not force_reload and redis_client.exists(USER_ITEM_MATRIX_KEY):
            print("User-item matrix already exists in Redis, skipping initialization")
            return
        
        # Load the initial matrix from Parquet file
        if os.path.exists(INITIAL_MATRIX_PATH):
            try:
                df = pd.read_parquet(INITIAL_MATRIX_PATH)
                print(f"Loaded Parquet file with shape: {df.shape}")
                
                # Convert to the dictionary format we need for Redis storage
                matrix_data = {}
                for user_id in df.index:
                    user_ratings = {}
                    for book_id in df.columns:
                        rating = df.loc[user_id, book_id]
                        if pd.notna(rating) and rating > 0:  
                            user_ratings[str(book_id)] = float(rating)  
                    if user_ratings:   
                        matrix_data[str(user_id)] = user_ratings  
                print(f"Loaded initial matrix data from Parquet with {len(matrix_data)} users")
                
                # Store the matrix in Redis
                redis_client.setex(USER_ITEM_MATRIX_KEY, REDIS_EXPIRE_TIME, json.dumps(matrix_data))
                print("Initial user-item matrix stored in Redis")
            except Exception as e:
                print(f"Error loading Parquet file: {e}")
                # Create empty matrix as fallback
                redis_client.setex(USER_ITEM_MATRIX_KEY, REDIS_EXPIRE_TIME, json.dumps({}))
                print("Created empty matrix as fallback due to Parquet loading error")
        else:
            print(f"Warning: Initial matrix file not found at {INITIAL_MATRIX_PATH}")
            # Create empty matrix as fallback
            redis_client.setex(USER_ITEM_MATRIX_KEY, REDIS_EXPIRE_TIME, json.dumps({}))
            print("Created empty matrix as fallback due to missing file")
            
    except Exception as e1:
        print(f"Error initializing user-item matrix: {e1}")
        # Create empty matrix as fallback
        try:
            redis_client.setex(USER_ITEM_MATRIX_KEY, REDIS_EXPIRE_TIME, json.dumps({}))
            print("Created empty matrix as fallback")
        except Exception as e2:
            print(f"Failed to create fallback matrix: {e2}")

# Fetch users and reviews from MongoDB and update the user-item matrix
def update_matrix():
    try:
        print("Updating user-item matrix with reviews from MongoDB")
        
        cached_matrix = redis_client.get(USER_ITEM_MATRIX_KEY)
        if not cached_matrix:
            print("No existing matrix found in Redis, initializing first")
            initialize_user_item_matrix()
            cached_matrix = redis_client.get(USER_ITEM_MATRIX_KEY)
            if not cached_matrix:
                print("Failed to initialize matrix, skipping update")
                return
        
        matrix_data = json.loads(cached_matrix)
        
        users = list(users_collection.find({}, {'_id': 1, 'username': 1}))
        print(f"Found {len(users)} users in MongoDB")
        
        # Add all users to the matrix (even those without reviews)
        for user in users:
            # Use username as the user identifier if available, otherwise use _id
            username = str(user.get('username', user['_id']))
            if username not in matrix_data:
                matrix_data[username] = {}
        
        reviews = list(reviews_collection.find({}, {'userId': 1, 'bookId': 1, 'rating': 1}))
        print(f"Found {len(reviews)} reviews in MongoDB")
        
        # Convert ObjectId for bookId and userId to string for JSON serialization
        for review in reviews:
            if isinstance(review['bookId'], type(review['_id'])):
                review['bookId'] = str(review['bookId'])
            if 'userId' in review:
                review['userId'] = str(review['userId'])
        
        # Update the matrix with ratings
        for review in reviews:
            username = str(review['userId']) # Use userId as the user identifier (which is username in the db)
            book_id = str(review['bookId'])
            rating = review['rating']
            
            if rating is None:
                continue
                        
            matrix_data[username][book_id] = rating
        
        # Store updated matrix back to Redis
        redis_client.setex(USER_ITEM_MATRIX_KEY, REDIS_EXPIRE_TIME, json.dumps(matrix_data))
        print(f"User-item matrix updated with {len(reviews)} reviews")
        
        # Invalidate cached model since matrix has changed
        invalidate_cached_model()
        print("Cached model invalidated")

        # Create mappings for training new model
        user_ids = list(matrix_data.keys())
        all_book_ids = set()
        for user_ratings in matrix_data.values():
            all_book_ids.update(user_ratings.keys())
        book_ids = list(all_book_ids)
        user_mapping = {uid: i for i, uid in enumerate(user_ids)}
        item_mapping = {bid: i for i, bid in enumerate(book_ids)}
        
        # Train and cache new model
        model = train_model(matrix_data, user_mapping, item_mapping)
        cache_trained_model(model, user_mapping, item_mapping, "v1")
        print("New model trained and cached")
    
        return True
    except Exception as e:
        print(f"Error updating matrix with reviews: {e}")
        return False

# # Periodic update task
# async def periodic_update_matrix():
#     while True:
#         try:
#             print(f"Running periodic update at {datetime.now()}")
#             update_matrix_with_reviews()
#         except Exception as e:
#             print(f"Error in periodic update: {e}")
        
#         # Wait for the next update interval
#         await asyncio.sleep(UPDATE_INTERVAL)

# Generate recommendations for a user
@app.post("/recommend")
def recommend_books(data: RecommendRequest):
    # Get username from request
    username = str(data.username)
    user_item_matrix = None

    # Try to get user-item matrix from Redis
    try:
        cached_data = redis_client.get(USER_ITEM_MATRIX_KEY)
        if not cached_data:
            raise HTTPException(status_code=404, detail="User-item matrix not found in Redis")
        print("Using cached user-item matrix from Redis")
        
        matrix_dict = json.loads(cached_data)
        
        if username not in matrix_dict:
            raise HTTPException(status_code=404, detail=f"User {username} not found in recommendation matrix")
                        
        # Add a dummy rating for users with empty dictionaries to prevent pandas from dropping them
        matrix_dict_fixed = {}
        for user_id, ratings in matrix_dict.items():
            if not ratings:
                matrix_dict_fixed[user_id] = {'__dummy__': 0}
            else:
                matrix_dict_fixed[user_id] = ratings
        user_item_matrix = pd.DataFrame.from_dict(matrix_dict_fixed, orient='index')
        
        # Remove the dummy column if it exists
        if '__dummy__' in user_item_matrix.columns:
            user_item_matrix = user_item_matrix.drop(columns=['__dummy__'])
        
        print(f"After DataFrame conversion: {len(user_item_matrix.index)} users in DataFrame")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"Error retrieving from Redis: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing recommendation matrix: {str(e)}")
            
    user_item_matrix = user_item_matrix.fillna(0)
    
    user_ids = list(user_item_matrix.index)
    item_ids = list(user_item_matrix.columns)
    
    user_mapping = {uid: i for i, uid in enumerate(user_ids)}
    item_mapping = {iid: i for i, iid in enumerate(item_ids)}
    
    if username not in user_mapping:
        print(f"User {username} not found in user mapping.")
        raise HTTPException(status_code=404, detail=f"User {username} not found in recommendation matrix")
    
    cached_model, cached_user_mapping, cached_item_mapping, metadata = get_cached_model()
    
    if cached_model is not None:
        # Use cached model
        model = cached_model
        user_mapping = cached_user_mapping
        item_mapping = cached_item_mapping
        n_items = len(item_mapping)
        print("Using cached LightFM model for predictions")
    else:
        # Train and cache new model
        model = train_model(matrix_dict, user_mapping, item_mapping)
        cache_trained_model(model, user_mapping, item_mapping, "v1")
        n_items = len(item_mapping)
        print("New model trained and cached")
    
    # predict scores for all items by user
    user_idx = user_mapping[username]
    scores = model.predict(user_idx, np.arange(n_items))
    
    # find books to exclude, that the user has already rated
    user_items = set()
    if username in matrix_dict:
        user_items = set(matrix_dict[username].keys())
    
    # Create list of (item_id, score) tuples, excluding books the user has already rated
    item_scores = []
    for item_id, item_idx in item_mapping.items():
        if item_id not in user_items:
            item_scores.append((item_id, scores[item_idx]))
    item_scores.sort(key=lambda x: x[1], reverse=True)
    
    # Get top (RECOMMENDATIONS_LENGTH) recommendations
    RECOMMENDATIONS_LENGTH = 20
    top_items = [item_id for item_id, _ in item_scores[:RECOMMENDATIONS_LENGTH]]
    
    print(f"Generated {len(top_items)} recommendations for user {username}")

    # Return recommendations using the defined response model
    return RecommendResponse(
        recommendations=top_items,
        message=f"Generated {len(top_items)} recommendations for user {username}"
    )

# API endpoint to manually trigger matrix update
@app.post("/update-matrix")
def trigger_matrix_update():
    success = update_matrix()
    if success:
        return {"status": "success", "message": "User-item matrix updated successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to update user-item matrix")
