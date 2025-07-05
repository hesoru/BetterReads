import Redis from 'ioredis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Redis client
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  retryStrategy: (times) => {
    // Retry connection with exponential backoff
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

// Handle Redis connection events
redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('reconnecting', () => {
  console.log('Redis client reconnecting...');
});

// Get Redis client (already connected with ioredis)
const connectRedis = async () => {
  try {
    return redisClient;
  } catch (error) {
    console.error('Redis connection failed:', error);
    return null;
  }
};

// Get data from Redis
async function getFromRedis(key) {
  try {
    const client = await connectRedis();
    if (!client) return null;
    
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error getting ${key} from Redis:`, error);
    return null;
  }
}

// Store data in Redis
async function storeInRedis(key, data, expirationSeconds = 3600) {
  try {
    const client = await connectRedis();
    if (!client) return false;
    
    await client.set(key, JSON.stringify(data), 'EX', expirationSeconds);
    return true;
  } catch (error) {
    console.error(`Error storing ${key} in Redis:`, error);
    return false;
  }
}

export { getFromRedis, storeInRedis };
