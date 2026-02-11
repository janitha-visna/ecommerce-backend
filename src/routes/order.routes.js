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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order placed successfully
 *                 orderId:
 *                   type: integer
 *                   example: 12345
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
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get("/", auth, orderController.getOrders);

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         productId:
 *           type: integer
 *           example: 10
 *         name:
 *           type: string
 *           example: Classic Cotton T-Shirt
 *         quantity:
 *           type: integer
 *           example: 2
 *         price:
 *           type: number
 *           example: 29.99
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 12345
 *         userId:
 *           type: integer
 *           example: 1
 *         total:
 *           type: number
 *           example: 89.98
 *         status:
 *           type: string
 *           example: Delivered
 *         date:
 *           type: string
 *           format: date
 *           example: 2024-03-15
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 */

module.exports = router;
