import { useEffect, useState } from "react";
import API from "../api/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await API.get("/admin/orders");
    setOrders(res.data.data);
  };

  const updateStatus = async (id, newStatus) => {
    await API.put(`/admin/orders/${id}`, { status: newStatus });
    alert("Order Updated");
    fetchOrders();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b hover:bg-gray-50">
                <td className="p-4">#{o.id}</td>
                <td className="p-4 font-medium">{o.customer_name}</td>
                <td className="p-4">₹{o.total_amount}</td>
                <td className="p-4">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${o.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {o.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <select 
                    className="border p-1 rounded text-sm"
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    value={o.status}
                  >
                     <option>Placed</option>
                     <option>Shipped</option>
                     <option>Delivered</option>
                     <option>Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;