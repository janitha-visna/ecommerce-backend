const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const { addProduct } = require("../controllers/product.controller");

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Add a new product (Admin)
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *       - in: formData
 *         name: name
 *         required: true
 *       - in: formData
 *         name: description
 *       - in: formData
 *         name: category
 *         enum: [men, women, kids, accessories]
 *       - in: formData
 *         name: subCategory
 *         enum: [topwear, bottomwear, footwear]
 *       - in: formData
 *         name: price
 *       - in: formData
 *         name: sizes
 *         description: "Comma separated (S,M,L,XL)"
 *     responses:
 *       201:
 *         description: Product created
 */
router.post("/", upload.single("image"), addProduct);

module.exports = router;
