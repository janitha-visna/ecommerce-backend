const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const { addProduct,getProductImage,deleteProduct,getProducts,getProductById,reduceStock } = require("../controllers/product.controller");

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
 *               - stock
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
 *                 description: Only required if category is men, women, or kids
 *               price:
 *                 type: number
 *                 example: 1999.99
 *               sizes:
 *                 type: string
 *                 enum: [XS, S, M, L, XL, XXL]
 *               stock:
 *                 type: integer
 *                 example: 100
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


// New GET route for image
/**
 * @swagger
 * /api/products/{id}/image:
 *   get:
 *     summary: Get product image by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Returns the product image
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Product or image not found
 */
router.get("/:id/image", getProductImage);

// DELETE product
/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Admin - Delete product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete("/:id", deleteProduct);


/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get products with filters and pagination
 *     description: >
 *       Fetch products with optional category and subCategory filters.
 *       Supports pagination. Images are not returned directly; instead,
 *       an imageUrl is provided for preview.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *           enum: [men, women, kids, accessories]
 *         description: Filter products by category
 *       - in: query
 *         name: subCategory
 *         required: false
 *         schema:
 *           type: string
 *           enum: [topwear, bottomwear, footwear, innerwear]
 *         description: Filter products by subCategory (ignored for accessories)
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number (default is 1)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of products per page (default is 10)
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                   example: 42
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Men T-Shirt
 *                       description:
 *                         type: string
 *                         example: Cotton round neck t-shirt
 *                       category:
 *                         type: string
 *                         example: men
 *                       subCategory:
 *                         type: string
 *                         example: topwear
 *                       price:
 *                         type: number
 *                         example: 1999.99
 *                       sizes:
 *                         type: string
 *                         example: M
 *                       stock:
 *                         type: integer
 *                         example: 25
 *                       imageUrl:
 *                         type: string
 *                         example: /api/products/1/image
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Internal server error
 */
router.get("/", getProducts);


/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 image:
 *                   type: string
 *                 category:
 *                   type: string
 *                 subCategory:
 *                   type: string
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get("/:id",getProductById);


/**
 * @swagger
 * /api/products/{id}/reduce-stock:
 *   patch:
 *     summary: Reduce product stock
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Stock reduced successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 productId:
 *                   type: integer
 *                 newStock:
 *                   type: integer
 *       400:
 *         description: Invalid request or not enough stock
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:id/reduce-stock", reduceStock);




module.exports = router;
