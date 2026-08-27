import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBalanceScale, faBolt, faStar } from "@fortawesome/free-solid-svg-icons";

function AIComparisonTable({ comparison }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleBuy(product) {
    addToCart(product);
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    navigate("/cart");
  }

  if (!comparison || !comparison.products || comparison.products.length < 2) {
    return null;
  }

  const { products, verdict } = comparison;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-4 md:p-6 shadow-md border border-gray-100 my-4 overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-4 text-[#14213D]">
        <FontAwesomeIcon icon={faBalanceScale} className="text-[#C9A66B] text-lg" />
        <h3 className="font-serif text-lg font-bold">Side-by-Side Comparison</h3>
      </div>

      {/* Comparison Grid Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs md:text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-3 text-gray-400 font-medium w-28">Feature</th>
              {products.map((p) => (
                <th key={p._id} className="pb-3 px-3 text-[#14213D] font-serif min-w-[140px]">
                  <div className="space-y-2">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl shadow-xs"
                    />
                    <div className="font-bold text-sm line-clamp-1">{p.name}</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* Price Row */}
            <tr>
              <td className="py-2.5 text-gray-500 font-medium">Price</td>
              {products.map((p) => (
                <td key={p._id} className="py-2.5 px-3 font-bold text-[#C9A66B]">
                  ₹{p.price}
                </td>
              ))}
            </tr>

            {/* Category Row */}
            <tr>
              <td className="py-2.5 text-gray-500 font-medium">Category</td>
              {products.map((p) => (
                <td key={p._id} className="py-2.5 px-3 text-gray-800">
                  {p.category}
                </td>
              ))}
            </tr>

            {/* Style Row */}
            <tr>
              <td className="py-2.5 text-gray-500 font-medium">Style</td>
              {products.map((p) => (
                <td key={p._id} className="py-2.5 px-3 text-gray-800">
                  {p.style}
                </td>
              ))}
            </tr>

            {/* Material Row */}
            <tr>
              <td className="py-2.5 text-gray-500 font-medium">Material</td>
              {products.map((p) => (
                <td key={p._id} className="py-2.5 px-3 text-gray-800">
                  {p.material || "925 Sterling Silver"}
                </td>
              ))}
            </tr>

            {/* Rating Row */}
            <tr>
              <td className="py-2.5 text-gray-500 font-medium">Rating</td>
              {products.map((p) => (
                <td key={p._id} className="py-2.5 px-3 text-amber-500 font-medium">
                  <FontAwesomeIcon icon={faStar} className="mr-1 text-xs" />
                  {p.rating || 4.8}
                </td>
              ))}
            </tr>

            {/* Availability Row */}
            <tr>
              <td className="py-2.5 text-gray-500 font-medium">Stock</td>
              {products.map((p) => (
                <td key={p._id} className="py-2.5 px-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      p.stock > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {p.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
              ))}
            </tr>

            {/* Best For Row */}
            <tr>
              <td className="py-2.5 text-gray-500 font-medium">Best For</td>
              {products.map((p) => (
                <td key={p._id} className="py-2.5 px-3 text-gray-700 text-xs">
                  {Array.isArray(p.occasion) ? p.occasion.join(", ") : "Gifting & Daily Wear"}
                </td>
              ))}
            </tr>

            {/* Action Row */}
            <tr>
              <td className="pt-3 text-gray-500 font-medium">Action</td>
              {products.map((p) => (
                <td key={p._id} className="pt-3 px-3">
                  <button
                    onClick={() => handleBuy(p)}
                    className="w-full bg-[#14213D] hover:bg-[#0b265e] text-white py-1.5 px-2 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1 shadow-xs"
                  >
                    <FontAwesomeIcon icon={faBolt} className="text-[10px]" />
                    Buy This
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* AI Verdict Box */}
      {verdict && (
        <div className="mt-4 bg-[#FAF6EF] border border-[#E9DFCF] rounded-xl p-3 text-xs text-[#14213D]">
          <p className="font-bold text-[#73251C] mb-1">🎯 AI Recommendation Verdict:</p>
          <p className="text-gray-700 leading-relaxed">{verdict}</p>
        </div>
      )}
    </motion.div>
  );
}

export default AIComparisonTable;
