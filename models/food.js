const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    externalId: {
        type: String,
        default: null,
    },
    source: {
        type: String,
        enum: ["custom", "api"],
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        default: null,
    },
    servingAmount: {
        type: Number,
        required: true,
        min: 0.01,
    },
    servingUnit: {
        type: String,
        required: true,
    },
    calories: {
        type: Number,
        required: true,
        min: 0
    },
    protein: {
        type: Number,
        default: null,
        min: 0,
    },
    carbohydrates: {
        type: Number,
        default: null,
        min: 0
    },
    fat: {
        type: Number,
        default: null,
        min: 0
    },
    isFavorite: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;