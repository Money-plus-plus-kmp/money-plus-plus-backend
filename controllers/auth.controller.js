import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import {throwError} from "../utils/errorHandle.js"
import {createTokens, saveRefreshToken} from "./token.controller.js"
import {connectToDatabase} from "../database/mongodb.js";
import Currency from "../models/currency.model.js";
import { JWT_PASSWORD_RESET_SECRET, PASSWORD_RESET_EXPIRES_IN, FRONTEND_URL } from "../config/env.js";
import { sendEmail } from "../utils/email.js";

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

        const currency = await Currency.findById(currencyId);
        if (!currency) {
            throwError(400, "Invalid currency id");
        }

        const hashedPassword = await generateHashedPassword(password);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            currency: currency._id,
            salary,
            salaryDay,
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
        await connectToDatabase();
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

export const forgotPassword = async (req, res, next) => {
  try {
    await connectToDatabase();
    const { email } = req.body;
    if (!email) throwError(400, "Email is required");

    const user = await User.findOne({ email });
    if (!user) {
      // Always return 200 to prevent email enumeration
      return res.status(200).json({
        code: 200,
        message: "If this email exists, a password reset link has been sent",
      });
    }

    // Generate reset token (JWT)
    const token = jwt.sign(
      { _id: user._id },
      JWT_PASSWORD_RESET_SECRET,
      { expiresIn: PASSWORD_RESET_EXPIRES_IN }
    );

    // Create reset link
    const resetLink = `${FRONTEND_URL}?token=${token}`;

    // Send email
    await sendEmail(
      email,
      "Password Reset Request",
      `<p>Hello ${user.name},</p>
      <p>You requested a password reset. Click the link below to reset your password (expires in 15 minutes):</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you didn't request this, you can ignore this email.</p>`
    );

    res.status(200).json({
      code: 200,
      message: "If this email exists, a password reset link has been sent",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    await connectToDatabase();
    const { token, newPassword } = req.body;
    if (!token || !newPassword) throwError(400, "Token and new password are required");

    // Verify token
    const decoded = jwt.verify(token, JWT_PASSWORD_RESET_SECRET);
    const userId = decoded._id;

    const user = await User.findById(userId).select("+password");
    if (!user) throwError(404, "User not found");

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      code: 200,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next({ statusCode: 400, message: "Reset token has expired" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next({ statusCode: 400, message: "Invalid reset token" });
    }
    next(error);
  }
};

async function generateHashedPassword(password) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}