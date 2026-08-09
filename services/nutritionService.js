const BASE_URL = "https://api.nal.usda.gov/fdc/v1";

const searchFoods = async (query) => {
    const res = await fetch(`${BASE_URL}/foods/search?api_key=${process.env.USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=20`)

    if (!res.ok) throw new Error("Failed to fetch foods from USDA");

    const data = await res.json();

    return data;
}

module.exports = {
    searchFoods,
}