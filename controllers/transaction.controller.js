import Transaction from "../models/transaction.model";

export const addTransaction= async(req ,res ,  next)=>{

    try{
        const currentUser = req.User
        const {type , amount , category , currency , date , note} = req.body
         if (!amount || amount <= 0) {
            throwError(400, "Amount must be greater than zero")
        }
        (type =="income" ) ? currentUser.income+=amount : currentUser.amount-=amount
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