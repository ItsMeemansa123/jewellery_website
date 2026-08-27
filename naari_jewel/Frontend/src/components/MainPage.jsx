import { Link } from "react-router-dom";

function MainPage() {
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-linear-to-b from-[#FBFFF1] to-[#85756E] py-16"
    >
      <div className="inline-flex items-center gap-2 bg-[#14213D]/10 text-[#73251C] text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
        <span>✨</span>
        <span>AI-Powered Fine Jewellery Experience</span>
      </div>

      <h1 className="text-4xl md:text-6xl font-serif text-[#172b28] max-w-3xl leading-tight">
        Timeless pieces, <span className="italic text-[#73251C]">crafted for you.</span>
      </h1>

      <p className="mt-6 text-[#00243D] max-w-xl text-base md:text-lg">
        Handcrafted jewellery designed to be worn, loved, and passed down. Discover your ideal match through conversational AI shopping.
      </p>

      {/* Primary Action Buttons */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          to="/ai-shopping"
          className="bg-[#14213D] text-[#FAF6EF] px-8 py-3.5 rounded-full font-medium shadow-xl hover:bg-[#0b265e] transition flex items-center gap-2 text-sm md:text-base group"
        >
          <span className="group-hover:rotate-12 transition-transform">✨</span>
          <span>Find My Piece with AI</span>
        </Link>
        <a
          href="#shop"
          className="border border-[#85756E] text-[#00243D] px-6 py-3.5 rounded-full hover:bg-[#85756E] hover:text-white transition text-sm md:text-base"
        >
          Browse Catalog
        </a>
      </div>

      {/* Quick AI Starter Prompts */}
      <div className="mt-10 max-w-2xl w-full bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-sm">
        <p className="text-xs text-[#73251C] font-semibold mb-2">Try asking Naari AI:</p>
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          <Link
            to="/ai-shopping"
            className="bg-white/80 hover:bg-white text-[#14213D] px-3 py-1.5 rounded-full transition shadow-xs border border-amber-900/10"
          >
            "Birthday gift under ₹2000 for sister"
          </Link>
          <Link
            to="/ai-shopping"
            className="bg-white/80 hover:bg-white text-[#14213D] px-3 py-1.5 rounded-full transition shadow-xs border border-amber-900/10"
          >
            "Minimal earrings for daily office wear"
          </Link>
          <Link
            to="/ai-shopping"
            className="bg-white/80 hover:bg-white text-[#14213D] px-3 py-1.5 rounded-full transition shadow-xs border border-amber-900/10"
          >
            "Compare top 2 necklaces"
          </Link>
        </div>
      </div>
    </section>
  );
}

export default MainPage;