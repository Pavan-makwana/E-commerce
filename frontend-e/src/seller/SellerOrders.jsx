import { useEffect, useState } from "react";
import API from "../api/api";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await API.get("/orders/seller"); 
      setOrders(res.data.data);
    };
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/orders/${id}`, { status });
    alert(`Order updated to ${status}`);
    // Refresh list
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Store Orders</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-mono">#{o.id}</td>
                <td className="p-4">{o.customer_name}</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                    {o.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => updateStatus(o.id, "Shipped")} className="text-sm bg-blue-600 text-white px-3 py-1 rounded">Ship</button>
                  <button onClick={() => updateStatus(o.id, "Delivered")} className="text-sm bg-green-600 text-white px-3 py-1 rounded">Deliver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerOrders;