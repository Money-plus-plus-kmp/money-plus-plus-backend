const currency = 'IQD';

export const getMonthlyOverview = (req, res) => {
    const { date } = req.query;
    if (!date) {
        return res.status(400).json({ error: "Missing 'date' query parameter" });
    }
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
        return res.status(400).json({ error: "Invalid 'date' query parameter" });
    }
    res.json({
        total_income: 1500000,
        total_expenses: 950000,
        saved: 650000,
        currency: currency
    });
};

export const getSpendingTrend = (req, res) => {
    const { date } = req.query;
    if (!date) {
        return res.status(400).json({ error: "Missing 'date' query parameter" });
    }
    const baseDate = new Date(date);
    if (isNaN(baseDate.getTime())) {
        return res.status(400).json({ error: "Invalid 'date' query parameter" });
    }
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
        currency: currency,
        highest_spending_day: highestSpend.day,
        highest_income_day: highestIncome.day,
        spending: spending
    });
};
