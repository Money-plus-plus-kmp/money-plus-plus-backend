
import { throwError } from "../utils/errorHandle.js";
import Transaction from "../models/transaction.model.js";

const currency = 'IQD';

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

        const [incomeAgg, expenseAgg] = await Promise.all([
            Transaction.aggregate([
                { $match: { userId: user._id, type: "income", date: { $gte: firstDay, $lte: lastDay } } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]),
            Transaction.aggregate([
                { $match: { userId: user._id, type: "expense", date: { $gte: firstDay, $lte: lastDay } } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ])
        ]);

        const total_income = incomeAgg[0]?.total || 0;
        const total_expenses = expenseAgg[0]?.total || 0;
        const saved = total_income - total_expenses;

        res.json({
            code: 200,
            message: "Monthly overview fetched successfully",
            data: {
                total_income,
                total_expenses,
                saved,
                currency: currency,
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getSpendingTrend = (req, res, next) => {
    try {
        const user = req.user;

        if (!user) throwError(401, 'User not found. Authorization denied.');

        const { date } = req.query;
        if (!date) throwError(400, "Missing 'date' query parameter");

        const baseDate = new Date(date);
        if (isNaN(baseDate.getTime())) throwError(400, "Invalid 'date' query parameter");

        // TODO: Replace with actual user data from database
        const spending = Array.from({ length: 30 }, (_, index) => {
            const day = new Date(baseDate);
            day.setDate(baseDate.getDate() - (29 - index));
            const base = 5_000;
            const dayNum = index + 1;
            const variability = ((dayNum * 1_350) % 12_000) + ((dayNum % 3) * 2_000);
            const spend = base + variability;
            const income = base + ((dayNum * 900) % 10_000);

            return {
                day: day,
                spend: spend,
                income: income
            };
        });

        const highestSpend = spending.reduce((max, entry) => (entry.spend > max.spend ? entry : max), spending[0]);
        const highestIncome = spending.reduce((max, entry) => (entry.income > max.income ? entry : max), spending[0]);

        res.json({
            code: 200,
            message: "Spending trend fetched successfully",
            date: {
                currency: currency,
                highest_spending_day: highestSpend.day,
                highest_income_day: highestIncome.day,
                spending: spending,
            }
        });
    } catch (error) {
        next(error);
    }
};
