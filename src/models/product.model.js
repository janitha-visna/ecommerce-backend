const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: {
      type: String,
      enum: ["men", "women", "kids", "accessories"],
      required: true,
    },
    subCategory: {
      type: String,
      enum: ["topwear", "bottomwear", "footwear"],
      required: true,
    },
    price: { type: Number, required: true },
    sizes: {
      type: [String],
      enum: ["S", "M", "L", "XL"],
    },
    imageId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
