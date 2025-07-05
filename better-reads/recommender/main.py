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

# Load environment variables
load_dotenv()

app = FastAPI()

# Initialize Redis client
redis_client = redis.Redis(
    host=os.getenv('REDIS_HOST', 'localhost'),
    port=int(os.getenv('REDIS_PORT', 6379)),
    db=int(os.getenv('REDIS_DB', 0)),
    decode_responses=True
)

# MongoDB connection
mongo_uri = os.getenv('MONGO_URI', 'mongodb+srv://rex015:iDPU4rvt5HjtDrW1@sandbox.bcebozm.mongodb.net/bookdb?retryWrites=true&w=majority&appName=Sandbox')
mongo_client = MongoClient(mongo_uri)
db = mongo_client['bookdb']
reviews_collection = db['reviews']
users_collection = db['users']

# Redis key for user-item matrix
USER_ITEM_MATRIX_KEY = 'user_item_matrix'
# Path to initial user-item matrix JSON file
INITIAL_MATRIX_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'backend', 'data', 'initial-user-item-matrix.json')
# Update interval in seconds
UPDATE_INTERVAL = int(os.getenv('UPDATE_INTERVAL', 3600))  # Default: update every hour

# Sample input format
class RecommendRequest(BaseModel):
    user_id: str
    
# Response format
class RecommendResponse(BaseModel):
    recommendations: List[str]
    message: str = "Recommendations generated successfully"

# Initialize user-item matrix from JSON file and start background update task
@app.on_event("startup")
async def startup_event():
    # Initialize the user-item matrix from the JSON file
    initialize_user_item_matrix()

    update_matrix_with_reviews()
    
    # Start background task for periodic updates
    # asyncio.create_task(periodic_update_matrix())

# Initialize user-item matrix from JSON file
def initialize_user_item_matrix():
    try:
        print(f"Initializing user-item matrix from {INITIAL_MATRIX_PATH}")
        
        # Check if the matrix already exists in Redis
        if redis_client.exists(USER_ITEM_MATRIX_KEY):
            print("User-item matrix already exists in Redis, skipping initialization")
            return
        
        # Load the initial matrix from JSON file
        if os.path.exists(INITIAL_MATRIX_PATH):
            # Load the JSON file - handle both pandas to_json format and dictionary format
            try:
                # First try to load as a pandas DataFrame JSON format
                df = pd.read_json(INITIAL_MATRIX_PATH)
                # Convert to the dictionary format we need
                matrix_data = {}
                for user_id in df.index:
                    user_ratings = {}
                    for book_id in df.columns:
                        rating = df.loc[user_id, book_id]
                        if rating > 0:  # Only include non-zero ratings
                            user_ratings[book_id] = float(rating)
                    if user_ratings:  # Only include users with ratings
                        matrix_data[user_id] = user_ratings
                        
                print(f"Loaded initial matrix data from pandas format with {len(matrix_data)} users")
            except Exception as e:
                print(f"Could not load as pandas format, trying as dictionary: {e}")
                # Try loading as a regular dictionary
                with open(INITIAL_MATRIX_PATH, 'r') as f:
                    matrix_data = json.load(f)
                print(f"Loaded initial matrix data as dictionary with {len(matrix_data)} entries")
            
            # Store the matrix in Redis
            redis_client.setex(
                USER_ITEM_MATRIX_KEY,
                86400,  # Cache for 24 hours
                json.dumps(matrix_data)
            )
            print("Initial user-item matrix stored in Redis")
        else:
            print(f"Warning: Initial matrix file not found at {INITIAL_MATRIX_PATH}")
    except Exception as e:
        print(f"Error initializing user-item matrix: {e}")
        # Create empty matrix as fallback
        try:
            redis_client.setex(
                USER_ITEM_MATRIX_KEY,
                86400,  # Cache for 24 hours
                json.dumps({})
            )
            print("Created empty matrix as fallback")
        except Exception as e2:
            print(f"Failed to create fallback matrix: {e2}")

# Fetch reviews from MongoDB and update the user-item matrix
def update_matrix_with_reviews():
    try:
        print("Updating user-item matrix with reviews from MongoDB")
        
        # Get the current matrix from Redis
        cached_data = redis_client.get(USER_ITEM_MATRIX_KEY)
        if not cached_data:
            print("No existing matrix found in Redis, initializing first")
            initialize_user_item_matrix()
            cached_data = redis_client.get(USER_ITEM_MATRIX_KEY)
            if not cached_data:
                print("Failed to initialize matrix, skipping update")
                return
        
        # Parse the current matrix
        matrix_data = json.loads(cached_data)
        
        # Get all users from MongoDB first
        users = list(users_collection.find({}, {'_id': 1, 'username': 1}))
        print(f"Found {len(users)} users in MongoDB")
        
        # Add all users to the matrix (even those without reviews)
        for user in users:
            # Use username as the user identifier if available, otherwise use _id
            user_id = str(user.get('username', user['_id']))
            if user_id not in matrix_data:
                matrix_data[user_id] = {}
        
        # Get all reviews from MongoDB
        reviews = list(reviews_collection.find({}, {
            'userId': 1, 
            'bookId': 1, 
            'rating': 1
        }))
        
        print(f"Found {len(reviews)} reviews in MongoDB")
        
        # Convert ObjectId to string for JSON serialization
        for review in reviews:
            # Convert bookId to string if it's an ObjectId
            if isinstance(review['bookId'], type(review['_id'])):
                review['bookId'] = str(review['bookId'])
            # Ensure userId is always a string
            if 'userId' in review:
                review['userId'] = str(review['userId'])
        
        # Update the matrix with reviews
        for review in reviews:
            # Ensure user_id and book_id are strings
            # Use userId as the user identifier (which should be the username in your system)
            user_id = str(review['userId'])
            book_id = str(review['bookId'])
            rating = review['rating']
            
            # Initialize user entry if not exists (should already be done above)
            if user_id not in matrix_data:
                matrix_data[user_id] = {}
            
            # Update rating
            matrix_data[user_id][book_id] = rating
        
        # Store updated matrix back to Redis
        redis_client.setex(
            USER_ITEM_MATRIX_KEY,
            86400,  # Cache for 24 hours
            json.dumps(matrix_data)
        )
        
        print(f"User-item matrix updated with {len(reviews)} reviews")
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

@app.post("/recommend")
def recommend_books(data: RecommendRequest):
    user_id = str(data.user_id)

    # Try to get user-item matrix from Redis
    try:
        cached_data = redis_client.get(USER_ITEM_MATRIX_KEY)
        if not cached_data:
            raise HTTPException(status_code=404, detail="User-item matrix not found in Redis")

        print("Using cached user-item matrix from Redis")
        # Convert the cached JSON string to a dictionary
        matrix_dict = json.loads(cached_data)
        
        # Check if user exists in the matrix directly from the dictionary
        if user_id not in matrix_dict:
            raise HTTPException(status_code=404, detail=f"User ID {user_id} not found in recommendation matrix")
            
        # Convert the dictionary to a DataFrame for collaborative filtering
        user_item_matrix = pd.DataFrame.from_dict(matrix_dict, orient='index')
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"Error retrieving from Redis: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing recommendation matrix: {str(e)}")
            
    # Fill NaN values with 0 to ensure matrix operations work correctly
    user_item_matrix = user_item_matrix.fillna(0)
    
    # Create mappings between user/item IDs and matrix indices
    user_ids = list(user_item_matrix.index)
    item_ids = list(user_item_matrix.columns)
    
    user_mapping = {uid: i for i, uid in enumerate(user_ids)}
    item_mapping = {iid: i for i, iid in enumerate(item_ids)}
    
    # Check if user exists in mapping
    if user_id not in user_mapping:
        print(f"User {user_id} not found in user mapping. Available users: {user_ids[:10]}...")
        raise HTTPException(status_code=404, detail=f"User ID {user_id} not found in recommendation matrix")
    
    # Convert to sparse matrix format for LightFM
    interactions = []
    row_indices = []
    col_indices = []
    ratings = []
    
    # Build sparse matrix data
    for user, user_idx in user_mapping.items():
        user_ratings = matrix_dict.get(user, {})
        for item, rating in user_ratings.items():
            if item in item_mapping:
                row_indices.append(user_idx)
                col_indices.append(item_mapping[item])
                ratings.append(float(rating))
    
    # Create sparse matrix
    n_users = len(user_mapping)
    n_items = len(item_mapping)
    interaction_matrix = sp.coo_matrix((ratings, (row_indices, col_indices)), 
                                     shape=(n_users, n_items))
    
    print(f"Created sparse interaction matrix with shape {interaction_matrix.shape}")
    
    # Train LightFM model
    model = LightFM(loss='warp')
    
    try:
        # Train for a few epochs - adjust as needed for performance vs. accuracy
        model.fit(interaction_matrix, epochs=5, verbose=True)
        print("LightFM model trained successfully")
        
        # Get user index
        user_idx = user_mapping[user_id]
        
        # Predict scores for all items
        scores = model.predict(user_idx, np.arange(n_items))
        
        # Get items the user has already interacted with
        user_items = set()
        if user_id in matrix_dict:
            user_items = set(matrix_dict[user_id].keys())
        
        # Create list of (item_id, score) tuples, excluding items the user has already rated
        item_scores = []
        for item_id, item_idx in item_mapping.items():
            if item_id not in user_items:  # Only recommend items the user hasn't rated
                item_scores.append((item_id, scores[item_idx]))
        
        # Sort by score in descending order
        item_scores.sort(key=lambda x: x[1], reverse=True)
        
        # Get top 20 recommendations
        top_items = [item_id for item_id, _ in item_scores[:20]]
        
        print(f"Generated {len(top_items)} recommendations for user {user_id}")
        
    except Exception as e:
        print(f"Error training LightFM model: {e}")
        # Fall back to a simpler approach if LightFM fails
        print("Falling back to popularity-based recommendations")
        
        # Get all ratings
        all_ratings = {}
        for user_ratings in matrix_dict.values():
            for item, rating in user_ratings.items():
                if item not in all_ratings:
                    all_ratings[item] = []
                all_ratings[item].append(rating)
        
        # Calculate average rating and count for each item
        item_popularity = {}
        for item, ratings in all_ratings.items():
            avg_rating = sum(ratings) / len(ratings)
            count = len(ratings)
            item_popularity[item] = avg_rating * count
        
        # Sort items by popularity
        sorted_items = sorted(item_popularity.items(), key=lambda x: x[1], reverse=True)
        
        # Get user's items to exclude
        user_items = set()
        if user_id in matrix_dict:
            user_items = set(matrix_dict[user_id].keys())
        
        # Get top items excluding what the user has already rated
        top_items = []
        for item, _ in sorted_items:
            if item not in user_items:
                top_items.append(item)
                if len(top_items) >= 20:
                    break
    
    # Return recommendations using the defined response model
    return RecommendResponse(
        recommendations=top_items,
        message=f"Generated {len(top_items)} recommendations for user {user_id}"
    )

# API endpoint to manually trigger matrix update
@app.post("/update-matrix")
def trigger_matrix_update():
    success = update_matrix_with_reviews()
    if success:
        return {"status": "success", "message": "User-item matrix updated successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to update user-item matrix")
