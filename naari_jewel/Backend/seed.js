const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const Product = require("./models/Product");

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas!");

    const dumpPath = path.join(__dirname, "products_dump.json");
    const rawData = fs.readFileSync(dumpPath, "utf-8");
    const products = JSON.parse(rawData);

    console.log(`Found ${products.length} products in products_dump.json.`);
    console.log("Replacing old records with complete rich AI dataset...");

    await Product.deleteMany({});
    const inserted = await Product.insertMany(products);

    console.log(`\nSUCCESS! Inserted ${inserted.length} rich jewellery items into MongoDB Atlas!`);
    console.log("Categories included:", [...new Set(inserted.map((p) => p.category))].join(", "));
    console.log("Styles included:", [...new Set(inserted.map((p) => p.style))].join(", "));

    await mongoose.disconnect();
    console.log("MongoDB connection closed gracefully.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seedDatabase();
