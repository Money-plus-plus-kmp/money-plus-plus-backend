import mongoose from "mongoose"
import User from "../models/user.model.js"
import UserToken from "../models/userToken.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { JWT_EXPIRES_IN, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN } from "../config/env.js"

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const {
            name,
            email,
            password,
            currencyId,
            salary,
            salaryDay,
            currentBalance,
            categories,
        } = req.body

        if (!password || password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
        }


        const existingUser = await User.findOne({ email })

        if (existingUser) {
            const error = new Error('User already exists')
            error.statusCode = 409
            throw error
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const [newUser] = await User.create([{
            name: name,
            email: email,
            password: hashedPassword,
            currencyId: currencyId,
            salary: salary,
            salaryDay: salaryDay,
            currentBalance: currentBalance,
            categories: categories,
        }], { session })

        const { accessToken, refreshToken } = await generateTokens(newUser);

        await session.commitTransaction()
        session.endSession()

        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                accessToken,
                refreshToken,
                user: userResponse,
            },
        })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        next(error)
    }

}

export const generateTokens = async (user) => {
    const userId = { _id: user._id };
    const accessToken = jwt.sign(
        userId,
        JWT_ACCESS_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
    const refreshToken = jwt.sign(
        userId,
        JWT_REFRESH_SECRET,
        { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );

    const userToken = await UserToken.findOneAndDelete({ userId: user._id });

    await new UserToken({ userId: user._id, token: refreshToken }).save();
    return { accessToken, refreshToken };
}
