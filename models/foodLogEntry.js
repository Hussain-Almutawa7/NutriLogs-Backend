const mongoose = require("mongoose");

const foodLogEntrySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
        default: null,
    },
    source: {
        type: String,
        enum: ["custom", "api"],
        required: true,
    },
    externalId: {
        type: String,
        default: null
    },
    foodName: {
        type: String,
        required: true,
        trim: true,
    },
    brand: {
        type: String,
        default: null,
    },
    date: {
        type: String,
        required: true,
        match: /^\d{4}-\d{2}-\d{2}$/,
    },
    time: {
        type: String,
        required: true,
        match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    consumedAmount: {
        type: Number,
        required: true,
        min: 0.01,
    },
    consumedUnit: {
        type: String,
        required: true
    },
    baseAmount: {
        type: Number,
        required: true,
        min: 0.01,
    },
    baseUnit: {
        type: String,
        required: true,
    },
    caloriesPerBase: {
        type: Number,
        required: true,
        min: 0,
    },
    proteinPerBase: {
        type: Number,
        default: null,
        min: 0,
    },
    carbohydratesPerBase: {
        type: Number,
        default: null,
        min: 0,
    },
    fatPerBase: {
        type: Number,
        default: null,
        min: 0,
    },
    totalCalories: {
        type: Number,
        required: true,
        min: 0,
    },
    totalProtein: {
        type: Number,
        default: null,
        min: 0,
    },
    totalCarbohydrates: {
        type: Number,
        default: null,
        min: 0,
    },
    totalFat: {
        type: Number,
        default: null,
        min: 0,
    },
}, { timestamps: true });

const FoodLogEntry = mongoose.model("FoodLogEntry", foodLogEntrySchema);

module.exports = FoodLogEntry;