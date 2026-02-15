const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const auth = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");


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

/**
 * @swagger
 * /api/orders/admin/all:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All orders retrieved successfully
 */
router.get("/admin/all", auth, adminMiddleware, orderController.getAllOrders);

/**
 * @swagger
 * /api/orders/admin/{id}/status:
 *   put:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             status: Shipped
 *     responses:
 *       200:
 *         description: Order status updated successfully
 */
router.put(
  "/admin/:id/status",
  auth,
  adminMiddleware,
  orderController.updateOrderStatus
);
  

module.exports = router;
