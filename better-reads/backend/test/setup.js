import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { redisClient, disconnectRedis } from '../services/redisClient.js';

let mongo;

before(async function () {
  this.timeout(10000); // Increase timeout for async setup
  process.env.NODE_ENV = 'test';

  // If running in Docker, connect to the mongo service. Otherwise, use in-memory server.
  if (process.env.DOCKER_ENV === 'true') {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Mongoose connected to Docker DB.');
  } else {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
    console.log('Mongoose connected to in-memory test DB.');
  }

  // Wait for Redis to be ready, handling the case where it's already connected.
  if (redisClient.status !== 'ready') {
    await new Promise((resolve, reject) => {
      redisClient.once('ready', resolve);
      redisClient.once('error', (err) => reject(new Error(`Redis connection failed: ${err.message}`)))
    });
  }
  console.log('Redis client connected for tests.');
});

after(async () => {
  await mongoose.disconnect();
  // Only stop mongo if it was started (i.e., not in Docker)
  if (mongo) {
    await mongo.stop();
  }
  disconnectRedis();
  console.log('Mongoose and Redis disconnected.');
});

beforeEach(async () => {
  // In non-Docker environments, perform a safety check to ensure we're on the test DB.
  if (!process.env.DOCKER_ENV) {
    const { host, port } = mongoose.connection;
    const expectedHost = mongo.instanceInfo.ip;
    const expectedPort = mongo.instanceInfo.port;

    if (
      process.env.NODE_ENV !== 'test' ||
      host !== expectedHost ||
      port !== expectedPort
    ) {
      throw new Error(
        `Refusing to run deleteMany — connected to ${host}:${port}, expected ${expectedHost}:${expectedPort}`
      );
    }
  }

  // Clear Redis cache
  await redisClient.flushall();

  // Clear all collections from the database
  const collections = await mongoose.connection.db.collections();
  for (const coll of collections) {
    await coll.deleteMany({});
  }
});