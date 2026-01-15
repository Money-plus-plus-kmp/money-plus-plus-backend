import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please fill a valid email address"],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false
    },
    currencyId: {
        type: Number,
    },
    salary: {
        type: Number,
        default: 0
    },
    salaryDay: {
        type: Number,
        min: 1,
        max: 31
    },
    currentBalance: {
        type: Number,
        default: 0
    },
    categories: {
        type: [String],
        default: []
    },
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;