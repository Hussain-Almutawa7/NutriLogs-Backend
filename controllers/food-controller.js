const Food = require("../models/food");

const index = async (req, res) => {
    try {
        const allFood = await Food.find({ user: req.user._id });
        res.status(200).json(allFood);
    } catch (e) {
        res.status(500).json({ err: e.message });
    }
}

const create = async (req, res) => {
    try {

        if (
            req.body.calories === undefined ||
            req.body.protein === undefined ||
            req.body.carbohydrates === undefined ||
            req.body.fat === undefined
        ) {
            return res.status(400).json({ err: "Calories, protien, carbohydrates, and fat are required" });
        }

        const foodData = {
            user: req.user._id,
            externalId: null,
            source: "custom",
            name: req.body.name,
            brand: req.body.brand,
            servingAmount: req.body.servingAmount,
            servingUnit: req.body.servingUnit,
            calories: req.body.calories,
            protein: req.body.protein,
            carbohydrates: req.body.carbohydrates,
            fat: req.body.fat
        }

        const createdFood = await Food.create(foodData);
        res.status(201).json(createdFood);

    } catch (e) {
        res.status(400).json({ err: e.message });
    }
}

module.exports = {
    index,
    create,
}