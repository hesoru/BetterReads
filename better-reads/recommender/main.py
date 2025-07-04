from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import redis
import json
import os
import time
import asyncio
import pymongo
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime

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
    # Ensure user_id is a string
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
    
    # Compute similarity between users
    similarity = cosine_similarity(user_item_matrix)
    similarity_df = pd.DataFrame(similarity, index=user_item_matrix.index, columns=user_item_matrix.index)
    
    # We already checked if user exists in the matrix, but double-check here
    if user_id not in similarity_df.index:
        print(f"User {user_id} not found in similarity matrix. Available users: {similarity_df.index.tolist()}")
        raise HTTPException(status_code=404, detail=f"User ID {user_id} not found in recommendation matrix")
        
    # Get similar users
    similar_users = similarity_df[user_id].sort_values(ascending=False)[1:51]  # top 50 similar users
    print(f"Found {len(similar_users)} similar users for user {user_id}")

    # Weighted average of ratings from similar users
    weighted_scores = np.zeros(user_item_matrix.shape[1])
    similarity_sums = np.zeros(user_item_matrix.shape[1])

    for sim_user, sim_score in similar_users.items():
        ratings = user_item_matrix.loc[sim_user].values
        weighted_scores += ratings * sim_score
        similarity_sums += (ratings > 0) * sim_score

    recommendation_scores = np.divide(weighted_scores, similarity_sums, out=np.zeros_like(weighted_scores), where=similarity_sums!=0)
    
    # Get books user hasn't rated
    user_rated = user_item_matrix.loc[user_id] > 0
    unrated_indices = np.where(user_rated == False)[0]

    # Pick top N=20 unrated books
    top_indices = unrated_indices[np.argsort(recommendation_scores[unrated_indices])[::-1][:20]]
    book_ids = user_item_matrix.columns[top_indices].tolist()

    # Return recommendations using the defined response model
    return RecommendResponse(
        recommendations=book_ids,
        message=f"Generated {len(book_ids)} recommendations for user {user_id}"
    )

# API endpoint to manually trigger matrix update
@app.post("/update-matrix")
def trigger_matrix_update():
    success = update_matrix_with_reviews()
    if success:
        return {"status": "success", "message": "User-item matrix updated successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to update user-item matrix")
