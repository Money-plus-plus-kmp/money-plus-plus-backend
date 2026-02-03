import { Router } from "express";
import { addTransaction, getTransactionDetailsById } from "../controllers/transaction.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const transactionRouter = Router()

transactionRouter.post('/add-transaction',authenticate,addTransaction)
transactionRouter.get('/get-transaction/:transactionId', getTransactionDetailsById)

export default transactionRouter;