const express = require("express");
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Helper to extract user ID from auth header if present
function getUserIdFromReq(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
      return decoded.id;
    } catch {
      return null;
    }
  }
  return null;
}

// GET /api/orders/my-orders
router.get("/my-orders", async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    const { email } = req.query;

    let query = {};
    if (userId) {
      query = { $or: [{ user: userId }, ...(email ? [{ customerEmail: email }] : [])] };
    } else if (email) {
      query = { customerEmail: email };
    } else {
      return res.status(400).json({ message: "Authentication or email is required to view orders" });
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/orders/:id
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
