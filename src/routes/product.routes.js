const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const { addProduct } = require("../controllers/product.controller");

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Admin - Add new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - subCategory
 *               - price
 *               - sizes
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: Men's T-Shirt
 *               description:
 *                 type: string
 *                 example: Cotton round neck t-shirt
 *               category:
 *                 type: string
 *                 enum: [men, women, kids, accessories]
 *               subCategory:
 *                 type: string
 *                 enum: [topwear, bottomwear, footwear, innerwear]
 *               price:
 *                 type: number
 *                 example: 1999.99
 *               sizes:
 *                 type: string
 *                 enum: [XS, S, M, L, XL, XXL]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", upload.single("image"), addProduct);

module.exports = router;
