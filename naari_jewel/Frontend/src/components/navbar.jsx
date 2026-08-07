import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <nav className={`flex justify-between items-center px-8 py-4 bg-[#fbfff1ea] ${isAuthPage ? "" : "sticky top-0 z-50"}`}>
      <div className="text-2xl font-semibold tracking-wide text-[#162e61]">
        <Link to="/">Naari Jewels</Link>
      </div>

      {!isAuthPage && (
        <ul className="hidden md:flex gap-8 text-[#162e61]text-sm">
          <li><Link to="/" className="hover:text-[#73251C]">Home</Link></li>
          <li><Link to="/shop" className="hover:text-[#73251C]">Shop</Link></li>
          <li><a href="/#whatsapp" className="hover:text-[#673544]">Community</a></li>
        </ul>
      )}

      <div className="flex items-center gap-4">
        {isAuthPage ? (
          <Link to="/login" className="text-sm font-medium text-[#162e61] hover:underline">
            Login
          </Link>
        ) : user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 text-2xl"
            >
              🛍️
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-40 bg-white rounded-lg shadow-lg py-2 text-sm">
                <p className="px-4 py-2 text-gray-500 border-b">Hi, {user.name}</p>
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="text-sm font-medium text-[#162e61] hover:underline focus:outline-none">
            Login
          </Link>
        )}

        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {menuOpen && !isAuthPage && (
        <ul className="absolute top-full left-0 w-full bg-white flex flex-col gap-4 px-8 py-4 md:hidden">
          <li><a href="/#home" onClick={() => setMenuOpen(false)}>Home</a></li>
          <li><a href="/#shop" onClick={() => setMenuOpen(false)}>Shop</a></li>
          <li><a href="/#whatsapp" onClick={() => setMenuOpen(false)}>Community</a></li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;