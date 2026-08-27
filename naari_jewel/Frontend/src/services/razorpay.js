import axios from "axios";
import { API_BASE_URL } from "./api";

/**
 * Dynamically loads the Razorpay SDK script if not already present
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Initiates Razorpay checkout flow
 * @param {Object} params
 * @param {Array} params.items - Cart or single product items
 * @param {Object} params.customer - Name, email, phone
 * @param {Object} params.shippingAddress - Address, city, state, pincode
 * @param {string} [params.userId] - Optional logged in user ID
 * @param {Function} params.onSuccess - Callback on verified payment
 * @param {Function} params.onError - Callback on error or dismissal
 */
export async function openRazorpayCheckout({
  items,
  customer,
  shippingAddress,
  userId,
  onSuccess,
  onError,
}) {
  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Failed to load Razorpay SDK. Please check your internet connection.");
      onError?.(new Error("Razorpay SDK failed to load"));
      return;
    }

    const apiUrl = API_BASE_URL;

    // 1. Create order on backend
    const orderRes = await axios.post(`${apiUrl}/api/payment/create-order`, {
      items,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      shippingAddress,
      userId,
    });

    const { orderId, razorpayOrderId, amount, currency, keyId, isMock } = orderRes.data;

    // Handle mock sandbox mode gracefully if Razorpay keys aren't live yet
    if (isMock) {
      console.log("Using Razorpay Sandbox Test Mode");
      const confirmMock = window.confirm(
        `💳 [TEST PAYMENT SIMULATION]\n\nOrder ID: ${orderId}\nTotal Amount: ₹${amount / 100}\n\nClick OK to simulate SUCCESSFUL payment, or Cancel to simulate Failure.`
      );

      if (confirmMock) {
        // Verify mock payment on backend
        const verifyRes = await axios.post(`${apiUrl}/api/payment/verify`, {
          orderId,
          razorpayOrderId,
          razorpayPaymentId: `pay_mock_${Date.now()}`,
          razorpaySignature: "mock_signature_valid",
        });
        onSuccess?.(verifyRes.data);
      } else {
        onError?.(new Error("Payment cancelled by user"));
      }
      return;
    }

    // 2. Configure official Razorpay Checkout options
    const options = {
      key: keyId,
      amount,
      currency: currency || "INR",
      name: "Naari Jewels",
      description: "Handcrafted Luxury Jewellery",
      image: "https://naarijewel.vercel.app/assets/Naari_logo.jpeg",
      order_id: razorpayOrderId,
      prefill: {
        name: customer.name,
        email: customer.email,
        contact: customer.phone,
      },
      theme: {
        color: "#14213D",
      },
      handler: async function (response) {
        try {
          // 3. Verify signature on backend
          const verifyRes = await axios.post(`${apiUrl}/api/payment/verify`, {
            orderId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          onSuccess?.(verifyRes.data);
        } catch (verifyErr) {
          console.error("Signature verification error:", verifyErr);
          onError?.(verifyErr);
        }
      },
      modal: {
        ondismiss: function () {
          console.log("Razorpay checkout modal closed by user");
          onError?.(new Error("Payment cancelled"));
        },
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  } catch (err) {
    console.error("Checkout initiation error:", err);
    onError?.(err);
  }
}
