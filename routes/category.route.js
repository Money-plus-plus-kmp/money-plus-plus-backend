import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { addCategory } from "../controllers/category.controller";

const categoryRouter = Router()
categoryRouter.post('/add-category' , authenticate ,addCategory)

export default categoryRouter;