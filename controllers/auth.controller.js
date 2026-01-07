import mongoose from "mongoose"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js"

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    console.log('Request Body:', req.body)

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

        const newUser = await User.create([{
            name: name,
            email: email,
            password: hashedPassword,
            currencyId: currencyId,
            salary: salary,
            salaryDay: salaryDay,
            currentBalance: currentBalance,
            categories: categories,
        }], { session })

        const token = jwt.sign(
            { userId: newUser[0]._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        )

        await session.commitTransaction()
        session.endSession()

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                token,
                user: newUser[0],
            },
        })
    } catch (error) {
        await session.abortTransaction()
        next(error)
    }

}