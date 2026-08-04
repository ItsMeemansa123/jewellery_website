import { useState } from "react";
import { useCart } from "../context/CartContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useCart();
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-[#fbfff1ea] sticky top-0 z-50">
      
      <div className="text-2xl font-semibold tracking-wide text-[#73251C]">
        Naari Jewels
      </div>

      <ul className="hidden md:flex gap-8 text-gray-700 text-sm">
        <li><a href="#home" className="hover:text-[#673544]">Home</a></li>
        <li><a href="#shop" className="hover:text-[#673544]">Shop</a></li>
        <li><a href="#about" className="hover:text-[#673544]">About</a></li>
        <li><a href="#contact" className="hover:text-[#673544]">Contact</a></li>
      </ul>
    <div className="flex items-center gap-4">
        {/* Cart icon - visible on ALL screen sizes */}
        <div className="relative text-2xl">
          ☰
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#02253d] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </div>

        {/* Hamburger - mobile only */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>
      {menuOpen && (
        <ul className="absolute top-full left-0 w-full bg-white flex flex-col gap-4 px-8 py-4 md:hidden">
          <li><a href="#home" onClick={() => setMenuOpen(false)}>Home</a></li>
          <li><a href="#shop" onClick={() => setMenuOpen(false)}>Shop</a></li>
          <li><a href="#about" onClick={() => setMenuOpen(false)}>About</a></li>
          <li><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
 