const express = require("express");
const path = require("path");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const productRoutes = require("./routes/product.routes");

const app = express();

app.use(express.json());

// serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/products", productRoutes);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

module.exports = app;
