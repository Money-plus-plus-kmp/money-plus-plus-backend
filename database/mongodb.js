import mongoose from 'mongoose';
import {DB_URI, NODE_ENV} from "../config/env.js";

if(!DB_URI) {
    throw new Error('Define MONGODB_URI environment variable inside .env<development/production>.local');
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`MongoDB Connected to MongoDB in ${NODE_ENV}.`);
    } catch (e) {
        console.error('Error connecting to database', e);
        process.exit(1);
    }
};

export default connectToDatabase;