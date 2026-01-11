import jwt from 'jsonwebtoken';
import UserToken from '../models/userToken.model.js';
import { JWT_EXPIRES_IN, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN } from "../config/env.js"

export const createTokens = (userId) => {
    const accessToken = jwt.sign(
        { _id: userId },
        JWT_ACCESS_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
        { _id: userId },
        JWT_REFRESH_SECRET,
        { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );

    return { accessToken, refreshToken };
};

export const saveRefreshToken = async (userId, token, session) => {
    await UserToken.findOneAndDelete({ userId }, { session });
    await UserToken.create([{ userId, token }], { session });
};
