const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const productRoutes = require("./routes/product.routes");

const app = express();

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

module.exports = app;
