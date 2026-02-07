import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      alert("Login Successful!");
      navigate("/");
    } catch (err) {
      alert("Invalid Credentials",err);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Login</h2>
        <p className="text-gray-500 mb-8">Get access to your Orders, Wishlist and Recommendations</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              className="w-full border-b-2 border-gray-300 py-2 focus:border-blue-600 outline-none transition"
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              className="w-full border-b-2 border-gray-300 py-2 focus:border-blue-600 outline-none transition"
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded shadow-md transition">
            Log In
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-600">
          New to E-Commerce? <Link to="/register" className="text-blue-600 font-bold">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;