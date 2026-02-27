import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { addCategory, getCategories, getCategoryBreakDown } from "../controllers/category.controller.js";

const categoryRouter = Router()
categoryRouter.post('/add-category', authenticate, addCategory)
categoryRouter.get('/get-categories', authenticate, getCategories)
categoryRouter.get('/get-category-breakdown' , authenticate ,getCategoryBreakDown )


export default categoryRouter;