import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User Name is required'],
        trim: true,
        min: 4,
        max: 64,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'User Email must be unique'],
        trim: true,
        lowercase: true,
        min: 8,
        max: 255,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address.']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
        min: 8,
        max: 32
    }
}, {timestamps: true});

const user = mongoose.model('User', userSchema);

export default user;