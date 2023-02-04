import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var signin: () => string[];
}

jest.mock('../nats/nats-wrapper')

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "whatever";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

//Build a JWT payload. {id, email}
//create the JWT
//Build session Object. {jwt: MY_JWT}
//Turn that session into JSON
//Take JSON and encode it as base64
//return a string that's the cookie with the encode data
global.signin = () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  const payload = { id, email:"john20@example.com" }
  const token = jwt.sign(payload, process.env.JWT_KEY!)
  const session = { jwt: token}
  const sessionJSON = JSON.stringify(session)
  const base64 = Buffer.from(sessionJSON).toString('base64')
  return [`session=${base64}`]
};


