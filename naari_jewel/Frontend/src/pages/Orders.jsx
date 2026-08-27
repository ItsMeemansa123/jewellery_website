import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faCheckCircle, faTruck, faClock, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { API_BASE_URL } from "../services/api";

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState(user?.email || "");
  const [error, setError] = useState("");

  const apiUrl = API_BASE_URL;

  useEffect(() => {
    fetchOrders(user?.email || "");
  }, [user]);

  async function fetchOrders(searchEmail) {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const params = searchEmail ? { email: searchEmail } : {};

      const res = await axios.get(`${apiUrl}/api/orders/my-orders`, {
        headers,
        params,
      });
      setOrders(res.data || []);
    } catch (err) {
      if (searchEmail) {
        setError("Could not find orders for this email or session.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (emailInput.trim()) {
      fetchOrders(emailInput.trim());
    }
  }

  function getStatusBadge(status) {
    switch (status) {
      case "paid":
      case "confirmed":
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6EF] px-4 md:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif text-[#14213D] text-center mb-2">
          My Orders & Tracking
        </h1>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Track your handcrafted jewellery orders in real time.
        </p>

        {/* Email Search lookup or Login option for guest users */}
        {!user && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-lg mx-auto mb-8 text-center space-y-4">
            <p className="text-xs text-gray-500">
              Have an account? <Link to="/login" state={{ from: "/orders" }} className="text-[#14213D] font-bold hover:underline">Log in to view all your orders</Link>
            </p>
            <div className="relative flex py-1 items-center">
              <div className="grow border-t border-gray-200"></div>
              <span className="shrink mx-3 text-gray-400 text-xs uppercase">or search by email</span>
              <div className="grow border-t border-gray-200"></div>
            </div>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your checkout email..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#14213D]"
              />
              <button
                type="submit"
                className="bg-[#14213D] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#0b265e] transition"
              >
                Lookup
              </button>
            </form>
          </div>
        )}

        {error && (
          <div className="bg-amber-50 text-amber-800 p-4 rounded-xl text-sm text-center mb-6 border border-amber-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-500">
            <div className="w-8 h-8 border-3 border-[#14213D] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              <FontAwesomeIcon icon={faBox} />
            </div>
            <h2 className="text-xl font-serif text-[#14213D] mb-2">No Orders Found</h2>
            <p className="text-gray-500 text-sm mb-6">
              You haven't placed any orders yet. Discover our collection with AI assistance.
            </p>
            <Link
              to="/ai-shopping"
              className="bg-[#14213D] text-[#FBFFF1] px-6 py-2.5 rounded-full font-medium text-sm hover:bg-[#0b265e] transition inline-block"
            >
              ✨ Start AI Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                  <div>
                    <span className="text-xs text-gray-400 block mb-0.5">Order ID</span>
                    <span className="font-mono text-sm font-semibold text-[#14213D]">{order._id}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold border uppercase tracking-wider ${getStatusBadge(
                        order.paymentStatus
                      )}`}
                    >
                      Payment: {order.paymentStatus}
                    </span>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold border uppercase tracking-wider ${getStatusBadge(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-gray-50">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center gap-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-xl border border-gray-100"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-[#14213D]">{item.name}</h4>
                        <p className="text-xs text-gray-400">Qty: {item.quantity || 1}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-[#C9A66B]">
                          ₹{(item.price || 0) * (item.quantity || 1)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking Progress */}
                <div className="bg-[#FAF6EF] rounded-xl p-4 mt-4">
                  <h5 className="text-xs font-semibold text-[#14213D] mb-3 uppercase tracking-wider">
                    Tracking Status
                  </h5>
                  <div className="grid grid-cols-4 text-center text-xs">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center mb-1 text-xs">
                        ✓
                      </div>
                      <span className="font-medium text-gray-700">Placed</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 text-xs ${
                          order.paymentStatus === "paid" || order.orderStatus !== "processing"
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        ✓
                      </div>
                      <span className="font-medium text-gray-700">Confirmed</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 text-xs ${
                          order.orderStatus === "shipped" || order.orderStatus === "delivered"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        <FontAwesomeIcon icon={faTruck} />
                      </div>
                      <span className="font-medium text-gray-700">Shipped</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 text-xs ${
                          order.orderStatus === "delivered"
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        <FontAwesomeIcon icon={faCheckCircle} />
                      </div>
                      <span className="font-medium text-gray-700">Delivered</span>
                    </div>
                  </div>
                </div>

                {/* Footer Total */}
                <div className="flex justify-between items-center pt-3 border-t text-sm">
                  <span className="text-gray-500">
                    Delivering to: <span className="font-medium text-gray-800">{order.shippingAddress?.city}, {order.shippingAddress?.pincode}</span>
                  </span>
                  <span className="font-bold text-lg text-[#14213D]">Total: ₹{order.totalAmount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
