import Category from "../models/category.model.js";
import { throwError } from "../utils/errorHandle.js";
export const saveCategory = async(req , res , next)=>
{
    try{
       await connectToDatabase();
       const {name} = req.body
       const currentUser = req.user
       if (!currentUser) throwError(401, "User not found");
        const category = await Category.create({
                   userId: currentUser._id,
                   name
        })
         res.status(201).json({
            code: 201,
            message: 'Category Added succeefully',
            data: category
        });
    }
    catch(error)
    {
        next(error);
    }

}