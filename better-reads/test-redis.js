import { getFromRedis, storeInRedis } from './backend/services/redisClient.js';

async function testRedisConnection() {
  try {
    // Try to store a test value
    console.log('Testing Redis connection...');
    const testKey = 'test_connection';
    const testValue = { timestamp: new Date().toISOString() };
    
    const storeResult = await storeInRedis(testKey, testValue, 60);
    console.log('Store result:', storeResult);
    
    if (storeResult) {
      // Try to retrieve the value
      const retrievedValue = await getFromRedis(testKey);
      console.log('Retrieved value:', retrievedValue);
      
      if (retrievedValue && retrievedValue.timestamp === testValue.timestamp) {
        console.log('✅ Redis connection is working properly!');
        redisClient.quit();
      } else {
        console.log('❌ Redis connection test failed: Retrieved value does not match stored value');
      }
    } else {
      console.log('❌ Redis connection test failed: Could not store test value');
    }
  } catch (error) {
    console.error('❌ Redis connection test error:', error);
  }
}

testRedisConnection();
