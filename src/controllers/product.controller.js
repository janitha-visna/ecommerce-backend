const Product = require("../models/product.model");

exports.addProduct = async (req, res) => {
  try {
    const { name, description, category, subCategory, price, sizes } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const product = await Product.create({
      name,
      description,
      category,
      subCategory,
      price,
      sizes: sizes ? sizes.split(",") : [],
      imageId: req.file.id,
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
