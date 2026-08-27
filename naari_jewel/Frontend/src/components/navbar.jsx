import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping, faBars } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { cart, totalItems } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  return (
    <nav className={`flex justify-between items-center px-6 md:px-8 py-4 bg-[#fbfff1ea] backdrop-blur-md ${isAuthPage ? "" : "sticky top-0 z-50 shadow-xs"}`}>
      <div className="text-2xl font-semibold tracking-wide text-[#162e61] font-serif">
        <Link to="/">Naari Jewels</Link>
      </div>

      {!isAuthPage && (
        <ul className="hidden md:flex items-center gap-7 text-[#162e61] text-sm font-medium">
          <li><Link to="/" className="hover:text-[#73251C] transition">Home</Link></li>
          <li>
            <Link
              to="/ai-shopping"
              className="bg-gradient-to-r from-[#14213D] to-[#2B3E68] text-[#FAF6EF] px-4 py-1.5 rounded-full hover:shadow-md transition flex items-center gap-1.5 text-xs font-semibold"
            >
              <span>✨</span>
              <span>AI Shopping</span>
            </Link>
          </li>
          <li><Link to="/shop" className="hover:text-[#73251C] transition">Shop Collection</Link></li>
          <li><Link to="/orders" className="hover:text-[#73251C] transition">My Orders</Link></li>
          <li><a href="/#whatsapp" className="hover:text-[#673544] transition">Community</a></li>
        </ul>
      )}

      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        {!isAuthPage && (
          <button
            className="md:hidden text-lg text-[#162e61]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        )}

        {isAuthPage ? (
          <Link to="/login" className="text-sm font-medium text-[#162e61] hover:underline">
            Login
          </Link>
        ) : user ? (
          <div className="relative flex items-center gap-3">
            <button
              onClick={() => navigate("/cart")}
              className="flex items-center text-xl text-[#162e61] relative p-1"
              title="Shopping Cart"
            >
              <FontAwesomeIcon icon={faBagShopping} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-yellow-700 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems || cart.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-8 h-8 rounded-full bg-[#162e61] text-[#FAF6EF] flex items-center justify-center text-xs font-bold"
            >
              {user.name.charAt(0).toUpperCase()}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-3 w-48 bg-white rounded-xl shadow-xl py-2 text-sm z-50 border border-gray-100">
                <p className="px-4 py-2 text-gray-700 font-semibold border-b">Hi, {user.name}</p>
                <Link
                  to="/ai-shopping"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-50 text-[#14213D]"
                >
                  ✨ AI Shopping Agent
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-50 text-gray-700"
                >
                  📦 My Orders
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-50 text-purple-700 font-medium"
                  >
                    ⚙️ Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                    navigate("/");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 border-t"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="text-xs font-semibold bg-[#162e61] text-[#FAF6EF] px-5 py-2 rounded-full hover:bg-[#14213D] transition shadow-sm"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Drawer */}
      {menuOpen && !isAuthPage && (
        <ul className="absolute top-full left-0 w-full bg-[#FBFFF1] flex flex-col gap-3 px-8 py-5 md:hidden shadow-lg border-t border-gray-200">
          <li>
            <Link
              to="/ai-shopping"
              onClick={() => setMenuOpen(false)}
              className="block bg-[#14213D] text-[#FAF6EF] py-2 px-4 rounded-xl font-semibold text-center"
            >
              ✨ Shop with Naari AI
            </Link>
          </li>
          <li><Link to="/" onClick={() => setMenuOpen(false)} className="block py-1 text-[#162e61]">Home</Link></li>
          <li><Link to="/shop" onClick={() => setMenuOpen(false)} className="block py-1 text-[#162e61]">Shop All</Link></li>
          {user ? (
            <>
              <li><Link to="/orders" onClick={() => setMenuOpen(false)} className="block py-1 text-[#162e61]">My Orders</Link></li>
              <li><Link to="/cart" onClick={() => setMenuOpen(false)} className="block py-1 text-[#162e61]">Cart ({cart.length})</Link></li>
            </>
          ) : (
            <li><Link to="/login" onClick={() => setMenuOpen(false)} className="block py-1 text-[#73251C] font-semibold">Login / Sign Up</Link></li>
          )}
          <li><a href="/#whatsapp" onClick={() => setMenuOpen(false)} className="block py-1 text-[#162e61]">Community</a></li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;