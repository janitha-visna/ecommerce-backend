const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const auth = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order & checkout management
 */

/**
 * @swagger
 * /api/orders/checkout:
 *   post:
 *     summary: Checkout cart and place order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order placed successfully
 */
router.post("/checkout", auth, orderController.checkout);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get logged-in user's order history
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders retrieved successfully
 */
router.get("/", auth, orderController.getOrders);

module.exports = router;
