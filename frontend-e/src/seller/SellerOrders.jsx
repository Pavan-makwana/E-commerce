import { useEffect, useState } from "react";
import API from "../api/api";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);

 
  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/seller");
      setOrders(res.data.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

 useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/seller-status`, { status }); 
      alert(`Order updated to ${status}`);
      fetchOrders();
    } catch (err) {
      alert("Failed to update status",err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Placed": return "bg-yellow-100 text-yellow-800";
      case "Shipped": return "bg-blue-100 text-blue-800";
      case "Delivered": return "bg-green-100 text-green-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      case "Returned": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Store Orders</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-mono text-gray-600">#{o.id}</td>
                <td className="p-4 font-medium text-gray-900">{o.customer_name}</td>
                <td className="p-4 text-gray-500 text-sm">
                   {/* Assuming API returns distinct product names or count */}
                   {o.quantity ? `${o.quantity} items` : "View Details"}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(o.status)}`}>
                    {o.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  {/* Logic: Only show buttons if action is valid */}
                  {o.status === "Placed" && (
                    <button 
                      onClick={() => updateStatus(o.id, "Shipped")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold shadow-sm"
                    >
                      Ship Order
                    </button>
                  )}
                  
                  {o.status === "Shipped" && (
                    <button 
                      onClick={() => updateStatus(o.id, "Delivered")}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-bold shadow-sm"
                    >
                      Mark Delivered
                    </button>
                  )}

                  {o.status === "Delivered" && (
                    <span className="text-gray-400 text-xs font-medium">Completed</span>
                  )}
                  
                  {(o.status === "Cancelled" || o.status === "Returned") && (
                     <span className="text-red-400 text-xs font-medium">No Actions</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {orders.length === 0 && (
            <div className="p-8 text-center text-gray-500">No orders found for your store.</div>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;