import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function Categories() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/products`).then((res) => {
      setProducts(res.data);
    });
  }, []);

  const categories = [...new Set(products.map((p) => p.style))].map((styleName) => {
    const sample = products.find((p) => p.style === styleName);
    return { name: styleName, image: sample.image };
  });

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
          From everyday elegance to statement pieces.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="relative rounded-2xl overflow-hidden group cursor-pointer"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-80 md:h-96 object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex items-end justify-center pb-6">
                <p className="text-[#FAF6EF] font-serif text-2xl tracking-wide">
                  {cat.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default Categories;