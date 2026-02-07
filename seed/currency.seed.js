import Currency from "../models/currency.model.js";
import currencies from "../data/currencies.data.js";

async function seedCurrencies() {
    const count = await Currency.countDocuments();

    if (count > 0) {
        console.log("Currencies already seeded");
        return;
    }

    await Currency.insertMany(currencies);
    console.log("Currencies seeded successfully");
}

export default seedCurrencies;