import express from "express";
import Currency from "../models/currency.model.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const currencies = await Currency.find();
    res.status(200).json(currencies);
  } catch (error) {
    next(error);
  }
});

export default router;