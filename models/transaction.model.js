import mongoose from "mongoose";

export const transactionSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required :[true],
    },
    category:{
        type:String , 
        required:function(){
           return this.type == "expense"
        }

    },

    amount:{
        type:Number,
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

    },
    type:{
        type:String,
        enum :["income" , "expense"],
        required:true

    }

},{timestamps:true})