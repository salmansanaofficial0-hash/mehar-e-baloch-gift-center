import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mehar-e-baloch-gift-center';
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    if (!process.env.MONGO_URI) {
      try {
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri('mehar-e-baloch-gift-center');
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB connected via in-memory server: ${conn.connection.host}`);
        return;
      } catch (memoryError) {
        console.error('MongoDB memory fallback failed:', memoryError.message);
      }
    }

    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
