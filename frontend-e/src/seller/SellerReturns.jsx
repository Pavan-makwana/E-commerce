import { useEffect, useState } from "react";
import API from "../api/api";

const SellerReturns = () => {
  const [returns, setReturns] = useState([]);

  useEffect(() => {
    const fetchReturns = async () => {
      const res = await API.get("/returns/seller");
      setReturns(res.data.data);
    };
    fetchReturns();
  }, []);

  const handleAction = async (id, status) => {
    await API.put(`/returns/${id}`, { status });
    alert(`Return ${status}`);
    // Refresh logic here
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Manage Returns</h2>
      
      {returns.length === 0 ? (
        <div className="bg-blue-50 p-10 text-center rounded-lg border border-blue-100">
          <p className="text-blue-600 font-medium">No pending return requests.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {returns.map((r) => (
            <div key={r.id} className="bg-white p-5 rounded-lg shadow-sm border flex justify-between items-center">
              <div>
                <p className="font-bold text-lg">Order #{r.order_id}</p>
                <p className="text-gray-600 italic">Reason: "{r.reason}"</p>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">Status: {r.status}</span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleAction(r.id, "Approved")}
                  className="bg-green-100 text-green-700 px-4 py-2 rounded hover:bg-green-200 transition"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleAction(r.id, "Rejected")}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerReturns;