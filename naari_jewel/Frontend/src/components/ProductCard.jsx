import { useCart } from "../context/CartContext";
function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-[#450920] rounded-2xl shadow-sm hover:shadow-lg transition p-4 flex flex-col">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-56 object-cover rounded-xl mb-4"
      />
      <p className="text-xs uppercase tracking-wide text-gray-400">
        {product.category}
      </p>
      <h3 className="text-lg font-serif text-[#FBFFF1] mt-1">
        {product.name}
      </h3>
      <p className="text-[#FBFFF1] font-medium mt-2">
        ₹{product.price}
      </p>
      <button
      onClick={() => addToCart(product)} 
      className="mt-4 bg-[#450920] border border-[#FBFFF1] text-white py-2 rounded-full hover:bg-[#eaece7] hover:text-[#1B2D2A] transition">
        Add to Cart
      </button>
    </div>
  );
}


export default ProductCard;