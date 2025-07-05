import Redis from 'ioredis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Redis client
const redisClient = new Redis({
  // Force IPv4 on macOS, where 'localhost' can resolve to IPv6 '::1'
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  retryStrategy: (times) => {
    // In test environment, don't retry, just fail fast.
    if (process.env.NODE_ENV === 'test') {
      return null;
    }
    // Retry connection with exponential backoff
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  // Prevent ioredis from outputting to console during tests
  silent: process.env.NODE_ENV === 'test',
});

// Handle Redis connection events
redisClient.on('error', (err) => {
  // Don't log every connection error in test env, it's noisy
  if (process.env.NODE_ENV !== 'test') {
    console.error('Redis connection error:', err);
  }
});

redisClient.on('connect', () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('Redis client connected');
  }
});

redisClient.on('reconnecting', () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('Redis client reconnecting...');
  }
});

// Get data from Redis
async function getFromRedis(key) {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error getting ${key} from Redis:`, error);
    return null;
  }
}

// Store data in Redis
async function storeInRedis(key, data, expirationSeconds = 3600) {
  try {
    await redisClient.set(key, JSON.stringify(data), 'EX', expirationSeconds);
    return true;
  } catch (error) {
    console.error(`Error storing ${key} in Redis:`, error);
    return false;
  }
}

const disconnectRedis = () => {
  redisClient.quit();
};

export { redisClient, disconnectRedis, getFromRedis, storeInRedis };
