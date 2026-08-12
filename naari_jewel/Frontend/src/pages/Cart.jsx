import { useCart } from "../context/CartContext";

function Cart() {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  function buildWhatsAppMessage() {
    const lines = cart
      .map((item) => `- ${item.name}%0A  Image: ${item.image}`)
      .join("%0A%0A");
    const message = `Hi! I'm interested in ordering these pieces:%0A%0A${lines}`;
    return `https://wa.me/9634584884?text=${message}`;
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <p className="text-gray-600">Your cart is empty. Go add something you love!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EF] px-6 py-16">
      <h2 className="text-3xl font-serif text-center text-[#14213D] mb-10">Your Order Summary</h2>

      <div className="max-w-2xl mx-auto space-y-4">
        {cart.map((item, i) => (
          <div key={`${item._id}-${i}`} className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
              <div>
                <p className="font-serif text-[#14213D]">{item.name}</p>
                <p className="text-sm text-gray-500">₹{item.price}</p>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(item._id)}
              className="text-red-500 text-sm hover:underline"
            >
              Remove
            </button>
          </div>
        ))}

        <div className="flex justify-between font-medium text-lg pt-4 border-t border-gray-300">
          <span>Estimated Total</span>
          <span>₹{total}</span>
        </div>
        <p className="text-xs text-gray-400 text-center">
          Final pricing will be confirmed by us on WhatsApp.
        </p>

        <a
          href={buildWhatsAppMessage()}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center bg-[#25D366] text-white py-3 rounded-full mt-6 hover:bg-[#1ebe5d] transition font-medium"
        >
          Confirm Order via WhatsApp
        </a>
      </div>
    </div>
  );
}

export default Cart;