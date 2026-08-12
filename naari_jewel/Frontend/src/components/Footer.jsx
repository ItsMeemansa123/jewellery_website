import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer id="contact" className="bg-[#14213D] text-[#FAF6EF] px-6 py-14">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          
          <div>
            <h3 className="text-2xl font-serif text-[#FAF6EF] mb-3">Naari Jewels</h3>
            <p className="text-sm text-[#FAF6EF]/70 max-w-xs">
              Handcrafted jewellery designed to be worn, loved, and passed down.
            </p>
          </div>

          <div>
            <h4 className="uppercase text-sm tracking-widest text-[#C9A66B] mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-[#FAF6EF]/80">
              <li><Link to="/" className="hover:text-[#C9A66B]">Home</Link></li>
              <li><Link to="/shop" className="hover:text-[#C9A66B]">Shop</Link></li>
              <li><a href="/#whatsapp" className="hover:text-[#C9A66B]">Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="uppercase text-sm tracking-widest text-[#C9A66B] mb-4">Get in Touch</h4>
            <div className="flex gap-4 mt-4 text-xl">
              <a href="https://instagram.com/naari_jewel" target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A66B]">
                Instagram
              </a>
              <a href="https://chat.whatsapp.com/G6jchGY3gCPJEtOivM9yw9" target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A66B]">
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#FAF6EF]/10 mt-10 pt-6 text-center text-xs text-[#FAF6EF]/50">
          © {new Date().getFullYear()} Naari Jewels. All rights reserved.
        </div>
      </motion.div>
    </footer>
  );
}

export default Footer;