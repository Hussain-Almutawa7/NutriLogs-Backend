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


// MIDDLEWARES HERE
const verifyToken = require("./middleware/verify-token");

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// AUTHENTICATION ROUTES
app.post("/auth/sign-up", authCtrl.signUp);
app.post("/auth/sign-in", authCtrl.signIn);


// MONGO CONNECTION
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to MongoDB ${mongoose.connection.name}. 🥭`);
        app.listen(PORT, () => {
            console.log(`The express app is ready on port ${PORT}! 😀`);
        });
    } catch (e) {
        console.log("Error Message:", e.message)
    }
}

startServer();
