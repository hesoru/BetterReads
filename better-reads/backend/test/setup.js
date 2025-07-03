import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo;

before(async () => {
  process.env.NODE_ENV = 'test'; //this is important to ensure not run on production database
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  console.log("mongo.getUri()", mongo.getUri())
});

after(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

beforeEach(async () => {
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

  const collections = await mongoose.connection.db.collections();
  for (const coll of collections) {
    await coll.deleteMany();
  }
});