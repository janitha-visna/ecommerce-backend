const { Cart, CartItem, Product } = require("../models");

exports.getCart = async (req, res) => {
  const userId = req.user.id;

  let cart = await Cart.findOne({
    where: { userId },
    include: [{ model: CartItem, include: [Product] }],
  });

  if (!cart) {
    cart = await Cart.create({ userId });
  }

  res.json(cart);
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
