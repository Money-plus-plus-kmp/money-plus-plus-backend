import { config } from 'dotenv';

config({path: `.env.${process.env.NODE_ENV || 'development'}.local`});

export const {
    PORT, NODE_ENV,
    DB_URI, JWT_SECRET,
    JWT_ACCESS_SECRET, JWT_REFRESH_SECRET,
    JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN,
    SMTP_HOST, SMTP_PORT,
    SMTP_USER, SMTP_PASS,
    EMAIL_FROM, JWT_PASSWORD_RESET_SECRET,
     PASSWORD_RESET_EXPIRES_IN, FRONTEND_URL
} = process.env;