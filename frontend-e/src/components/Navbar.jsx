import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">

      {/* Logo */}
      <h2 className="text-xl font-bold">E-Commerce</h2>

      {/* Links */}
      <div className="flex gap-5 items-center">

        <Link to="/" className="hover:text-yellow-400">
          Products
        </Link>

        {/* Customer Links */}
        {role === "customer" && token && (
          <>
            <Link to="/cart" className="hover:text-yellow-400">
              Cart
            </Link>

            <Link to="/returns" className="hover:text-yellow-400">
              My Returns
            </Link>
          </>
        )}

        {/* Not Logged In */}
        {!token ? (
          <>
            <Link
              to="/login"
              className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
            >
              Register
            </Link>
          </>
        ) : (
          /* Logged In */
          <button
            onClick={logout}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
