import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { addCategory, getCategories } from "../controllers/category.controller.js";

const categoryRouter = Router()
categoryRouter.post('/add-category', authenticate, addCategory)
categoryRouter.get('/get-categories', authenticate, getCategories)


export default categoryRouter;