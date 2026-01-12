const currency = 'IQD';

export const getMonthlyOverview = (req, res) => {

    res.json({
        total_income: 1500000,
        total_expenses: 950000,
        saved: 650000,
        currency: currency
    });
};

export const getSpendingTrend = (req, res) => {

    const today = new Date();
    const spending = Array.from({ length: 30 }, (_, index) => {
        const day = new Date(today);
        day.setDate(today.getDate() - (29 - index));
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
