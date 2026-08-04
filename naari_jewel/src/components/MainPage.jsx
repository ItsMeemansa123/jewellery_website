import { useEffect, useRef } from "react";

function MainPage() {


  return (
    
    <section
      id="home"
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-linear-to-b from-[#FBFFF1] to-[#85756E]"
    >
      <p className="uppercase tracking-widest text-[#73251C] text-sm mb-4">
        Naari Jewels
      </p>

      <h1 className="text-4xl md:text-6xl font-serif text-[#172b28] max-w-3xl leading-tight">
        Timeless pieces, <span className="italic text-[#73251C]">crafted for you.</span>
      </h1>

      <p className="mt-6 text-[#00243D] max-w-xl">
        Handcrafted jewellery designed to be worn, loved, and passed down.
      </p>

      <div className="mt-8 flex gap-4">
        
        <a
          href="#shop"
          className="border border-[#85756E] text-[#00243D] px-6 py-3 rounded-full hover:bg-[#85756E] hover:text-white transition"
        >
          Shop Collection
        </a>
        <a
          href="#about"
          className="border border-[#85756E] text-[#00243D] px-6 py-3 rounded-full hover:bg-[#85756E] hover:text-white transition"
        >
          Our Story
        </a>
      </div>
    </section>
  );
}

export default MainPage;