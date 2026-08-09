const BASE_URL = "https://api.nal.usda.gov/fdc/v1";

const searchFoods = async query => {
    const res = await fetch(`${BASE_URL}/foods/search?api_key=${process.env.USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=20`)

    if (!res.ok) throw new Error("Failed to fetch foods from USDA");

    const data = await res.json();

    return data.foods.map(normalizedSearchFood); // shortcut instead of writing arrow function

}

const getFoodById = async externalId => {
    const res = await fetch(`${BASE_URL}/food/${externalId}?api_key=${process.env.USDA_API_KEY}`);

    if (!res.ok) throw new Error("Failed to fetch food from USDA");

    const data = await res.json();

    return normalizedFoodDetails(data);
}

module.exports = {
    searchFoods,
    getFoodById,
}

// Helper function for search instead of me writing .find() 4 times
function getNutrientValues(nutrients, nutrientId) {
    const nutrient = nutrients.find(nutrient => nutrient.nutrientId === nutrientId);

    return nutrient ? nutrient.value : null;
}

// Helper function for foodDetails instead of writing .find() 4 times
function getNutrientFoodDetailsValues(nutrients, nutrientId) {
    const nutrient = nutrients.find(nutrient => nutrient.nutrient.id === nutrientId);

    return nutrient ? nutrient.amount : null;
}

// Normalized search that match my needs
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

// Normalized food details that match my needs
function normalizedFoodDetails(food) {
    return {
        externalId: String(food.fdcId),
        name: food.description,
        brand: food.brandOwner || null,
        dataType: food.dataType,

        servingAmount: 100,
        servingUnit: food.servingSizeUnit,

        calories: getNutrientFoodDetailsValues(food.foodNutrients, 1008),
        protein: getNutrientFoodDetailsValues(food.foodNutrients, 1003),
        carbohydrates: getNutrientFoodDetailsValues(food.foodNutrients, 1005),
        fat: getNutrientFoodDetailsValues(food.foodNutrients, 1004),
    }
}