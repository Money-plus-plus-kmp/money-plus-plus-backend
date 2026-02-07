import mongoose from "mongoose";

const currencySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Currency = mongoose.model("Currency", currencySchema);
export default Currency;