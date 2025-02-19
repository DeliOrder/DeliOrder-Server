import mongoose from "mongoose";

const DATABASE_URL = process.env.DATABASE_URL as string;

async function connectMongoose(dbUrl: string) {
  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("connection error:", error);
  }
}

connectMongoose(DATABASE_URL);
