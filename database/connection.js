const mongoose = require("mongoose");

async function connectMongoose(dbUrl) {
  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("connection error:", error);
  }
}

connectMongoose(process.env.DATABASE_URL);
