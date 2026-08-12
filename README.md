# NutriLogs Backend

*The REST API for NutriLogs, handling authentication, food management, food logging, nutrition goals, dashboard summaries, and USDA FoodData Central integration.*

## Repositories

[NutriLogs Backend Repository](https://github.com/Hussain-Almutawa7/NutriLogs-Backend)

[NutriLogs Frontend Repository](https://github.com/Hussain-Almutawa7/NutriLogs-Frontend)

## Features

* JWT-based authentication.
* Protected user routes.
* Full CRUD for custom foods.
* Full CRUD for food log entries.
* Favorite and unfavorite foods.
* Import USDA foods into a user's library.
* Log USDA foods directly without saving them first.
* Update daily calorie and macronutrient goals.
* Generate daily and weekly nutrition summaries.
* User ownership checks for foods and food log entries.
* USDA FoodData Central integration.

## Installation

Clone the repository:

```bash
git clone https://github.com/Hussain-Almutawa7/NutriLogs-Backend.git
cd NutriLogs-Backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
USDA_API_KEY=your_usda_api_key
PORT=3000
```

Start the development server:

```bash
npm run dev
```

The API normally runs at:

```text
http://localhost:3000
```

## Technologies Used

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Token
* bcrypt
* cors
* dotenv
* morgan
* USDA FoodData Central API

## API Routes

All protected routes require:

```text
Authorization: Bearer <token>
```

### Authentication

```text
POST /api/auth/sign-up
POST /api/auth/sign-in
```

### User Goals

```text
PATCH /api/users/goals
```

### Foods

```text
GET    /api/foods
POST   /api/foods
POST   /api/foods/import
GET    /api/foods/:foodId
PUT    /api/foods/:foodId
DELETE /api/foods/:foodId
PATCH  /api/foods/:foodId/favorite
```

Food filtering supports:

```text
GET /api/foods?favorite=true
GET /api/foods?source=custom
```

### Food Logs

```text
GET    /api/food-logs
POST   /api/food-logs
GET    /api/food-logs/summary
GET    /api/food-logs/:entryId
PUT    /api/food-logs/:entryId
DELETE /api/food-logs/:entryId
```

Daily food logs can be requested using:

```text
GET /api/food-logs?date=YYYY-MM-DD
```

### USDA Nutrition

```text
GET /api/nutrition/search
GET /api/nutrition/:externalId
```

## Database Models

### User

Stores:

* Username
* Hashed password
* Calorie goal
* Protein goal
* Carbohydrate goal
* Fat goal

### Food

Stores custom and saved USDA foods, including:

* User
* External USDA ID
* Source
* Name
* Brand
* Serving information
* Calories
* Protein
* Carbohydrates
* Fat
* Favorite status

### FoodLogEntry

Stores a historical snapshot of consumed food, including:

* User
* Optional Food reference
* Food name and brand
* Source
* External USDA ID
* Date and time
* Consumed amount and unit
* Base serving information
* Nutrition per base serving
* Total calories and macronutrients

Food log entries store nutrition snapshots so historical data remains accurate if the original Food is later edited or deleted.

## Authentication and Ownership

NutriLogs uses JWT authentication.

Protected routes use middleware to verify the token and make the authenticated user available through:

```js
req.user
```

User-owned database queries use:

```js
req.user._id
```

This prevents users from accessing or modifying another user's foods or food log entries.

## Food and Food Log CRUD

Custom foods support:

* **Create**
* **Read**
* **Update**
* **Delete**

Food log entries also support full CRUD.

Nutrition totals are calculated using:

```text
multiplier = consumedAmount / baseAmount
```

The multiplier is applied to calories and available macronutrients.

## USDA Integration

The backend communicates directly with USDA FoodData Central.

It handles:

* Food search.
* Food details.
* Nutrition normalization.
* Importing USDA foods.
* Direct USDA food logging.

The USDA API key is stored only on the backend and is never exposed to the React frontend.

## Dashboard Summary

The summary endpoint calculates:

* Today's calories.
* Today's protein.
* Today's carbohydrates.
* Today's fat.
* Remaining nutrition compared with user goals.
* Weekly calorie totals.

The endpoint accepts date information through query parameters such as:

```text
startDate
endDate
today
```

## Validation and Security

The backend validates:

* Required fields.
* Positive serving and consumed amounts.
* Non-negative nutrition values.
* Valid dates and times.
* Finite numeric values.
* Food ownership.
* Food log ownership.

User IDs supplied by the frontend are not trusted for ownership checks.

## Future Enhancements

* Add meal categories.
* Add recipe support.
* Add unit conversion.
* Add additional nutrients.
* Add barcode scanning.
* Add longer-term nutrition reports.
* Add account management and password recovery.

## Credits

Food and nutrition data is provided by [USDA FoodData Central](https://fdc.nal.usda.gov/).
