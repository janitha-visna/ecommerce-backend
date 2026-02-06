const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("ecommerce_db", "root", "root", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected on port 3306");
  } catch (error) {
    console.error("MySQL connection failed:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
