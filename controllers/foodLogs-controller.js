const Food = require("../models/food");
const FoodLogEntry = require("../models/foodLogEntry");

const index = async (req, res) => {
    try {

        if (!req.query.date) return res.status(400).json({ err: "Date is required" });

        const allFoodLogEntry = await FoodLogEntry.find({
            user: req.user._id,
            date: req.query.date,
        }).sort({ time: 1 });

        res.status(200).json(allFoodLogEntry);

    } catch (e) {
        res.status(500).json({ err: e.message });
    }
}

const create = async (req, res) => {
    try {
        const food = await Food.findOne({
            _id: req.body.foodId,
            user: req.user._id,
        });

        if (!food) return res.status(404).json({ err: "Food not found" });

        const consumedAmount = Number(req.body.consumedAmount);
        const consumedUnit = req.body.consumedUnit;

        // isFinite is something new, it checks NaN Infinity and -Infinity
        if (!Number.isFinite(consumedAmount) || consumedAmount <= 0) return res.status(400).json({ err: "Consumed amount must be greater than 0" });

        // Maybe later I will handle unit conversion but for now will keep it simple
        if (consumedUnit !== food.servingUnit) return res.status(400).json({ err: `Consumed unit must be ${food.servingUnit}` });

        const multiplier = consumedAmount / food.servingAmount;

        const totalCalories = food.calories * multiplier;

        const totalProtein = food.protein === null ? null : food.protein * multiplier;
        const totalCarbohydrates = food.carbohydrates === null ? null : food.carbohydrates * multiplier;
        const totalFat = food.fat === null ? null : food.fat * multiplier;

        const foodLogData = {
            user: req.user._id,

            food: food._id,
            source: food.source,
            externalId: food.externalId,
            foodName: food.name,
            brand: food.brand,

            date: req.body.date,
            time: req.body.time,

            consumedAmount,
            consumedUnit,

            baseAmount: food.servingAmount,
            baseUnit: food.servingUnit,

            caloriesPerBase: food.calories,
            proteinPerBase: food.protein,
            carbohydratesPerBase: food.carbohydrates,
            fatPerBase: food.fat,

            totalCalories,
            totalProtein,
            totalCarbohydrates,
            totalFat,
        }

        const createdFoodLogEntry = await FoodLogEntry.create(foodLogData);

        res.status(201).json(createdFoodLogEntry);

    } catch (e) {
        res.status(500).json({ err: e.message });
    }
}

const show = async (req, res) => {
    try {
        const foundEntry = await FoodLogEntry.findOne({
            _id: req.params.entryId,
            user: req.user._id,
        });

        if (!foundEntry) return res.status(404).json({ err: "Entry not found" });

        res.status(200).json(foundEntry);
    } catch (e) {
        res.status(500).json({ err: e.message });
    }
}

const update = async (req, res) => {
    try {
        const foundEntry = await FoodLogEntry.findOne({
            _id: req.params.entryId,
            user: req.user._id,
        });

        if (!foundEntry) return res.status(404).json({ err: "Entry not found" });

        const consumedAmount = Number(req.body.consumedAmount);
        const consumedUnit = req.body.consumedUnit;

        // isFinite is something new, it checks NaN Infinity and -Infinity
        if (!Number.isFinite(consumedAmount) || consumedAmount <= 0) return res.status(400).json({ err: "Consumed amount must be greater than 0" });

        // Maybe later I will handle unit conversion but for now will keep it simple
        if (consumedUnit !== foundEntry.baseUnit) return res.status(400).json({ err: `Consumed unit must be ${foundEntry.baseUnit}` });

        const multiplier = consumedAmount / foundEntry.baseAmount;

        const totalCalories = foundEntry.caloriesPerBase * multiplier;

        const totalProtein = foundEntry.proteinPerBase === null ? null : foundEntry.proteinPerBase * multiplier;
        const totalCarbohydrates = foundEntry.carbohydratesPerBase === null ? null : foundEntry.carbohydratesPerBase * multiplier;
        const totalFat = foundEntry.fatPerBase === null ? null : foundEntry.fatPerBase * multiplier;

        const entryData = {
            date: req.body.date,
            time: req.body.time,

            consumedAmount,
            consumedUnit,

            totalCalories,
            totalProtein,
            totalCarbohydrates,
            totalFat,
        }

        const updatedEntry = await FoodLogEntry.findOneAndUpdate({
            _id: req.params.entryId,
            user: req.user._id,
        }, entryData, { returnDocument: "after", runValidators: true });

        if (!updatedEntry) return res.status(404).json({ err: "Entry not found" });

        res.status(200).json(updatedEntry);

    } catch (e) {
        res.status(500).json({ err: e.message });
    }
}

module.exports = {
    index,
    create,
    show,
    update,
}