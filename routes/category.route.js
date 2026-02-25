import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { addCategory } from "../controllers/category.controller.js";

const categoryRouter = Router()
categoryRouter.post('/add-category' , authenticate ,addCategory)

export default categoryRouter;