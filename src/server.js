require("dotenv").config();
const app = require("./app");
const { connectDB, sequelize } = require("./config/db");

// Import models so associations are registered
const User = require("./models/user.model");
const Cart = require("./models/cart.model");

connectDB();

sequelize
  .sync({ alter: true }) // or { force: true } for dev environment
  .then(() => {
    console.log("MySQL tables synced");
  })
  .catch((err) => {
    console.error("Error syncing tables:", err);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
