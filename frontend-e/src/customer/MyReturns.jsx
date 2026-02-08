import { useEffect, useState } from "react";
import API from "../api/api";

const MyReturns = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await API.get("/orders/my");
      setOrders(res.data.data);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const requestReturn = async (id) => {
    // 1. Ask for reason
    const reason = window.prompt("Please enter the reason for return:");
    if (!reason) return; // Cancelled

    try {
      await API.post("/returns", {
        order_id: id,
        reason: reason
      });
      alert("Return Requested Successfully ✅");
      load(); // Refresh to update status
    } catch (err) {
      alert("Failed to request return: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders & Returns</h2>

      {loading ? (
          <p>Loading...</p>
      ) : orders.length === 0 ? (
          <div className="text-center p-10 text-gray-500 bg-white rounded shadow">No orders found. Go buy something!</div>
      ) : (
          <div className="space-y-4">
            {orders.map(o => (
                <div key={o.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <span className="font-bold text-lg text-gray-800">Order #{o.id}</span>
                            <span className="text-sm text-gray-500">{new Date(o.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="text-gray-600">Total: <span className="font-semibold text-black">₹{o.total_amount}</span></div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold border 
                            ${o.status === 'Placed' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                              o.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                              o.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' : 
                              'bg-gray-50 text-gray-700 border-gray-200'}`}>
                            {o.status}
                        </span>

                        {o.status === "Delivered" && (
                            <button
                            onClick={() => requestReturn(o.id)}
                            className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded font-medium transition"
                            >
                            Return Item
                            </button>
                        )}
                         
                         {/* Optional: Cancel button if just placed */}
                        {o.status === "Placed" && (
                             <button className="text-red-500 hover:underline text-sm font-medium">Cancel Order</button>
                        )}
                    </div>

                </div>
            ))}
          </div>
      )}
    </div>
  );
};

export default MyReturns;