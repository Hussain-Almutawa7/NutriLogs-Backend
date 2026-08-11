const Food = require("../models/food");
const nutritionService = require("../services/nutritionService");

const index = async (req, res) => {
    try {
        const filter = {
            user: req.user._id,
        }

        if (req.query.favorite === "true") {
            filter.isFavorite = true;
        } else if (req.query.source === "custom") {
            filter.source = "custom"
        } else {
            filter.$or = [
                { source: "custom" },
                { isFavorite: true }
            ];
        }

        const allFood = await Food.find(filter);
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
            return res.status(400).json({ err: "Calories, protein, carbohydrates, and fat are required" });
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
            fat: req.body.fat,
        }

        const createdFood = await Food.create(foodData);
        res.status(201).json(createdFood);

    } catch (e) {
        res.status(400).json({ err: e.message });
    }
}

const show = async (req, res) => {
    try {
        const foundFood = await Food.findOne({
            _id: req.params.foodId,
            user: req.user._id,

            $or: [
                { source: "custom" },
                { isFavorite: true }
            ]
        });

        if (!foundFood) return res.status(404).json({ err: "Food not found" });

        res.status(200).json(foundFood);

    } catch (e) {
        res.status(500).json({ err: e.message });
    }
}

const update = async (req, res) => {
    try {

        if (
            req.body.calories === undefined ||
            req.body.protein === undefined ||
            req.body.carbohydrates === undefined ||
            req.body.fat === undefined
        ) {
            return res.status(400).json({ err: "Calories, protein, carbohydrates, and fat are required" });
        }

        const foodData = {
            name: req.body.name,
            brand: req.body.brand,

            servingAmount: req.body.servingAmount,
            servingUnit: req.body.servingUnit,

            calories: req.body.calories,
            protein: req.body.protein,
            carbohydrates: req.body.carbohydrates,
            fat: req.body.fat,
        }

        const updatedFood = await Food.findOneAndUpdate({
            _id: req.params.foodId,
            user: req.user._id,
            source: "custom",
        }, foodData, { returnDocument: "after", runValidators: true });

        if (!updatedFood) return res.status(404).json({ err: "Custom food not found" });

        res.status(200).json(updatedFood);

    } catch (e) {
        res.status(500).json({ err: e.message });
    }
}

const deleteFood = async (req, res) => {
    try {
        const deletedFood = await Food.findOneAndDelete({
            _id: req.params.foodId,
            user: req.user._id,
        });

        if (!deletedFood) return res.status(404).json({ err: "Food not found" });

        res.status(204).send();

    } catch (e) {
        res.status(500).json({ err: e.message });
    }
}

const toggleFavorite = async (req, res) => {
    try {
        if (typeof req.body.isFavorite !== "boolean")
            return res.status(400).json({ err: "isFavorite must be true or false" });

        const updateFood = await Food.findOneAndUpdate({
            _id: req.params.foodId,
            user: req.user._id,
        }, {
            isFavorite: req.body.isFavorite
        }, { new: true, runValidators: true }); // I will later change {new: true} to {returnDocument: "after"} as mongoose suggest in my terminal since {new: true} will be deleted

        if (!updateFood) return res.status(404).json({ err: "Food not found" });

        res.status(200).json(updateFood);

    } catch (e) {
        res.status(500).json({ err: e.message });
    }
}

const importFoodFromApi = async (req, res) => {
    try {
        const externalId = req.body.externalId

        if (!externalId) return res.status(400).json({ err: "Api Food not found" });

        const foundFood = await Food.findOne({
            externalId,
            user: req.user._id,
            source: "api",
        });

        if (foundFood) {
            foundFood.isFavorite = true;
            await foundFood.save();
            return res.status(200).json(foundFood);
        }

        const apiFood = await nutritionService.getFoodById(externalId);

        const foodData = {
            user: req.user._id,

            externalId,
            source: "api",

            name: apiFood.name,
            brand: apiFood.brand,

            servingAmount: apiFood.servingAmount,
            servingUnit: apiFood.servingUnit,

            calories: apiFood.calories,
            protein: apiFood.protein,
            carbohydrates: apiFood.carbohydrates,
            fat: apiFood.fat,

            isFavorite: true,

        }

        const createdApiFood = await Food.create(foodData);
        res.status(201).json(createdApiFood);

    } catch (e) {
        res.status(500).json({ err: e.message });
    }
}

module.exports = {
    index,
    create,
    show,
    update,
    deleteFood,
    toggleFavorite,
    importFoodFromApi,
}