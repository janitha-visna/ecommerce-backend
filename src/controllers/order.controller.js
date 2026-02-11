const { Cart, CartItem, Order, OrderItem } = require("../models");

exports.checkout = async (req, res) => {
  const userId = req.user.id;

  const cart = await Cart.findOne({
    where: { userId },
    include: [CartItem],
  });

  if (!cart || cart.CartItems.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const total = cart.CartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = await Order.create({
    userId,
    totalAmount: total,
  });

  for (const item of cart.CartItems) {
    await OrderItem.create({
      orderId: order.id,
      productName: item.productName || "Product",
      size: item.size,
      quantity: item.quantity,
      price: item.price,
    });
  }

  await CartItem.destroy({ where: { cartId: cart.id } });

  res.status(201).json({ message: "Order placed", orderId: order.id });
};

exports.getOrders = async (req, res) => {
  const userId = req.user.id;

  const orders = await Order.findAll({
    where: { userId },
    include: [OrderItem],
    order: [["createdAt", "DESC"]],
  });

  res.json(orders);
};
