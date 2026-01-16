import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
    throw new Error("Define MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null,
    };
}

const connectToDatabase = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(DB_URI, {
            bufferCommands: false,
        });
    }

    cached.conn = await cached.promise;
    console.log(`MongoDB connected (${NODE_ENV})`);
    return cached.conn;
};

export default connectToDatabase;
