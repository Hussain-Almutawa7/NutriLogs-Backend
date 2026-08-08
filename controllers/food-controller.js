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
            user: req.user._id
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
        }, foodData, { new: true, runValidators: true }); // I will later change {new: true} to {returnDocument: "after"} as mongoose suggest in my terminal since {new: true} will be deleted

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

        res.status(204).json(deletedFood); // Later I will change it 204.send but for testing pusrposes in postman will keep it like this for now

    } catch (e) {
        res.status(500).json({ err: e.message });
    }
}

const toggleFavorite = async (req, res) => {
    try {
        if (typeof req.body.isFavorite !== "boolean")
            return res.stats(400).json({ err: "isFavorite must be true or false" });

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

module.exports = {
    index,
    create,
    show,
    update,
    deleteFood,
    toggleFavorite,
}