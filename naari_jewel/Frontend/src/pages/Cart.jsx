import { useCart } from "../context/CartContext";

function Cart() {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  function buildWhatsAppMessage() {
    const lines = cart.map((item) => `- ${item.name} (₹${item.price})`).join("%0A");
    const message = `Hi! I'd like to order:%0A${lines}%0A%0ATotal: ₹${total}`;
    return `https://wa.me/YOUR_NUMBER?text=${message}`;
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
          <div key={`${item.id}-${i}`} className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
              <div>
                <p className="font-serif text-[#14213D]">{item.name}</p>
                <p className="text-sm text-gray-500">₹{item.price}</p>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 text-sm hover:underline"
            >
              Remove
            </button>
          </div>
        ))}

        <div className="flex justify-between font-medium text-lg pt-4 border-t border-gray-300">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

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