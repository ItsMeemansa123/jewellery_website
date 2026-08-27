const express = require("express");
const { processUserMessage } = require("../services/ai/agent");

const router = express.Router();

// GET /api/ai/suggestions
router.get("/suggestions", (req, res) => {
  const suggestions = [
    {
      label: "🎁 Birthday gift under ₹2000 for my sister",
      prompt: "Birthday gift under ₹2000 for my sister",
      category: "Gifting",
    },
    {
      label: "✨ Minimal earrings under ₹2500 for daily wear",
      prompt: "Minimal earrings under ₹2500 for daily wear",
      category: "Daily Wear",
    },
    {
      label: "💎 Elegant necklace under ₹5000",
      prompt: "Elegant necklace under ₹5000 for special occasions",
      category: "Necklace",
    },
    {
      label: "⚖️ Compare top pieces",
      prompt: "Compare the top pieces side by side",
      category: "Compare",
    },
    {
      label: "📦 What is your transit damage & shipping policy?",
      prompt: "What is your transit damage replacement and shipping policy?",
      category: "Policy",
    },
  ];

  res.json({ success: true, suggestions });
});

// POST /api/ai/chat
router.post("/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const result = await processUserMessage(message.trim(), history || []);

    res.json({
      success: true,
      reply: result.reply,
      products: result.products || [],
      comparison: result.comparison || null,
      toolsUsed: result.toolsUsed || [],
    });
  } catch (err) {
    console.error("AI Chat error:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while communicating with the AI Assistant",
      error: err.message,
    });
  }
});

module.exports = router;
