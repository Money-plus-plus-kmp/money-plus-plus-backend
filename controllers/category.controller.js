import Category from "../models/category.model.js";
import Transaction from "../models/transaction.model.js";
import { throwError } from "../utils/errorHandle.js";
export const addCategory = async (req, res, next) => {
    try {
        const { name } = req.body
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
    catch (error) {
        next(error);
    }

};
export const getCategories = async (req, res, next) => {
    try {
        const currentUser = req.user
        const categories = await Category.find({
            userId: currentUser._id
        });
        if (!categories || categories.length == 0) throwError(404, "No Categories found");
        res.status(200).json({
            code: 200,
            message: "Categories Fetched successfully",
            data: categories
        });

    }
    catch (error) {
        next(error);
    }
};
export const getCategoryBreakDown = async (req, res, next) => {
    try {
        const currentUser = req.user
        const { month, year } = req.body
        const startDate = new Date(year, month - 1, 1)
        const endDate = new Date(year, month, 1)
        const result = await Transaction.aggregate(
            [
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
                        total_spend: { $sum: "$amount" },
                    }
                }
            ]
        );
        const totalExpenses = result.reduce((sum, item) =>
            sum += item.total_spend, 0
        );
        const categories = result.map(item => ({
            categoryId: item._id,
            total_spend: item.total_spend,
            percentage: totalExpenses
                ? (item.total_spend / totalExpenses).toFixed(2)
                : "0.00"
        }));
        categories.sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));
        const topCategories = categories.slice(0, 4);
        const otherCategories = categories.slice(4);
        if (otherCategories.length >= 1) {
            const otherTotalSpend = otherCategories.reduce((sum, item) => sum += item.total_spend, 0);
            const otherTotalPrecentage = otherCategories.reduce((sum, item) => sum + parseFloat(item.percentage), 0).toFixed(2);
            topCategories.push({
                name: "Other",
                total_spend: otherTotalSpend,
                percentage: otherTotalPrecentage
            });
        }
        res.status(200).json({
            total_expenses: totalExpenses,
            currency: currentUser.currency,
            categories: topCategories
        });


    }
    catch (error) {
        next(error);
    }

}