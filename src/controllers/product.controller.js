const Product = require("../models/product.model");

exports.addProduct = async (req, res) => {
  try {
    const { name, description, category, subCategory, price, sizes } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    const product = await Product.create({
      name,
      description,
      category,
      subCategory,
      price,
      sizes, // "S,M,L,XL,XXL"
      image: req.file.buffer,
      imageType: req.file.mimetype,
    });

    res.status(201).json({
      message: "Product added successfully",
      productId: product.id,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
