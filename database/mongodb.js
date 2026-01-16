import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
    throw new Error("MONGODB_URI not defined");
}

let cached = global.__mongoose__;

if (!cached) {
    cached = global.__mongoose__ = {
        conn: null,
        promise: null,
    };
}

export async function connectToDatabase () {
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
}

export default mongoose;
