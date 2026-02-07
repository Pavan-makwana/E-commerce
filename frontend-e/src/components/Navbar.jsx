import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // 1. Get the Role from LocalStorage
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

  return (
    <nav className="bg-gray-900 text-white px-8 py-3 flex justify-between items-center sticky top-0 z-50 shadow-lg">
      
      {/* Brand Logo */}
      <Link to="/" className="text-2xl font-extrabold tracking-tight text-yellow-400">
        E-SHOP<span className="text-white">.</span>
      </Link>

      {/* Central Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full py-2 px-4 pr-10 rounded-sm bg-white text-black focus:outline-none"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="absolute right-2 top-2 text-gray-500">
            🔍
          </button>
        </div>
      </form>

      {/* Action Links */}
      <div className="flex gap-8 items-center font-medium">
        {!token ? (
          <Link to="/login" className="bg-white text-gray-900 px-6 py-1.5 rounded-sm font-bold hover:bg-gray-200 transition">
            Login
          </Link>
        ) : (
          <div className="flex items-center gap-6">
            
            {/* 🛒 CUSTOMER VIEW */}
            {role === "customer" && (
              <>
                <Link to="/cart" className="hover:text-yellow-400 flex items-center gap-1">
                  🛒 <span>Cart</span>
                </Link>
                <Link to="/returns" className="hover:text-yellow-400">My Orders</Link>
              </>
            )}

            {/* 🏪 SELLER VIEW (This was missing!) */}
            {role === "seller" && (
              <>
                <Link to="/seller/products" className="text-orange-400 font-bold hover:text-orange-300">
                  Inventory (Add Product)
                </Link>
                <Link to="/seller/orders" className="hover:text-yellow-400">
                  Store Orders
                </Link>
                <Link to="/seller/returns" className="hover:text-yellow-400">
                  Returns
                </Link>
              </>
            )}

            {/* 🛡️ ADMIN VIEW */}
            {role === "admin" && (
              <Link to="/admin" className="text-purple-400 font-bold hover:text-purple-300">
                Dashboard
              </Link>
            )}

            <button onClick={logout} className="text-sm border border-gray-500 px-3 py-1 rounded hover:bg-red-600 hover:border-red-600 transition">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;