import { motion } from "framer-motion";
import products from "../data/products";
import ProductCard from "./ProductCard";

function Shop() {
 
  return (
    <section
      id="shop"
      className="py-20 px-6 bg-linear-to-b from-[#85756E] to-[#670d30]"
      >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
    
      <h2 className="text-3xl md:text-4xl font-serif text-center text-[#FBFFF1] mb-2">
        Our Collection
      </h2>
      <p className="text-center text-gray-400 mb-12">
        Handpicked pieces, made to last a lifetime.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      </motion.div>
    </section>
  );
}

export default Shop;