import { motion } from "framer-motion";

function OurStory() {
  return (
    <section id="story" className="py-20 px-6 bg-[#85756E] text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl mx-auto"
      >
        <p className="uppercase tracking-widest text-[#C9A66B] text-sm mb-4">Our Story</p>
        <h2 className="text-3xl md:text-4xl font-serif text-[#FAF6EF] mb-6">
          Made with intention, worn with meaning.
        </h2>
        <p className="text-[#FAF6EF]/70 leading-relaxed">
          Naari Jewels began with a simple belief — that jewellery should feel personal,
          not mass-produced. Every piece we create is handcrafted with care, blending
          timeless design with everyday wearability. We're not just selling accessories;
          we're building pieces that become part of your story, worn on the days that matter
          and the ones that don't need a reason at all.
        </p>
      </motion.div>
    </section>
  );
}

export default OurStory;