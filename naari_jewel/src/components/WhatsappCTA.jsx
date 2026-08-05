import { motion } from "framer-motion";


function WhatsAppCTA() {
  return (
    <section
      id="whatsapp"
      className="py-20 px-6 bg-linear-to-b from-[#85756E] to-[#14213D] text-center"
    >
    <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false , amount: 0.3 }}
        transition={{ duration: 1, ease: "easeOut" }}
    >

   
      <p className="uppercase tracking-widest text-[#C9A66B] text-sm mb-4">
        Stay in the loop
      </p>
      <h2 className="text-3xl md:text-4xl font-serif text-[#FAF6EF] max-w-2xl mx-auto leading-tight">
        Get first access to new arrivals on WhatsApp
      </h2>
      <p className="mt-4 text-[#FAF6EF]/70 max-w-lg mx-auto">
        Join our WhatsApp groupfor new collection drops, restocks, and exclusive offers before anyone else.
      </p>

      
      <a  
        href="https://whatsapp.com/channel/YOUR-CHANNEL-LINK-HERE"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-8 bg-[#25D366] text-white px-8 py-3 rounded-full hover:bg-[#1ebe5d] transition font-medium"
      >
        Join WhatsApp Group
      </a>
    </motion.div>
    </section>
  );
}

export default WhatsAppCTA;