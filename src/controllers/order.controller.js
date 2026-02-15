const { Cart, CartItem, Order, OrderItem,User } = require("../models");

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


exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          attributes: ["name", "email"],
        },
      ],
      attributes: ["id", "totalAmount", "status", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // ✅ Allowed ENUM values
    const allowedStatuses = ["Processing", "Shipped", "Delivered"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
        allowedStatuses,
      });
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};