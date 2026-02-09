import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { ShoppingCart, Search } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${search}`);
  };

  const getLinkClass = (path, activeColorClass = "text-yellow-400") => {
    return location.pathname === path
      ? `${activeColorClass} font-extrabold underline decoration-2 underline-offset-4` // Active State
      : `text-white hover:${activeColorClass} transition-colors duration-200`; // Inactive State
  };

  return (
    <nav className="bg-gray-900 text-white px-4 md:px-8 py-3 flex flex-wrap gap-4 justify-between items-center sticky top-0 z-50 shadow-lg">
      
      {/* Brand Logo */}
      <Link to="/" className="text-xl md:text-2xl font-extrabold tracking-tight text-yellow-400 shrink-0">
        E-SHOP<span className="text-white">.</span>
      </Link>

      {/* Central Search Bar */}
      <form onSubmit={handleSearch} className="order-last md:order-none w-full md:w-auto flex-1 md:max-w-xl md:mx-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full py-2 px-4 pr-10 rounded-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="absolute right-2 top-2 text-gray-500 hover:text-gray-700">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Action Links */}
      <div className="flex gap-4 md:gap-8 items-center font-medium shrink-0">
        {!token ? (
          <Link to="/login" className="bg-white text-gray-900 px-6 py-1.5 rounded-sm font-bold hover:bg-gray-200 transition text-sm md:text-base">
            Login
          </Link>
        ) : (
          <div className="flex items-center gap-4 md:gap-6">
            
            {/* CUSTOMER VIEW */}
            {role === "customer" && (
              <>
                <Link to="/cart" className={`flex items-center gap-1 ${getLinkClass("/cart", "text-yellow-400")}`}>
                   <ShoppingCart className="w-5 h-5" /> <span className="hidden sm:inline">Cart</span>
                </Link>
                <Link to="/returns" className={`text-sm md:text-base ${getLinkClass("/returns", "text-yellow-400")}`}>
                  My Orders
                </Link>
              </>
            )}

            {/* SELLER VIEW  */}
            {role === "seller" && (
              <>
                <Link to="/seller/products" className={`text-sm md:text-base ${getLinkClass("/seller/products", "text-orange-400")}`}>
                  Inventory
                </Link>
                <Link to="/seller/orders" className={`text-sm md:text-base ${getLinkClass("/seller/orders", "text-orange-400")}`}>
                  Orders
                </Link>
                <Link to="/seller/returns" className={`text-sm md:text-base ${getLinkClass("/seller/returns", "text-orange-400")}`}>
                  Returns
                </Link>
              </>
            )}

            {/* ADMIN VIEW */}
            {role === "admin" && (
              <div className="flex gap-3 text-sm md:text-base">
                <Link to="/admin" className={getLinkClass("/admin", "text-purple-400")}>
                  Dashboard
                </Link>
                <Link to="/admin/orders" className={`hidden sm:inline ${getLinkClass("/admin/orders", "text-purple-400")}`}>
                  Orders
                </Link>
                <Link to="/admin/products" className={`hidden sm:inline ${getLinkClass("/admin/products", "text-purple-400")}`}>
                  Sales
                </Link>
                <Link to="/admin/returns" className={`hidden sm:inline ${getLinkClass("/admin/returns", "text-purple-400")}`}>
                  Returns
                </Link>
              </div>
            )}

            <button onClick={logout} className="text-xs md:text-sm border border-gray-500 px-3 py-1 rounded hover:bg-red-600 hover:border-red-600 transition">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;