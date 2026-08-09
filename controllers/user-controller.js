const User = require("../models/user");

const updateGoals = async (req, res) => {
    try {
        const goalData = {};

        if (req.body.calorieGoal !== undefined)
            goalData.calorieGoal = Number(req.body.calorieGoal);

        if (req.body.proteinGoal !== undefined)
            goalData.proteinGoal = Number(req.body.proteinGoal);

        if (req.body.carbohydrateGoal !== undefined)
            goalData.carbohydrateGoal = Number(req.body.carbohydrateGoal);

        if (req.body.fatGoal !== undefined)
            goalData.fatGoal = Number(req.body.fatGoal);

        const goals = Object.values(goalData);

        const invalidGaols = goals.some(goal => !Number.isFinite(goal) || goal < 0);

        if (invalidGaols) return res.status(400).json({ err: "Goals must be valid numbers and greater than or equal to 0" });

        if(goals.length === 0) return res.status(400).json({err : "At least one goal is required"});

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            goalData,
            { returnDocument: "after", runValidators: true }
        );

        if (!updatedUser) return res.status(404).json({ err: "User not found." });

        res.status(200).json(updatedUser);

    } catch (e) {
        res.status(500).json({ err: e.message });
    }
}

module.exports = {
    updateGoals,
}