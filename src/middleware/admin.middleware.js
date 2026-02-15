const adminMiddleware = (req, res, next) => {
  console.log("Admin middleware called");
  console.log("User from request:", req.user);

  if (!req.user || req.user.role !== "admin") {
    console.log("Access denied: user is not admin");
    return res.status(403).json({ message: "Admin access required" });
  }

  console.log("Access granted: user is admin");
  next();
};

module.exports = adminMiddleware;
