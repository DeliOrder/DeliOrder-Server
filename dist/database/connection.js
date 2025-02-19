"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DATABASE_URL = process.env.DATABASE_URL;
async function connectMongoose(dbUrl) {
    try {
        await mongoose_1.default.connect(dbUrl);
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.error("connection error:", error);
    }
}
connectMongoose(DATABASE_URL);
