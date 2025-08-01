"""
Utility functions for the recommendation system
Handles model serialization, caching, and Redis operations
"""

import json
import pickle
import base64
from datetime import datetime
import redis
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Redis client initialization
redis_client = redis.Redis(
    host=os.getenv('REDIS_HOST', 'localhost'),
    port=int(os.getenv('REDIS_PORT', 6379)),
    db=int(os.getenv('REDIS_DB', 0)),
    decode_responses=True
)

# Redis keys for caching
USER_ITEM_MATRIX_KEY = 'user_item_matrix'
LIGHTFM_MODEL_KEY = 'lightfm_model'
USER_MAPPING_KEY = 'user_mapping'
ITEM_MAPPING_KEY = 'item_mapping'
MODEL_METADATA_KEY = 'model_metadata'

# Configuration constants
REDIS_EXPIRE_TIME = int(os.getenv('REDIS_EXPIRE_TIME', 86400))  # 24 hours default


def serialize_model(model):
    """Serialize LightFM model to base64 string for Redis storage"""
    model_bytes = pickle.dumps(model)
    return base64.b64encode(model_bytes).decode('utf-8')


def deserialize_model(model_str):
    """Deserialize LightFM model from base64 string"""
    model_bytes = base64.b64decode(model_str.encode('utf-8'))
    return pickle.loads(model_bytes)


def cache_trained_model(model, user_mapping, item_mapping, matrix_version):
    """Cache trained model and mappings in Redis"""
    try:
        # Serialize and cache the model
        model_str = serialize_model(model)
        redis_client.setex(LIGHTFM_MODEL_KEY, REDIS_EXPIRE_TIME, model_str)
        
        # Cache the mappings
        redis_client.setex(USER_MAPPING_KEY, REDIS_EXPIRE_TIME, json.dumps(user_mapping))
        redis_client.setex(ITEM_MAPPING_KEY, REDIS_EXPIRE_TIME, json.dumps(item_mapping))
        
        # Cache metadata
        metadata = {
            'timestamp': datetime.now().isoformat(),
            'matrix_version': matrix_version,
            'n_users': len(user_mapping),
            'n_items': len(item_mapping)
        }
        redis_client.setex(MODEL_METADATA_KEY, REDIS_EXPIRE_TIME, json.dumps(metadata))
        
        print(f"Cached trained LightFM model with {len(user_mapping)} users and {len(item_mapping)} items")
        return True
    except Exception as e:
        print(f"Error caching trained model: {e}")
        return False


def get_cached_model():
    """Retrieve cached model and mappings from Redis"""
    try:
        # Check if all components exist
        if not all([
            redis_client.exists(LIGHTFM_MODEL_KEY),
            redis_client.exists(USER_MAPPING_KEY),
            redis_client.exists(ITEM_MAPPING_KEY),
            redis_client.exists(MODEL_METADATA_KEY)
        ]):
            return None, None, None, None
        
        # Retrieve and deserialize model
        model_str = redis_client.get(LIGHTFM_MODEL_KEY)
        model = deserialize_model(model_str)
        
        # Retrieve mappings
        user_mapping = json.loads(redis_client.get(USER_MAPPING_KEY))
        item_mapping = json.loads(redis_client.get(ITEM_MAPPING_KEY))
        metadata = json.loads(redis_client.get(MODEL_METADATA_KEY))
        
        print(f"Retrieved cached LightFM model from {metadata['timestamp']}")
        return model, user_mapping, item_mapping, metadata
    except Exception as e:
        print(f"Error retrieving cached model: {e}")
        return None, None, None, None


def invalidate_cached_model():
    """Invalidate cached model and mappings when matrix changes"""
    try:
        redis_client.delete(LIGHTFM_MODEL_KEY)
        redis_client.delete(USER_MAPPING_KEY) 
        redis_client.delete(ITEM_MAPPING_KEY)
        redis_client.delete(MODEL_METADATA_KEY)
        print("Invalidated cached LightFM model due to matrix update")
        return True
    except Exception as e:
        print(f"Error invalidating cached model: {e}")
        return False


def get_redis_client():
    """Get the Redis client instance"""
    return redis_client


def train_model(matrix_dict, user_mapping, item_mapping):
    """Train LightFM model"""
    import scipy.sparse as sp
    from lightfm import LightFM
    from fastapi import HTTPException
    
    try:
        # Convert to sparse matrix format for LightFM
        row_indices = []
        col_indices = []
        ratings = []
        
        # Build sparse matrix data
        for user, user_idx in user_mapping.items():
            user_ratings = matrix_dict.get(user, {})
            for item, rating in user_ratings.items():
                if item in item_mapping and rating is not None:
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
        
        # Train for a few epochs - adjust as needed for performance vs. accuracy
        model.fit(interaction_matrix, epochs=5, verbose=True)
        print("LightFM model trained successfully")
        
        return model
    except Exception as e:
        print(f"Error training LightFM model: {e}")
        raise HTTPException(status_code=500, detail=f"Error training LightFM model: {str(e)}")
        

def get_redis_keys():
    """Get all Redis keys used by the system"""
    return {
        'USER_ITEM_MATRIX_KEY': USER_ITEM_MATRIX_KEY,
        'LIGHTFM_MODEL_KEY': LIGHTFM_MODEL_KEY,
        'USER_MAPPING_KEY': USER_MAPPING_KEY,
        'ITEM_MAPPING_KEY': ITEM_MAPPING_KEY,
        'MODEL_METADATA_KEY': MODEL_METADATA_KEY
    }