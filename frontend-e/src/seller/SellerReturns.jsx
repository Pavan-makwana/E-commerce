import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
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
    // Ideally refresh list here
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Returns</h2>
      
      {returns.length === 0 ? (
        <div className="bg-blue-50 p-10 text-center rounded-xl border border-blue-100">
          <p className="text-blue-600 font-medium">No pending return requests.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {returns.map((r) => (
            <div key={r.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <p className="font-bold text-lg text-gray-800">Order #{r.order_id}</p>
                <div className="bg-gray-50 p-2 rounded mt-1 inline-block border border-gray-100">
                    <p className="text-gray-600 text-sm italic">"{r.reason}"</p>
                </div>
                <div className="mt-2">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-semibold border border-blue-100">
                        Status: {r.status}
                    </span>
                </div>
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => handleAction(r.id, "Approved")}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition font-medium text-sm"
                >
                  <Check size={16} /> Approve
                </button>
                <button 
                  onClick={() => handleAction(r.id, "Rejected")}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition font-medium text-sm"
                >
                  <X size={16} /> Reject
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