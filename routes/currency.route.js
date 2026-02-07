import express from "express";
import Currency from "../models/currency.model.js";

const router = express.Router();
/**
 * @swagger
 * /currencies:
 *   get:
 *     summary: Get all currencies
 *     tags: [Currency]
 *     responses:
 *       200:
 *         description: List of currencies
 */
router.get("/", async (req, res, next) => {
  try {
    const currencies = await Currency.find();
    res.status(200).json(currencies);
  } catch (error) {
    next(error);
  }
});

export default router;