import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { openRazorpayCheckout } from "../services/razorpay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faTrash, faPlus, faMinus, faCheckCircle, faShoppingBag } from "@fortawesome/free-solid-svg-icons";

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
  });

  const [address, setAddress] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Dynamic shipping calculation based on delivery location / pincode
  const calculateDynamicShipping = () => {
    if (cart.length === 0) return 0;
    if (!address.pincode || address.pincode.trim().length < 6) return 75; // Standard base shipping estimate
    const metroPrefixes = ["11", "12", "20", "40", "56", "60", "70", "38", "50"];
    const isMetro = metroPrefixes.some((p) => address.pincode.trim().startsWith(p));
    return isMetro ? 60 : 90;
  };

  const shippingFee = calculateDynamicShipping();
  const finalTotal = totalAmount + shippingFee;

  function handleCustomerChange(e) {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  }

  function handleAddressChange(e) {
    setAddress({ ...address, [e.target.name]: e.target.value });
  }

  function buildWhatsAppMessage() {
    const lines = cart
      .map((item) => `- ${item.name} (x${item.quantity || 1}) - ₹${item.price * (item.quantity || 1)}`)
      .join("%0A");
    const message = `Hi Naari Jewels! I would like to order:%0A%0A${lines}%0A%0ATotal: ₹${finalTotal}`;
    return `https://wa.me/9634584884?text=${message}`;
  }

  async function handleRazorpayPayment() {
    setError("");

    if (!customer.name.trim() || !customer.email.trim()) {
      setError("Please provide your name and email.");
      return;
    }

    if (!address.address.trim() || !address.city.trim() || !address.pincode.trim()) {
      setError("Please provide a complete delivery address and pincode.");
      return;
    }

    setLoading(true);

    try {
      await openRazorpayCheckout({
        items: cart,
        customer,
        shippingAddress: address,
        userId: user?.id || null,
        onSuccess: (data) => {
          setLoading(false);
          setConfirmedOrder(data.order);
          clearCart();
        },
        onError: (err) => {
          setLoading(false);
          setError(err.message || "Payment could not be completed. Please retry.");
        },
      });
    } catch (err) {
      setLoading(false);
      setError(err.message || "Payment initiation failed.");
    }
  }

  // Require Login before accessing cart and checkout
  if (!user) {
    return (
      <div className="min-h-screen bg-[#14213D] flex flex-col items-center justify-center text-center px-6 py-16">
        <div className="w-20 h-20 bg-white/10 text-[#C9A66B] rounded-full flex items-center justify-center mb-6 text-3xl shadow-lg">
          <FontAwesomeIcon icon={faLock} />
        </div>
        <h2 className="text-3xl font-serif text-[#FBFFF1] mb-3">Login to View Cart & Checkout</h2>
        <p className="text-gray-400 max-w-md mb-8 text-sm leading-relaxed">
          Please login or create an account to access your bag, calculate dynamic delivery charges, and complete your order.
        </p>
        <div className="flex gap-4">
          <Link
            to="/login"
            state={{ from: "/cart" }}
            className="bg-[#C9A66B] text-[#14213D] font-semibold px-8 py-3 rounded-full hover:bg-[#b59257] transition shadow-lg text-sm"
          >
            Login to Continue
          </Link>
          <Link
            to="/signup"
            state={{ from: "/cart" }}
            className="border border-[#FBFFF1] text-[#FBFFF1] px-8 py-3 rounded-full hover:bg-white/10 transition text-sm font-medium"
          >
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  if (confirmedOrder) {
    return (
      <div className="min-h-screen bg-[#14213D] flex items-center justify-center px-6 py-16">
        <div className="bg-[#FBFFF1] rounded-3xl p-8 md:p-12 max-w-lg w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
          <h2 className="text-3xl font-serif text-[#162e61] mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Thank you, <span className="font-semibold">{confirmedOrder.customerName}</span>. Your handcrafted jewellery is being prepared with love.
          </p>

          <div className="bg-gray-50 rounded-2xl p-4 text-left text-sm mb-6 border border-gray-200">
            <p className="text-gray-500 mb-1">Order ID:</p>
            <p className="font-mono font-semibold text-[#14213D] mb-3">{confirmedOrder._id}</p>
            <p className="text-gray-500 mb-1">Amount Paid:</p>
            <p className="font-semibold text-green-700 text-lg">₹{confirmedOrder.totalAmount}</p>
          </div>

          <div className="space-y-3">
            <Link
              to="/orders"
              className="block w-full bg-[#14213D] text-[#FBFFF1] py-3 rounded-full font-medium hover:bg-[#0b265e] transition"
            >
              Track Order
            </Link>
            <Link
              to="/shop"
              className="block w-full border border-[#14213D] text-[#14213D] py-3 rounded-full font-medium hover:bg-gray-100 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#14213D] flex flex-col items-center justify-center text-center px-6 py-16">
        <div className="w-20 h-20 bg-white/10 text-[#FBFFF1] rounded-full flex items-center justify-center mb-6 text-3xl">
          <FontAwesomeIcon icon={faShoppingBag} />
        </div>
        <h2 className="text-3xl font-serif text-[#FBFFF1] mb-3">Your Cart is Empty</h2>
        <p className="text-gray-400 max-w-md mb-8">
          Explore our handcrafted timeless jewellery collection or ask our AI assistant to find your perfect match.
        </p>
        <div className="flex gap-4">
          <Link
            to="/ai-shopping"
            className="bg-[#C9A66B] text-[#14213D] font-medium px-6 py-3 rounded-full hover:bg-[#b59257] transition shadow-lg"
          >
            ✨ Shop with AI
          </Link>
          <Link
            to="/shop"
            className="border border-[#FBFFF1] text-[#FBFFF1] px-6 py-3 rounded-full hover:bg-white/10 transition"
          >
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EF] px-4 md:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif text-[#14213D] text-center mb-10">
          Checkout & Order Summary
        </h1>

        {error && (
          <div className="max-w-2xl mx-auto bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-center border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Cart Items & Shipping Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-serif text-[#162e61] mb-4">Cart Items ({cart.length})</h2>

              <div className="divide-y divide-gray-100">
                {cart.map((item, i) => (
                  <div key={`${item._id || item.id}-${i}`} className="py-4 flex items-center justify-between gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-xl border border-gray-200"
                    />

                    <div className="flex-1">
                      <h3 className="font-serif text-[#14213D] font-medium">{item.name}</h3>
                      <p className="text-xs text-gray-500">{item.style || item.category || "Jewellery"}</p>
                      <p className="text-[#C9A66B] font-semibold mt-1">₹{item.price}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item._id || item.id, (item.quantity || 1) - 1)}
                        className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs"
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <span className="font-medium text-sm w-4 text-center">{item.quantity || 1}</span>
                      <button
                        onClick={() => updateQuantity(item._id || item.id, (item.quantity || 1) + 1)}
                        className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id || item.id)}
                      className="text-red-400 hover:text-red-600 p-2 text-sm"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address Form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-serif text-[#162e61] mb-4">Delivery & Contact Information</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name *"
                    value={customer.name}
                    onChange={handleCustomerChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#14213D]"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address *"
                    value={customer.email}
                    onChange={handleCustomerChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#14213D]"
                  />
                </div>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Mobile Phone (for tracking updates)"
                  value={customer.phone}
                  onChange={handleCustomerChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#14213D]"
                />

                <input
                  type="text"
                  name="address"
                  placeholder="Street Address / Flat / Building *"
                  value={address.address}
                  onChange={handleAddressChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#14213D]"
                />

                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    name="city"
                    placeholder="City *"
                    value={address.city}
                    onChange={handleAddressChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#14213D]"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={address.state}
                    onChange={handleAddressChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#14213D]"
                  />
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode *"
                    value={address.pincode}
                    onChange={handleAddressChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#14213D]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Price Summary & Checkout Action */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24 space-y-6">
              <h2 className="text-xl font-serif text-[#162e61]">Price Details</h2>

              <div className="space-y-3 text-sm border-b pb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Price ({cart.length} item{cart.length > 1 ? "s" : ""})</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Dynamic Delivery Charges</span>
                  <span className="font-medium text-[#14213D]">₹{shippingFee}</span>
                </div>
                <p className="text-[11px] text-gray-500 bg-gray-50 p-2 rounded-lg">
                  📍 Calculated dynamically based on your delivery pincode & location.
                </p>
              </div>

              <div className="flex justify-between text-lg font-bold text-[#14213D]">
                <span>Total Amount</span>
                <span>₹{finalTotal}</span>
              </div>

              <button
                onClick={handleRazorpayPayment}
                disabled={loading}
                className="w-full bg-[#14213D] text-[#FBFFF1] py-3.5 rounded-full font-medium hover:bg-[#0b265e] transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faLock} />
                {loading ? "Opening Secure Payment..." : `Pay ₹${finalTotal} with Razorpay`}
              </button>

              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-gray-200"></div>
                <span className="shrink mx-4 text-gray-400 text-xs uppercase">or</span>
                <div className="grow border-t border-gray-200"></div>
              </div>

              <a
                href={buildWhatsAppMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-[#25D366] text-white py-3 rounded-full hover:bg-[#1ebe5d] transition font-medium text-sm"
              >
                Confirm Order via WhatsApp
              </a>

              <div className="pt-2 text-center text-xs text-gray-400">
                🔒 256-bit SSL encrypted • Powered by Razorpay
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;