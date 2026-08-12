import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleBuyNow() {
  addToCart(product);
  if (!user) {
    navigate("/login", { state: { from: "/cart" } });
    return;
  }
  navigate("/cart");
}

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-[#fbfff1ea] rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 p-4 flex flex-col overflow-hidden group"
    >
      <div className="overflow-hidden rounded-xl mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
        />
      </div>

      <p className="text-xs uppercase tracking-wide text-gray-400">{product.category}</p>
      <h3 className="text-lg font-serif text-gray-900 mt-1">{product.name}</h3>
      <p className="text-yellow-700 font-medium mt-2">₹{product.price}</p>

      <motion.button
        onClick={handleBuyNow}
        whileTap={{ scale: 0.95 }}
        className="mt-4 bg-[#14213D] text-white py-2 rounded-full hover:bg-[#0d275b] transition-colors duration-300"
      >
        Buy Now
      </motion.button>
    </motion.div>
  );
}

export default ProductCard;