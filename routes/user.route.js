import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { updateCurrency, userDetails } from "../controllers/user.controller.js";

const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get current user details
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details fetched
 */
userRouter.get("/", authenticate, userDetails);

/**
 * @swagger
 * /users/currency:
 *   put:
 *     summary: Update user currency
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currencyId
 *             properties:
 *               currencyId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Currency updated successfully
 */
userRouter.put("/currency", authenticate, updateCurrency);


export default userRouter;