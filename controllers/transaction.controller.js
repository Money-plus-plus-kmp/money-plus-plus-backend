import Transaction from "../models/transaction.model.js";
import { throwError } from "../utils/errorHandle.js";
export const addTransaction = async (req, res, next) => {

    try {
        const { type, amount, category, date, note } = req.body
        if (!amount || amount <= 0) {
            throwError(400, "Amount must be greater than zero")
        }

        const currentUser = req.user
        if (!currentUser) throwError(401, "User not found");
        const transaction = await Transaction.create({
            userId: currentUser._id,
            type,
            amount,
            category,
            date,
            note,

        })
        const currentBalance = await calculateBalance(currentUser._id);
        if (type === "expense" && currentBalance < amount) {
            throwError(400, "Insufficient balance");
        }

        res.status(201).json({
            code: 201,
            message: 'Trnasaction Added succeefully',
            data: transaction
        });
    }
    catch (error) {
        next(error);

    }
};
export const getTransactionDetailsById = async (req, res, next) => {
    try {
        const { transactionId } = req.params;
        if (!transactionId) throwError(400, "transactionId is required");

        const transaction = await Transaction.findById(transactionId)
        if (!transaction) throwError(404, "Transaction not found");
        res.status(200).json({
            code: 200,
            message: "Transaction details fetched successfully",
            data: transaction
        });

    } catch (error) {
        next(error);
    }
};
const calculateBalance = async (userId) => {
    const result = await Transaction.aggregate([
        { $match: { userId } },
        {
            $group: {
                _id: null,
                balance: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "income"] },
                            "$amount",
                            { $multiply: ["$amount", -1] }
                        ]
                    }
                }
            }
        }
    ]);

    return result[0]?.balance || 0;
};
