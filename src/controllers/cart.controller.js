const { Cart, CartItem, Product } = require("../models");

exports.getCart = async (req, res) => {
  try {
    console.log("===== GET CART START =====");

    // 1️⃣ Get user ID from token
    const userId = req.user.id;
    console.log("Logged in User ID:", userId);

    // 2️⃣ Try to find cart
    let cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          include: [
            {
              model: Product,
              attributes: { exclude: ["image", "imageType"] }, // 👈 exclude image
            },
          ],
        },
      ],
    });

    console.log("Cart found from DB:", cart ? cart.id : "No cart found");

    // 3️⃣ If no cart, create one
    if (!cart) {
      console.log("Creating new cart for user:", userId);
      cart = await Cart.create({ userId });
      console.log("New cart created with ID:", cart.id);
    }

    // 4️⃣ Log cart items if exist
    if (cart.CartItems && cart.CartItems.length > 0) {
      console.log("Cart has items:", cart.CartItems.length);
      cart.CartItems.forEach((item) => {
        console.log("Item ID:", item.id);
        console.log("Quantity:", item.quantity);
        console.log("Product:", item.Product?.name);
      });
    } else {
      console.log("Cart is empty");
    }

    console.log("===== GET CART END =====");

    res.json(cart);
  } catch (error) {
    console.error("Error in getCart:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, size, quantity } = req.body;

  let cart = await Cart.findOne({ where: { userId } });
  if (!cart) cart = await Cart.create({ userId });

  const product = await Product.findByPk(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const existingItem = await CartItem.findOne({
    where: { cartId: cart.id, productId, size },
  });

  if (existingItem) {
    existingItem.quantity += quantity;
    await existingItem.save();
    return res.json(existingItem);
  }

  const item = await CartItem.create({
    cartId: cart.id,
    productId,
    size,
    quantity,
    price: product.price,
  });

  res.status(201).json(item);
};

exports.updateQuantity = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const item = await CartItem.findByPk(id);
  if (!item) return res.status(404).json({ message: "Item not found" });

  if (quantity <= 0) {
    await item.destroy();
    return res.json({ message: "Item removed" });
  }

  item.quantity = quantity;
  await item.save();

  res.json(item);
};

exports.removeItem = async (req, res) => {
  const { id } = req.params;
  await CartItem.destroy({ where: { id } });
  res.json({ message: "Item removed" });
};
