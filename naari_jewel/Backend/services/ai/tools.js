const Product = require("../../models/Product");
const { searchKnowledgeBase } = require("./knowledgeBase");

/**
 * Searches product catalog in MongoDB with multi-field filters
 */
async function searchProducts({
  query = "",
  category = "",
  style = "",
  minPrice,
  maxPrice,
  occasion = "",
  material = "",
  limit = 6,
}) {
  try {
    const filter = {};

    if (category) {
      filter.category = { $regex: new RegExp(category.trim(), "i") };
    }

    if (style) {
      filter.style = { $regex: new RegExp(style.trim(), "i") };
    }

    if (material) {
      filter.material = { $regex: new RegExp(material.trim(), "i") };
    }

    if (occasion) {
      filter.occasion = { $regex: new RegExp(occasion.trim(), "i") };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined && minPrice !== null) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== null) filter.price.$lte = Number(maxPrice);
    }

    if (query) {
      const q = query.trim();
      const regex = new RegExp(q, "i");
      filter.$or = [
        { name: regex },
        { category: regex },
        { style: regex },
        { description: regex },
        { material: regex },
        { tags: regex },
      ];
    }

    let products = await Product.find(filter).limit(Number(limit) || 6);

    // If strict filter yielded 0 results, relax criteria to provide nearest matches
    if (products.length === 0 && (category || query || maxPrice)) {
      const fallbackFilter = {};
      if (category) fallbackFilter.category = { $regex: new RegExp(category.trim(), "i") };
      if (maxPrice) fallbackFilter.price = { $lte: Number(maxPrice) * 1.25 }; // +25% buffer
      products = await Product.find(fallbackFilter).limit(Number(limit) || 4);
    }

    // Calculate match scoring and why it fits
    const scoredProducts = products.map((p) => {
      let matchScore = 85;
      const reasons = [];

      if (maxPrice && p.price <= maxPrice) {
        matchScore += 8;
        reasons.push(`Well within your ₹${maxPrice} budget (₹${p.price})`);
      } else if (maxPrice && p.price > maxPrice) {
        matchScore -= 10;
      }

      if (style && p.style.toLowerCase().includes(style.toLowerCase())) {
        matchScore += 5;
        reasons.push(`Matches ${p.style} style preference`);
      }

      if (category && p.category.toLowerCase().includes(category.toLowerCase())) {
        matchScore += 5;
        reasons.push(`Handcrafted ${p.category}`);
      }

      if (p.stock > 0) {
        reasons.push("In stock and ready to ship");
      }

      const finalScore = Math.min(99, Math.max(70, matchScore));
      const whyItFits = reasons.length > 0 ? reasons.join(" • ") : "High quality handcrafted piece";

      return {
        _id: p._id,
        name: p.name,
        category: p.category,
        style: p.style,
        price: p.price,
        image: p.image,
        stock: p.stock,
        rating: p.rating || 4.8,
        material: p.material || "Sterling Silver",
        occasion: p.occasion || ["Daily Wear", "Gifting"],
        description: p.description || "",
        matchScore: finalScore,
        whyItFits,
      };
    });

    // Sort by match score descending
    scoredProducts.sort((a, b) => b.matchScore - a.matchScore);

    return {
      count: scoredProducts.length,
      products: scoredProducts,
    };
  } catch (err) {
    console.error("searchProducts tool error:", err);
    return { count: 0, products: [], error: err.message };
  }
}

/**
 * Gets detailed specs for a specific product
 */
async function getProductDetails({ productId, productName }) {
  try {
    let product = null;
    if (productId) {
      product = await Product.findById(productId);
    } else if (productName) {
      product = await Product.findOne({ name: { $regex: new RegExp(productName, "i") } });
    }

    if (!product) {
      return { found: false, message: "Product not found" };
    }

    return {
      found: true,
      product: {
        _id: product._id,
        name: product.name,
        category: product.category,
        style: product.style,
        price: product.price,
        image: product.image,
        stock: product.stock,
        inStock: product.stock > 0,
        rating: product.rating || 4.8,
        reviewsCount: product.reviewsCount || 14,
        material: product.material || "925 Sterling Silver",
        occasion: product.occasion || ["Gifting", "Daily Wear"],
        description: product.description || "Designed with timeless finesse and hypoallergenic materials.",
      },
    };
  } catch (err) {
    return { found: false, error: err.message };
  }
}

/**
 * Compares 2 or more products side by side
 */
async function compareProducts({ productIds = [] }) {
  try {
    if (!productIds || productIds.length < 2) {
      // If fewer than 2 IDs, fetch first 2 products from DB as comparison sample
      const sample = await Product.find().limit(2);
      productIds = sample.map((p) => p._id);
    }

    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length < 2) {
      return { success: false, message: "Need at least 2 valid products to compare" };
    }

    const features = [
      { label: "Price", key: "price", format: (val) => `₹${val}` },
      { label: "Category", key: "category" },
      { label: "Style", key: "style" },
      { label: "Material", key: "material", default: "925 Sterling Silver" },
      { label: "Rating", key: "rating", format: (val) => `⭐ ${val || 4.8}` },
      { label: "Availability", key: "stock", format: (val) => (val > 0 ? "In Stock" : "Out of Stock") },
      { label: "Best For", key: "occasion", format: (val) => (Array.isArray(val) ? val.join(", ") : "Gifting & Daily Wear") },
    ];

    const comparedProducts = products.map((p) => ({
      _id: p._id,
      name: p.name,
      price: p.price,
      image: p.image,
      category: p.category,
      style: p.style,
      material: p.material || "925 Sterling Silver",
      rating: p.rating || 4.8,
      stock: p.stock,
      occasion: p.occasion || ["Gifting", "Everyday Wear"],
    }));

    // Generate intelligent comparison verdict
    const p1 = comparedProducts[0];
    const p2 = comparedProducts[1];
    let verdict = "";
    if (p1.price < p2.price) {
      verdict = `Choose **${p1.name}** (₹${p1.price}) for greater value and everyday style, or go with **${p2.name}** (₹${p2.price}) if you prefer a statement piece for special occasions.`;
    } else {
      verdict = `Choose **${p2.name}** (₹${p2.price}) for budget-conscious elegance, or pick **${p1.name}** (₹${p1.price}) for high-impact festive gifting.`;
    }

    return {
      success: true,
      features,
      products: comparedProducts,
      verdict,
    };
  } catch (err) {
    console.error("compareProducts tool error:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Checks inventory stock
 */
async function checkInventory({ productId }) {
  try {
    const product = await Product.findById(productId);
    if (!product) return { inStock: false, message: "Product not found" };
    return {
      productId: product._id,
      name: product.name,
      inStock: product.stock > 0,
      availableQuantity: product.stock,
    };
  } catch (err) {
    return { inStock: false, error: err.message };
  }
}

/**
 * Retrieves policy and care knowledge
 */
function getPolicyAndFAQ({ topic = "" }) {
  const matches = searchKnowledgeBase(topic);
  if (matches.length === 0) {
    return {
      found: false,
      message: "Naari Jewels has a strict No-Return policy once delivered, with immediate 100% replacement or refund provided for items damaged in transit, lost shipments, or defective pieces (with unboxing video within 24h). Shipping applies dynamically at checkout based on delivery pincode.",
    };
  }
  return {
    found: true,
    policies: matches,
  };
}

module.exports = {
  searchProducts,
  getProductDetails,
  compareProducts,
  checkInventory,
  getPolicyAndFAQ,
};
