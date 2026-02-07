import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, sales: 0, orders: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admin/stats");
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
        <span className="bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full">
          Super Admin Access
        </span>
      </div>
      
      {/* 📊 Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Total Revenue */}
        <div 
          onClick={() => navigate("/admin/analytics")}
          className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition duration-300"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 uppercase text-xs font-bold tracking-wider">Total Revenue</p>
              <h2 className="text-4xl font-bold mt-1">₹{stats.sales?.toLocaleString() || 0}</h2>
            </div>
            <span className="text-3xl opacity-50">💰</span>
          </div>
          <p className="text-sm text-blue-100 mt-4 underline opacity-80">View Analytics Report →</p>
        </div>

        {/* Active Users */}
        <div 
          onClick={() => navigate("/admin/users")}
          className="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-6 rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition duration-300"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 uppercase text-xs font-bold tracking-wider">Total Users</p>
              <h2 className="text-4xl font-bold mt-1">{stats.users || 0}</h2>
            </div>
            <span className="text-3xl opacity-50">👥</span>
          </div>
          <p className="text-sm text-purple-100 mt-4 underline opacity-80">Manage Users & Sellers →</p>
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-orange-100 uppercase text-xs font-bold tracking-wider">Total Orders</p>
              <h2 className="text-4xl font-bold mt-1">{stats.orders || 0}</h2>
            </div>
            <span className="text-3xl opacity-50">📦</span>
          </div>
          <p className="text-sm text-orange-100 mt-4 opacity-80">System Wide Orders</p>
        </div>
      </div>

      {/* 🛠️ Platform Controls Section */}
      <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Manage Users Button */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600 text-xl">👤</div>
            <h4 className="font-bold text-lg">Manage Users</h4>
          </div>
          <p className="text-gray-500 text-sm mb-4">View, edit, or ban customers and admins.</p>
          <button 
            onClick={() => navigate("/admin/users")}
            className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition"
          >
            Go to Users
          </button>
        </div>

        {/* Manage Sellers Button */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-orange-100 p-3 rounded-full text-orange-600 text-xl">🏪</div>
            <h4 className="font-bold text-lg">Manage Sellers</h4>
          </div>
          <p className="text-gray-500 text-sm mb-4">Oversee seller accounts and inventory.</p>
          <button 
            onClick={() => navigate("/admin/users")} // Points to users list (sellers are users)
            className="w-full bg-gray-800 text-white py-2 rounded font-medium hover:bg-black transition"
          >
            View Sellers
          </button>
        </div>

        {/* Analytics Button */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-green-100 p-3 rounded-full text-green-600 text-xl">📈</div>
            <h4 className="font-bold text-lg">Platform Analytics</h4>
          </div>
          <p className="text-gray-500 text-sm mb-4">Deep dive into sales and categories.</p>
          <button 
            onClick={() => navigate("/admin/analytics")}
            className="w-full border border-green-600 text-green-600 py-2 rounded font-medium hover:bg-green-50 transition"
          >
            View Charts
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;