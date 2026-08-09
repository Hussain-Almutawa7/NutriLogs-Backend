const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const PORT = process.env.PORT || "3000";

// CONTROLLERS HERE
const authCtrl = require("./controllers/auth-controller");
const foodCtrl = require("./controllers/food-controller");
const foodLogCtrl = require("./controllers/foodLogs-controller");
const nutritionCtrl = require("./controllers/nutrition-controller");

// MIDDLEWARES HERE
const verifyToken = require("./middleware/verify-token");

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// AUTHENTICATION ROUTES
app.post("/api/auth/sign-up", authCtrl.signUp);
app.post("/api/auth/sign-in", authCtrl.signIn);

// FOOD ROUTES
app.get("/api/foods", verifyToken, foodCtrl.index);
app.post("/api/foods", verifyToken, foodCtrl.create);
app.get("/api/foods/:foodId", verifyToken, foodCtrl.show);
app.put("/api/foods/:foodId", verifyToken, foodCtrl.update);
app.delete("/api/foods/:foodId", verifyToken, foodCtrl.deleteFood);
app.patch("/api/foods/:foodId/favorite", verifyToken, foodCtrl.toggleFavorite); // PUT will work but I used patch since it is the best practice for partial updates

// FOOD LOGS ROUTES
app.get("/api/food-logs", verifyToken, foodLogCtrl.index);
app.post("/api/food-logs", verifyToken, foodLogCtrl.create);
app.get("/api/food-logs/:entryId", verifyToken, foodLogCtrl.show);
app.put("/api/food-logs/:entryId", verifyToken, foodLogCtrl.update);
app.delete("/api/food-logs/:entryId", verifyToken, foodLogCtrl.deleteEntry);

// SEARCH ROUTES
app.get("/api/nutrition/search", verifyToken, nutritionCtrl.search);

// MONGO CONNECTION
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to MongoDB ${mongoose.connection.name}. 🥭`);
        app.listen(PORT, () => {
            console.log(`The express app is ready on port ${PORT}! 😀`);
        });
    } catch (e) {
        console.log("Error Message:", e.message);
    }
}

startServer();