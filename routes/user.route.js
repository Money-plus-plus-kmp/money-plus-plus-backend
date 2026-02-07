import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { updateCurrency, userDetails } from "../controllers/user.controller.js";

const userRouter = express.Router();

router.get("/", authenticate, userDetails);
router.put("/currency", authenticate, updateCurrency);

export default userRouter;