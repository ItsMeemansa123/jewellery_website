import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { API_BASE_URL } from "../services/api";

function ShopAll() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/products`).then((res) => {
      setProducts(res.data.slice(0, 12));
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#14213D] px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-serif text-center text-[#FAF6EF] mb-2">
        Shop Our Pieces
      </h2>
      <p className="text-center text-[#FAF6EF]/60 mb-12">
        A curated selection, handpicked for you.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
         {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <div className="text-center mt-14">
        <a
          href="https://chat.whatsapp.com/BDRJBdeyyVWGVso9MfUp1X"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#25D366] text-white px-8 py-3 rounded-full hover:bg-[#1ebe5d] transition font-medium"
        >
          Shop More on WhatsApp
        </a>
      </div>
    </div>
  );
}

export default ShopAll;