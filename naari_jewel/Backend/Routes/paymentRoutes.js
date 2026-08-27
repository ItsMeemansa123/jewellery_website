const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const {
  createRazorpayOrder,
  verifyRazorpaySignature,
  getKeyId,
} = require("../services/razorpayService");

const router = express.Router();

// GET Public Key ID for frontend SDK init
router.get("/key", (req, res) => {
  res.json({ keyId: getKeyId() });
});

// POST /api/payment/create-order
router.post("/create-order", async (req, res) => {
  try {
    const { items, customerName, customerEmail, customerPhone, shippingAddress, userId } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart items are required" });
    }

    if (!customerName || !customerEmail || !shippingAddress?.address || !shippingAddress?.city || !shippingAddress?.pincode) {
      return res.status(400).json({ message: "Customer details and complete shipping address are required" });
    }

    // Securely calculate total from DB
    let verifiedTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item._id || item.productId || item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name || item._id} not found` });
      }

      const qty = item.quantity && Number(item.quantity) > 0 ? Number(item.quantity) : 1;
      const itemTotal = product.price * qty;
      verifiedTotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: qty,
        image: product.image,
      });
    }

    // Create pending order in MongoDB
    const order = await Order.create({
      user: userId || null,
      customerName,
      customerEmail,
      customerPhone: customerPhone || "",
      items: orderItems,
      totalAmount: verifiedTotal,
      shippingAddress,
      paymentStatus: "pending",
      orderStatus: "processing",
    });

    // Create Razorpay Order
    const razorpayOrder = await createRazorpayOrder({
      amount: verifiedTotal,
      receipt: String(order._id),
      notes: {
        customerName,
        customerEmail,
        orderId: String(order._id),
      },
    });

    // Update order with razorpayOrderId
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(201).json({
      success: true,
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount, // in paise
      currency: "INR",
      keyId: getKeyId(),
      isMock: Boolean(razorpayOrder.is_mock),
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
    });
  } catch (err) {
    console.error("Create payment order error:", err);
    res.status(500).json({ message: "Failed to create payment order", error: err.message });
  }
});

// POST /api/payment/verify
router.post("/verify", async (req, res) => {
  try {
    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId) {
      return res.status(400).json({ message: "Missing verification parameters" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isValid = verifyRazorpaySignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid) {
      order.paymentStatus = "failed";
      await order.save();
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // Success: Update order status
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    await order.save();

    // Decrement stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    res.json({
      success: true,
      message: "Payment successfully verified and order confirmed",
      order,
    });
  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).json({ message: "Verification error", error: err.message });
  }
});

module.exports = router;
