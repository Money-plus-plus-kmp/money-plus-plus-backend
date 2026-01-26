import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema({
    amount:{
        type:Double,
        required:[true,'Amount is Required']

    },
    currency:{
        type:String,
        default : "IQD"
    },
    note:{
         type:String

    },
    date:{
         type:Date,
         default:Date.now(),

    }

})