import { Router } from "express";
import { addTransaction, getTransactionDetailsById } from "../controllers/transaction.controller.js";

const transactionRouter = Router()

transactionRouter.post('/addTransaction',addTransaction)
transactionRouter.get('/getTransaction/:transactionId', getTransactionDetailsById)

export default transactionRouter;