import { motion } from "framer-motion";
import products from "../data/Products";
import MarqueeCard from "./MarqueeCard";

function Shop() {
 
  return (
    <section
      id="shop"
      className="py-20 px-6 bg-linear-to-b from-[#14213D] to-[#85756E]"
      >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false , amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
    
      <h2 className="text-3xl md:text-4xl font-serif text-center text-[#FBFFF1] mb-2">
        Our Collection
      </h2>
      <p className="text-center text-gray-400 mb-12">
        Handpicked pieces, made to last a lifetime.
      </p>
       {/* Row 1 - scrolls left */}
        <div className="overflow-hidden mb-8">
          <div className="flex gap-8 w-max animate-scroll-left">
            {[...products, ...products].map((product, i) => (
              <MarqueeCard key={`row1-${product.id}-${i}`} product={product} />
            ))}
          </div>
        </div>

        {/* Row 2 - scrolls right */}
        <div className="overflow-hidden">
          <div className="flex gap-8 w-max animate-scroll-right">
            {[...products, ...products].map((product, i) => (
              <MarqueeCard key={`row2-${product.id}-${i}`} product={product} />
            ))}
        
          </div>
        </div>
         <div className="text-center mt-12">
          <a
            href="https://whatsapp.com/channel/YOUR-CHANNEL-LINK-HERE"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#85756E] border border-[#85756E] text-white px-8 py-3 rounded-full hover:bg-[#14213D] hover:text-white transition font-medium"
          >
            Shop Now
          </a>
        </div>
          
      </motion.div>
    </section>
  );
}

export default Shop;



 {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div> */}