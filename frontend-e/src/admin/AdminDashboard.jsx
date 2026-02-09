import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IndianRupee , Users, Package, BarChart3, RotateCcw } from "lucide-react";
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
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
        <span className="bg-purple-100 text-purple-800 text-xs md:text-sm font-semibold px-3 py-1 rounded-full">
          Super Admin Access
        </span>
      </div>
      
      {/*  Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-10">
        
        {/* Total Revenue */}
        <div 
          onClick={() => navigate("/admin/analytics")}
          className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition duration-300"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 uppercase text-xs font-bold tracking-wider">Total Revenue</p>
              <h2 className="text-3xl md:text-4xl font-bold mt-1">₹{stats.sales?.toLocaleString() || 0}</h2>
            </div>
            < IndianRupee  className="w-8 h-8 md:w-10 md:h-10 opacity-50" />
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
              <h2 className="text-3xl md:text-4xl font-bold mt-1">{stats.users || 0}</h2>
            </div>
            <Users className="w-8 h-8 md:w-10 md:h-10 opacity-50" />
          </div>
          <p className="text-sm text-purple-100 mt-4 underline opacity-80">Manage Users →</p>
        </div>

        {/* Total Orders */}
        <div 
          onClick={() => navigate("/admin/orders")}
          className="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-6 rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition duration-300"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-orange-100 uppercase text-xs font-bold tracking-wider">Total Orders</p>
              <h2 className="text-3xl md:text-4xl font-bold mt-1">{stats.orders || 0}</h2>
            </div>
            <Package className="w-8 h-8 md:w-10 md:h-10 opacity-50" />
          </div>
          <p className="text-sm text-orange-100 mt-4 underline opacity-80">Manage Orders →</p>
        </div>
      </div>

      {/* 🛠️ Platform Controls Section */}
      <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Manage Users */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <Users className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-lg">Users</h4>
          </div>
          <p className="text-gray-500 text-sm mb-4">Manage customers & sellers.</p>
          <button onClick={() => navigate("/admin/users")} className="w-full bg-blue-50 text-blue-600 py-2 rounded font-medium hover:bg-blue-100 transition">
            View Users
          </button>
        </div>

        {/* Manage Orders */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                <Package className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-lg">Orders</h4>
          </div>
          <p className="text-gray-500 text-sm mb-4">Update status & track shipping.</p>
          <button onClick={() => navigate("/admin/orders")} className="w-full bg-orange-50 text-orange-600 py-2 rounded font-medium hover:bg-orange-100 transition">
            Track Orders
          </button>
        </div>

        {/* Products & Sales */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                <BarChart3 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-lg">Sales & Items</h4>
          </div>
          <p className="text-gray-500 text-sm mb-4">View sales history & inventory.</p>
          <button onClick={() => navigate("/admin/products")} className="w-full bg-purple-50 text-purple-600 py-2 rounded font-medium hover:bg-purple-100 transition">
            View Sales
          </button>
        </div>

        {/* Returns */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-red-100 p-2 rounded-lg text-red-600">
                <RotateCcw className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-lg">Returns</h4>
          </div>
          <p className="text-gray-500 text-sm mb-4">Approve or reject refunds.</p>
          <button onClick={() => navigate("/admin/returns")} className="w-full bg-red-50 text-red-600 py-2 rounded font-medium hover:bg-red-100 transition">
            Check Returns
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;