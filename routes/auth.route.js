import { Router } from 'express';
import { signUp, login } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/signup', signUp);
authRouter.post('/login', login);

export default authRouter;