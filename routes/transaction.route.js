import { Router } from "express";
import { addTransaction, getTransactionDetailsById } from "../controllers/transaction.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const transactionRouter = Router()

/**
 * @swagger
 * /transactions/add-transaction:
 *   post:
 *     summary: Add a transaction
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - amount
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transaction added
 */
transactionRouter.post("/add-transaction", authenticate, addTransaction);

/**
 * @swagger
 * /transactions/get-transaction/{transactionId}:
 *   get:
 *     summary: Get transaction details by ID
 *     tags: [Transaction]
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction details fetched
 */
transactionRouter.get("/get-transaction/{transactionId}", getTransactionDetailsById);


export default transactionRouter;