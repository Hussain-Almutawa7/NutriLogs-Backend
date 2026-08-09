const nutritionService = require("../services/nutritionService");

const search = async (req, res) => {
    try {
        const query = req.query.search;

        if (!query) return res.status(400).json({ err: "Search query is required" });

        const result = await nutritionService.searchFoods(query);

        res.status(200).json(result);

    } catch (e) {
        res.status(500).json({ err: e.message });
    }
}

module.exports = {
    search,
}