import { Router } from "express";
import { addTransaction } from "../controllers/transaction.controller";

const transactionRouter = Router()

transactionRouter.post('/addTransaction',addTransaction)

export default transactionRouter;