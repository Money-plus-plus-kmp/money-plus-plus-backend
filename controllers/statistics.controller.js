
import { throwError } from "../utils/errorHandle.js";
import Transaction from "../models/transaction.model.js";

export const getMonthlyOverview = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) throwError(401, 'User not found. Authorization denied.');

        const { date } = req.query;
        if (!date) throwError(400, "Missing 'date' query parameter");

        const parsed = new Date(date);
        if (isNaN(parsed.getTime())) throwError(400, "Invalid 'date' query parameter");

        const year = parsed.getFullYear();
        const month = parsed.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0, 23, 59, 59, 999);


        const overviewAgg = await Transaction.aggregate([
            { $match: { userId: user._id, date: { $gte: firstDay, $lte: lastDay } } },
            {
                $group: {
                    _id: null,
                    total_income: {
                        $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] }
                    },
                    total_expenses: {
                        $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] }
                    }
                }
            }
        ]);

        const total_income = overviewAgg[0]?.total_income || 0;
        const total_expenses = overviewAgg[0]?.total_expenses || 0;
        const saved = total_income - total_expenses;

        res.json({
            code: 200,
            message: "Monthly overview fetched successfully",
            data: {
                total_income,
                total_expenses,
                saved,
                currency: user.currency,
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getSpendingTrend = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) throwError(401, 'User not found. Authorization denied.');

        const { date } = req.query;
        if (!date) throwError(400, "Missing 'date' query parameter");

        const baseDate = new Date(date);
        if (isNaN(baseDate.getTime())) throwError(400, "Invalid 'date' query parameter");

        const year = baseDate.getFullYear();
        const month = baseDate.getMonth();

        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

        const agg = await Transaction.aggregate([
            { $match: {
                userId: user._id,
                date: { $gte: startDate, $lte: endDate }
            }},
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$date" }
                    },
                    spend: {
                        $sum: {
                            $cond: [ { $eq: [ "$type", "expense" ] }, "$amount", 0 ]
                        }
                    },
                    income: {
                        $sum: {
                            $cond: [ { $eq: [ "$type", "income" ] }, "$amount", 0 ]
                        }
                    }
                }
            },
            { $sort: { _id: 1 } },
            {
                $group: {
                    _id: null,
                    spending: { $push: { day: "$_id", spend: "$spend", income: "$income" } },
                    highestSpend: { $max: "$spend" },
                    highestIncome: { $max: "$income" },
                }
            },
            {
                $project: {
                    spending: 1,
                    highest_spending_day: {
                        $first: {
                            $filter: {
                                input: "$spending",
                                as: "item",
                                cond: { $eq: [ "$$item.spend", "$highestSpend" ] }
                            }
                        }
                    },
                    highest_income_day: {
                        $first: {
                            $filter: {
                                input: "$spending",
                                as: "item",
                                cond: { $eq: [ "$$item.income", "$highestIncome" ] }
                            }
                        }
                    }
                }
            }
        ]);

        const result = agg[0] || {};
        const spending = result.spending || [];
        const highestSpend = result.highest_spending_day || null;
        const highestIncome = result.highest_income_day || null;

        res.json({
            code: 200,
            message: "Spending trend fetched successfully",
            date: {
                currency: user.currency,
                highest_spending_day: highestSpend ? highestSpend.day : null,
                highest_income_day: highestIncome ? highestIncome.day : null,
                spending: spending,
            }
        });
    } catch (error) {
        next(error);
    }
};
