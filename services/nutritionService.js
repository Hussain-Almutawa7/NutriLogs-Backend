const BASE_URL = "https://api.nal.usda.gov/fdc/v1";

const searchFoods = async (query) => {
    const res = await fetch(`${BASE_URL}/foods/search?api_key=${process.env.USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=20`)

    if (!res.ok) throw new Error("Failed to fetch foods from USDA");

    const data = await res.json();

    return data.foods.map(normalizedSearchFood); // shortcut instead of writing arrow function

}

module.exports = {
    searchFoods,
}

// Helper function instead of me writing .find() 4 times
function getNutrientValues(nutrients, nutrientId) {
    const nutrient = nutrients.find(nutrient => nutrient.nutrientId === nutrientId);

    return nutrient ? nutrient.value : null;
}

// Normalized data that match my needs
function normalizedSearchFood(food) {
    return {
        externalId: String(food.fdcId),
        name: food.description,
        brand: food.brandOwner || null,
        dataType: food.dataType,

        calories: getNutrientValues(food.foodNutrients, 1008),
        protein: getNutrientValues(food.foodNutrients, 1003),
        carbohydrates: getNutrientValues(food.foodNutrients, 1005),
        fat: getNutrientValues(food.foodNutrients, 1004),
    }
}