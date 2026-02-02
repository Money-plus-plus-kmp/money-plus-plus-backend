import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET } from '../config/env.js';
import User from '../models/user.model.js';
import { throwError } from '../utils/errorHandle.js';

export const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throwError(401, 'No token provided. Authorization denied.');
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throwError(401, 'No token provided. Authorization denied.');
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

        // Get user from token
        const user = await User.findById(decoded._id);

        if (!user) {
            throwError(401, 'User not found. Authorization denied.');
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return next({ statusCode: 401, message: 'Token expired. Authorization denied.' });
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return next({ statusCode: 401, message: 'Invalid token. Authorization denied.' });
        }
        next(error);
    }
};

