const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Product = sequelize.define(
  "Product",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
    },

    category: {
      type: DataTypes.ENUM("men", "women", "kids", "accessories"),
      allowNull: false,
    },

    subCategory: {
      type: DataTypes.ENUM("topwear", "bottomwear", "footwear", "innerwear"),
      allowNull: false,
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    sizes: {
      type: DataTypes.ENUM("XS", "S", "M", "L", "XL", "XXL"), // stored as "S,M,L,XL,XXL"
      allowNull: false,
    },

    image: {
      type: DataTypes.BLOB("medium"), // MEDIUMBLOB
      allowNull: false,
    },

    imageType: {
      type: DataTypes.STRING, // image/png or image/jpeg
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Product;
