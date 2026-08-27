const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    style: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    stock: { type: Number, default: 1 },
    description: { type: String, default: "" },
    material: { type: String, default: "Sterling Silver / Semi-precious" },
    occasion: { type: [String], default: ["Casual", "Gifting", "Party", "Daily Wear"] },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 14 },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);