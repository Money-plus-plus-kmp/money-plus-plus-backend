import { Router } from 'express';
import { signUp, login, forgotPassword, resetPassword } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/signup', signUp);
authRouter.post('/login', login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);


export default authRouter;