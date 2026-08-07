const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    calorieGoal: {
        type: Number,
        default: 2000,
        min: 0
    },
    proteinGoal: {
        type: Number,
        default: 150,
        min: 0,
    },
    carbohydrateGoal: {
        type: Number,
        default: 250,
        min: 0,
    },
    fatGoal: {
        type: Number,
        default: 70,
        min: 0,
    }
}, { timestamps: true });

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        delete returnedObject.password
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;