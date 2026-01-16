import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import {throwError} from "../utils/errorHandle.js"
import {createTokens, saveRefreshToken} from "./token.controller.js"
import {connectToDatabase} from "../database/mongodb.js";

export const signUp = async (req, res, next) => {
    try {
        await connectToDatabase();
        const {
            name,
            email,
            password,
            currencyId,
            salary,
            salaryDay,
            currentBalance,
            categories,
        } = req.body || {};

        if (!email || !password) {
            throwError(400, "Email and password are required");
        }

        if (password.trim().length < 8) {
            throwError(400, "Password must be at least 8 characters long");
        }

        if (salary == null || salary < 0) {
            throwError(400, "Salary must be a positive number");
        }

        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) {
            throwError(409, "Email already used by another account");
        }

        const hashedPassword = await generateHashedPassword(password);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            currencyId,
            salary,
            salaryDay,
            currentBalance,
            categories,
        });

        const { accessToken, refreshToken } = await createTokens(newUser._id);
        await saveRefreshToken(newUser._id, refreshToken);

        const userResponse = newUser.toObject();
        delete userResponse.password;

        return res.status(201).json({
            code: 201,
            message: "User created successfully",
            data: {
                accessToken,
                refreshToken,
                user: userResponse,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        if (!req.body) throwError(400, 'Should provide login data')

        const { email, password } = req.body

        if (!email || !password) {
            throwError(400, 'Email and password are required')
        }

        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            throwError(401, 'Invalid email or password')
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            throwError(401, 'Invalid email or password')
        }

        const { accessToken, refreshToken } = await createTokens(user._id)

        await saveRefreshToken(user._id, refreshToken)

        res.status(200).json({
            code: 200,
            message: 'Login successful',
            data: {
                accessToken,
                refreshToken,
            },
        })
    } catch (error) {
        next(error)
    }
}

async function generateHashedPassword(password) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}