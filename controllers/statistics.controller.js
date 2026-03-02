
import { throwError } from "../utils/errorHandle.js";
import Transaction from "../models/transaction.model.js";
import { connectToDatabase } from "../database/mongodb.js";

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

        await connectToDatabase();

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
                currency: user.currency?.code || null,
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

        await connectToDatabase();

        const agg = await Transaction.aggregate([
            {
                $match: {
                    userId: user._id,
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$date" }
                    },
                    spend: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
                        }
                    },
                    income: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
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
                                cond: { $eq: ["$$item.spend", "$highestSpend"] }
                            }
                        }
                    },
                    highest_income_day: {
                        $first: {
                            $filter: {
                                input: "$spending",
                                as: "item",
                                cond: { $eq: ["$$item.income", "$highestIncome"] }
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
                currency: user.currency?.code || null,
                highest_spending_day: highestSpend ? highestSpend.day : null,
                highest_income_day: highestIncome ? highestIncome.day : null,
                spending: spending,
            }
        });
    } catch (error) {
        next(error);
    }
};
export const getCategoryBreakDown = async (req, res, next) => {
    try {
        const currentUser = req.user
        const { month, year } = req.body

        const startDate = new Date(year, month - 1, 1)
        const endDate = new Date(year, month, 1)

        const result = await Transaction.aggregate([
            {
                $match: {
                    userId: currentUser._id,
                    type: "expense",
                    date: { $gte: startDate, $lt: endDate }
                }
            },
            {
                $group: {
                    _id: "$category",
                    total_spend: { $sum: "$amount" }
                }
            },
            {
                $sort: { total_spend: -1 }
            },
            {
                $group: {
                    _id: null,
                    total_expenses: { $sum: "$total_spend" },
                    categories: { $push: "$$ROOT" }
                }
            },
            {
                $project: {
                    _id: 0,
                    total_expenses: 1,
                    topCategories: { $slice: ["$categories", 4] },
                    otherCategories: { $slice: ["$categories", 4, { $size: "$categories" }] }
                }
            },
            {
                $project: {
                    total_expenses: 1,
                    categories: {
                        $concatArrays: [
                            {
                                $map: {
                                    input: "$topCategories",
                                    as: "cat",
                                    in: {
                                        categoryId: "$$cat._id",
                                        total_spend: "$$cat.total_spend",
                                        percentage: {
                                            $cond: [
                                                { $eq: ["$total_expenses", 0] },
                                                "0.00",
                                                {
                                                    $toString: {
                                                        $round: [
                                                            { $divide: ["$$cat.total_spend", "$total_expenses"] },
                                                            2
                                                        ]
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                $cond: [
                                    { $gt: [{ $size: "$otherCategories" }, 0] },
                                    [{
                                        name: "Other",
                                        total_spend: {
                                            $sum: "$otherCategories.total_spend"
                                        },
                                        percentage: {
                                            $toString: {
                                                $round: [
                                                    {
                                                        $divide: [
                                                            { $sum: "$otherCategories.total_spend" },
                                                            "$total_expenses"
                                                        ]
                                                    },
                                                    2
                                                ]
                                            }
                                        }
                                    }],
                                    []
                                ]
                            }
                        ]
                    }
                }
            }
        ])

        res.status(200).json({
            total_expenses: result[0]?.total_expenses || 0,
            currency: currentUser.currency,
            categories: result[0]?.categories || []
        })

    } catch (error) {
        next(error)
    }
};