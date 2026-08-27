import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../services/api";

function Categories() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/products`).then((res) => {
      setProducts(res.data);
    });
  }, []);

  // Extract unique categories & styles dynamically with sample images
  const categoryMap = new Map();
  products.forEach((p) => {
    const key = p.category || p.style;
    if (key && !categoryMap.has(key)) {
      categoryMap.set(key, {
        name: key,
        image: p.image,
        count: products.filter((item) => item.category === key || item.style === key).length,
      });
    }
  });

  const categories = Array.from(categoryMap.values()).slice(0, 6);

  function handleCategoryClick(catName) {
    navigate(`/shop`);
  }

  return (
    <section className="py-20 px-6 bg-linear-to-b from-[#85756E] to-[#14213D]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-3xl md:text-4xl font-serif text-center text-[#FAF6EF] mb-2">
          Explore Our Variety
        </h2>
        <p className="text-center text-[#FAF6EF]/60 mb-12">
          From everyday elegance to statement heirloom pieces.
        </p>

        {/* Dynamically balanced responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleCategoryClick(cat.name)}
              className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-lg aspect-4/5 md:aspect-square bg-gray-900"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <p className="text-[#FAF6EF] font-serif text-2xl tracking-wide font-medium">
                  {cat.name}
                </p>
                <p className="text-white/70 text-xs mt-1 flex items-center gap-1 group-hover:text-[#C9A66B] transition-colors">
                  <span>Explore Collection</span>
                  <span>→</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default Categories;