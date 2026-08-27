import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faShieldAlt, faTruck, faRotateLeft, faBolt, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { API_BASE_URL } from "../services/api";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  const apiUrl = API_BASE_URL;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiUrl}/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.error("Failed to load product:", err);
      })
      .finally(() => setLoading(false));
  }, [id, apiUrl]);

  function handleAddToCart() {
    if (!product) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleInstantBuy() {
    if (!product) return;
    addToCart(product);
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    navigate("/cart");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#14213D] flex items-center justify-center text-[#FBFFF1]">
        <div className="w-8 h-8 border-3 border-[#C9A66B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#14213D] flex flex-col items-center justify-center text-[#FBFFF1] px-6">
        <h2 className="text-2xl font-serif mb-4">Product Not Found</h2>
        <Link
          to="/shop"
          className="bg-[#C9A66B] text-[#14213D] px-6 py-2.5 rounded-full font-medium"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EF] px-4 md:px-8 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
          {/* Image Column */}
          <div className="relative rounded-2xl overflow-hidden bg-gray-50 aspect-square">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.stock > 0 ? (
              <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                In Stock
              </span>
            ) : (
              <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                Out of Stock
              </span>
            )}
          </div>

          {/* Details Column */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 mb-2">
                <span>{product.category}</span>
                <span>•</span>
                <span>{product.style}</span>
              </div>

              <h1 className="text-3xl font-serif text-[#14213D] mb-3">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center text-amber-500 text-sm font-semibold">
                  <FontAwesomeIcon icon={faStar} className="mr-1" />
                  <span>{product.rating || 4.8}</span>
                </div>
                <span className="text-gray-400 text-xs">({product.reviewsCount || 14} reviews)</span>
              </div>

              <div className="text-3xl font-bold text-[#C9A66B] mb-6">
                ₹{product.price}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {product.description ||
                  "Handcrafted with fine attention to detail, designed to elevate your everyday elegance and special celebrations."}
              </p>

              {/* Specifications Pills */}
              <div className="space-y-2 mb-6 text-xs text-gray-700 bg-[#FAF6EF] p-4 rounded-2xl border border-[#EBE4D5]">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Material:</span>
                  <span className="font-semibold">{product.material || "925 Sterling Silver"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Style:</span>
                  <span className="font-semibold">{product.style}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Suitable For:</span>
                  <span className="font-semibold">
                    {Array.isArray(product.occasion) ? product.occasion.join(", ") : "Daily Wear, Gifting"}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-gray-600 border-t border-b py-3 mb-6">
                <div className="flex flex-col items-center gap-1">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-[#14213D]" />
                  <span>100% Authentic</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <FontAwesomeIcon icon={faTruck} className="text-[#14213D]" />
                  <span>Dynamic Shipping</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <FontAwesomeIcon icon={faRotateLeft} className="text-[#14213D]" />
                  <span>Transit Damage Replace</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`py-3 rounded-full text-sm font-medium transition flex items-center justify-center gap-2 ${
                    added
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-[#14213D]"
                  }`}
                >
                  <FontAwesomeIcon icon={faShoppingBag} />
                  {added ? "Added to Cart!" : "Add to Cart"}
                </button>

                <button
                  onClick={handleInstantBuy}
                  className="bg-[#14213D] hover:bg-[#0b265e] text-white py-3 rounded-full text-sm font-medium transition flex items-center justify-center gap-2 shadow-md"
                >
                  <FontAwesomeIcon icon={faBolt} />
                  Instant Buy
                </button>
              </div>

              <Link
                to="/ai-shopping"
                className="block text-center bg-[#FAF6EF] text-[#73251C] border border-[#E5DAC8] py-2.5 rounded-full text-xs font-semibold hover:bg-[#F3ECE1] transition"
              >
                ✨ Ask Naari AI about this piece & styling tips
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;