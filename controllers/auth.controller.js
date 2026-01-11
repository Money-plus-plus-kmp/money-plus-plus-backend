import mongoose from "mongoose"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { throwError } from "../utils/errorHandle.js"
import { createTokens, saveRefreshToken } from "./token.controller.js"

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

        if (!password || password.trim().length < 8) throwError(400, 'Password must be at least 8 characters long')

        if (!salary || salary < 0) throwError(400, 'Salary must be a positive number')

        const existingUser = await User.findOne({ email }).session(session)

        if (existingUser) throwError(409, 'User already exists')

        const hashedPassword = await generateHashedPassword(password)

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

        const { accessToken, refreshToken } = await createTokens(newUser._id)
        await saveRefreshToken(newUser._id, refreshToken, session)

        await session.commitTransaction()

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
        next(error)
    } finally {
        session.endSession();
    }
}

async function generateHashedPassword(password) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
}