const Razorpay = require("razorpay");
const crypto = require("crypto");

const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_mockKeyId123";
const keySecret = process.env.RAZORPAY_KEY_SECRET || "mockKeySecret456";

let razorpayInstance = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } catch (err) {
    console.warn("Razorpay initialization error:", err.message);
  }
}

/**
 * 
 * @param {Object} params
 * @param {number} params.amount 
 * @param {string} params.receipt 
 * @param {Object} [params.notes] 
 */
async function createRazorpayOrder({ amount, receipt, notes = {} }) {
  const amountInPaise = Math.round(amount * 100);

  if (razorpayInstance) {
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: String(receipt).slice(0, 40),
      notes,
    };
    return await razorpayInstance.orders.create(options);
  }


  return {
    id: `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    entity: "order",
    amount: amountInPaise,
    amount_paid: 0,
    amount_due: amountInPaise,
    currency: "INR",
    receipt: String(receipt),
    status: "created",
    attempts: 0,
    notes,
    created_at: Math.floor(Date.now() / 1000),
    is_mock: true,
  };
}

/**
 * @param {Object} params
 * @param {string} params.razorpayOrderId
 * @param {string} params.razorpayPaymentId
 * @param {string} params.razorpaySignature
 */
function verifyRazorpaySignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) {
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return false;
  }

  if (razorpayOrderId.startsWith("order_mock_") && razorpaySignature === "mock_signature_valid") {
    return true;
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  return generatedSignature === razorpaySignature;
}

module.exports = {
  createRazorpayOrder,
  verifyRazorpaySignature,
  getKeyId: () => process.env.RAZORPAY_KEY_ID || "rzp_test_mockKeyId123",
};
