import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faShoppingBag, faBolt, faStar } from "@fortawesome/free-solid-svg-icons";

function AIProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleInstantBuy() {
    addToCart(product);
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    navigate("/cart");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all border border-gray-100 flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Match Score & Rating */}
        <div className="flex items-center justify-between mb-2">
          {product.matchScore ? (
            <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              ✨ {product.matchScore}% Match
            </span>
          ) : (
            <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full">
              Recommended
            </span>
          )}

          <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
            <FontAwesomeIcon icon={faStar} />
            <span>{product.rating || 4.8}</span>
          </div>
        </div>

        {/* Product Image */}
        <div className="relative overflow-hidden rounded-xl mb-3 bg-gray-50 aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider">
              Out of Stock
            </div>
          )}
        </div>

        {/* Name & Price */}
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <h4 className="font-serif text-[#14213D] font-semibold text-base line-clamp-1">
            {product.name}
          </h4>
          <p className="text-[#C9A66B] font-bold text-base whitespace-nowrap">
            ₹{product.price}
          </p>
        </div>

        {/* Category & Style Badges */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
            {product.category}
          </span>
          <span className="text-[11px] bg-[#14213D]/5 text-[#14213D] px-2 py-0.5 rounded-md">
            {product.style}
          </span>
          {product.material && (
            <span className="text-[11px] bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md">
              {product.material}
            </span>
          )}
        </div>

        {/* AI Reasoning / Why it fits */}
        {product.whyItFits && (
          <div className="bg-[#FAF6EF] rounded-xl p-2.5 mb-3 border border-[#E9DFCF] text-xs text-[#14213D]">
            <p className="font-medium text-[#73251C] mb-0.5 flex items-center gap-1">
              <span>💡</span> Why this fits:
            </p>
            <p className="text-gray-700 leading-snug">{product.whyItFits}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-100">
        <button
          onClick={handleAddToCart}
          className={`py-2 px-3 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 ${
            added
              ? "bg-green-600 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-[#14213D]"
          }`}
        >
          <FontAwesomeIcon icon={added ? faCheck : faShoppingBag} />
          {added ? "Added!" : "Add to Cart"}
        </button>

        <button
          onClick={handleInstantBuy}
          className="bg-[#14213D] hover:bg-[#0b265e] text-white py-2 px-3 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 shadow-sm"
        >
          <FontAwesomeIcon icon={faBolt} />
          Instant Buy
        </button>
      </div>
    </motion.div>
  );
}

export default AIProductCard;
