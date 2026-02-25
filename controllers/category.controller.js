import Category from "../models/category.model.js";
import { throwError } from "../utils/errorHandle.js";
export const addCategory= async(req , res , next)=>
{
    try{
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

};
export const getCategories = async(req , res , next )=>
{
    try{
        const categories = await Category.find({});
        if (!categories || categories.length == 0 ) throwError(404, "No Categories found");
                res.status(200).json({
                    code: 200,
                    message: "Categories Fetched successfully",
                    data: categories
                });

    }
    catch(error)
    {
        next(error);
    }
};