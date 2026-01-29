import Transaction from "../models/transaction.model.js";
import { throwError } from "../utils/errorHandle.js";
import User from "../models/user.model.js";
export const addTransaction= async(req ,res ,  next)=>{

    try{
       
        const {userId , type , amount , category , currency , date , note} = req.body
         if (!amount || amount <= 0) {
            throwError(400, "Amount must be greater than zero")
        }
        console.log("userId received:", userId);

       const currentUser = await User.findById(userId);
       console.log("currentUser:", currentUser);
        if (!currentUser) throwError(404, "User not found");
        (type =="income" ) ? currentUser.salary+=amount : currentUser.salary-=amount
        if (currentUser.balance < 0) {
            throwError(400, "Insufficient balance")
        }
        const transaction = await Transaction.create({
            userId : currentUser._id,
            type,
            amount,
            category ,
            currency,
            date,
            note,

        })
        await currentUser.save()
        res.status(201).json({
            code:201,
            message:'Trnasaction Added succeefully',
            data:transaction
        } );
    }
    catch(error)
    {
        next(error);

    }
};
export const getTransactionDetails = async(req , res , next)=>{

}