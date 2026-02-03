const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    if (!file.mimetype.startsWith("image/")) {
      throw new Error("Only images allowed");
    }

    return {
      filename: `product-${Date.now()}-${file.originalname}`,
      bucketName: "productImages",
    };
  },
});

module.exports = multer({ storage });
