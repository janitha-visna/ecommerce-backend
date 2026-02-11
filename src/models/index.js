const User = require("./user.model");
const Product = require("./product.model");
const Cart = require("./cart.model");
const CartItem = require("./cartItem.model");
const Order = require("./order.model");
const OrderItem = require("./orderItem.model");

// ---------- Cart Relations ----------
// One-to-one between User and Cart
User.hasOne(Cart, { foreignKey: "userId" });
// 🔁 FIXED: Explicitly tell belongsTo to use the SAME column name
Cart.belongsTo(User, { foreignKey: "userId" });

// One-to-many between Cart and CartItem
Cart.hasMany(CartItem, { foreignKey: "cartId" });
CartItem.belongsTo(Cart, { foreignKey: "cartId" });

// One-to-many between Product and CartItem
Product.hasMany(CartItem, { foreignKey: "productId" });
CartItem.belongsTo(Product, { foreignKey: "productId" });

// ---------- Order Relations ----------
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

module.exports = {
  User,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem,
};
