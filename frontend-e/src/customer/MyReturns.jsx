import { useEffect, useState } from "react";
import { Package, RotateCcw } from "lucide-react";
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
    const reason = window.prompt("Please enter the reason for return:");
    if (!reason) return; 

    try {
      await API.post("/returns", {
        order_id: id,
        reason: reason
      });
      alert("Return Requested Successfully ");
      load(); 
    } catch (err) {
      alert("Failed to request return: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">My Orders & Returns</h2>

      {loading ? (
          <p className="text-center py-10 text-gray-500">Loading...</p>
      ) : orders.length === 0 ? (
          <div className="text-center p-10 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-200">
            <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            No orders found. Go buy something!
          </div>
      ) : (
          <div className="space-y-4">
            {orders.map(o => (
                <div key={o.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition">
                    
                    <div className="flex-1 w-full">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                <Package size={20} className="text-blue-500" /> Order #{o.id}
                            </span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 border border-gray-200">
                                {new Date(o.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="text-gray-600 text-sm">
                            Total: <span className="font-bold text-black text-base">₹{o.total_amount.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border 
                            ${o.status === 'Placed' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                              o.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                              o.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' : 
                              'bg-gray-50 text-gray-700 border-gray-200'}`}>
                            {o.status}
                        </span>

                        {o.status === "Delivered" && (
                            <button
                            onClick={() => requestReturn(o.id)}
                            className="flex items-center gap-2 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-1.5 rounded-lg font-medium text-sm transition"
                            >
                            <RotateCcw size={16} /> Return Item
                            </button>
                        )}
                         
                        {o.status === "Placed" && (
                             <button className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition">Cancel Order</button>
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