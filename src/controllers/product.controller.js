const Product = require("../models/product.model");

const categorySubCategories = {
  men: ["topwear", "bottomwear", "footwear", "innerwear"],
  women: ["topwear", "bottomwear", "footwear", "innerwear"],
  kids: ["topwear", "bottomwear", "footwear", "innerwear"],
  accessories: [], // no subcategory
};

exports.addProduct = async (req, res) => {
  try {
    const { name, description, category, subCategory, price, sizes,stock } =
      req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    if (stock === undefined || stock < 0) {
      return res
        .status(400)
        .json({ message: "Stock must be a non-negative number" });
    }

    // Validate subCategory based on category
    const allowedSubCategories = categorySubCategories[category];
    if (allowedSubCategories.length > 0) {
      if (!allowedSubCategories.includes(subCategory)) {
        return res.status(400).json({
          message: `Invalid subCategory for category ${category}. Allowed: ${allowedSubCategories.join(
            ", "
          )}`,
        });
      }
    } else {
      // For accessories, ignore subCategory
      req.body.subCategory = null;
    }

    const product = await Product.create({
      name,
      description,
      category,
      subCategory: req.body.subCategory, // either valid or null
      price,
      sizes,
      stock: Number(stock),
      image: req.file.buffer,
      imageType: req.file.mimetype,
    });

    res.status(201).json({
      message: "Product added successfully",
      productId: product.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductImage = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.image || !product.imageType) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Send image buffer with correct content type
    res.set("Content-Type", product.imageType);
    res.send(product.image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.destroy();

    res.status(200).json({
      message: "Product deleted successfully",
      productId: id,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { category, subCategory, page = 1, limit = 10 } = req.query;

    const where = {};
    if (category) where.category = category;
    if (subCategory) where.subCategory = subCategory;

    const pageNum = parseInt(page);
    const pageSize = parseInt(limit);
    const offset = (pageNum - 1) * pageSize;

    const { rows, count } = await Product.findAndCountAll({
      where,
      limit: pageSize,
      offset,
      order: [["createdAt", "DESC"]],
      attributes: {
        exclude: ["image", "imageType"],
      },
    });

    const products = rows.map((p) => ({
      ...p.toJSON(),
      imageUrl: `/api/products/${p.id}/image`, // 🔥 preview image URL
    }));

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: pageNum,
      products,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      attributes: {
        exclude: ["image", "imageType"],
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Reduce stock for a product
exports.reduceStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive number" });
    }

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // Reduce stock
    product.stock -= quantity;
    await product.save();

    res.status(200).json({
      message: "Stock updated successfully",
      productId: product.id,
      newStock: product.stock,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get stock count by category
exports.getCategoryStock = async (req, res) => {
  try {
    // Aggregate stock by category
    const categories = ["men", "women", "kids", "accessories"];
    const stockCounts = {};

    for (const category of categories) {
      const totalStock = await Product.sum("stock", {
        where: { category },
      });
      stockCounts[category] = totalStock || 0; // if null, set 0
    }

    // Log the stock counts to the console
    console.log("Category Stock Counts:", stockCounts);

    res.status(200).json({
      message: "Category stock fetched successfully",
      stockCounts,
    });
  } catch (err) {
    console.error("Error fetching category stock:", err.message);
    res.status(500).json({ error: err.message });
  }
};
