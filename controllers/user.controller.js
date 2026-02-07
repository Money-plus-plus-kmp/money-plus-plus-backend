import User from "../models/user.model.js";
import Currency from "../models/currency.model.js";
import { throwError } from "../utils/errorHandle.js";
import {connectToDatabase} from "../database/mongodb.js";

export const updateCurrency = async (req, res, next) => {
    try {
      await connectToDatabase();
      const { currencyId } = req.body;

      if (!currencyId) {
          throwError(400, "Currency Id is required")
      }

      const currency = await Currency.findById(currencyId);
      if (!currency) {
          throwError(404, "Currency not found")
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { currency: currencyId },
        { new: true }
      );

      res.status(200).json({
        message: "Currency updated successfully",
        currency: user.currency,
      });
  } catch (error) {
    next(error);
  }
};

export const userDetails = async (req, res, next) => {
    try {
      await connectToDatabase();
        const user = req.user.toObject();

        delete user.password;

        res.status(200).json({
        code: 200,
        message: "User details fetched successfully",
        data: user,
        });
    } catch (error) {
        next(error);
    }
};