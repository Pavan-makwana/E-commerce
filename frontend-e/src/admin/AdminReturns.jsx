import { useEffect, useState } from "react";
import API from "../api/api";

const AdminReturns = () => {
  const [returns, setReturns] = useState([]);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const res = await API.get("/returns/admin");
      setReturns(res.data || []);
    } catch (err) {
      console.error("Failed to fetch returns",err);
    }
  };

  const handleAction = async (id, actionType) => {
    const statusMap = {
      'approve': 'Approved',
      'reject': 'Rejected',
      'refund': 'Refunded'
    };

    const newStatus = statusMap[actionType];
    if (!newStatus) return;

    if(!window.confirm(`Are you sure you want to mark this as ${newStatus}?`)) return;

    try {
      await API.put(`/returns/${id}`, { status: newStatus });
      alert("Status Updated Successfully ");
      fetchReturns();
    } catch (err) {
      alert("Update Failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Returns Processing</h2>
      
      <div className="grid gap-4">
        {returns.length > 0 ? (
          returns.map(r => (
             <div key={r.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h4 className="font-bold text-lg text-gray-800">Order #{r.order_id}</h4>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                       {new Date(r.order_date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-2">Customer: <span className="font-medium">{r.customer_name}</span></p>
                  
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 mb-3 w-full md:w-fit">
                    <span className="text-sm text-yellow-800">Reason:</span>
                    <p className="text-gray-800 italic">"{r.reason}"</p>
                  </div>
                  
                  <div>
                    <span className={`text-xs px-2 py-1 rounded font-bold uppercase tracking-wide
                      ${r.status === 'Requested' ? 'bg-blue-100 text-blue-800' : 
                        r.status === 'Approved' ? 'bg-purple-100 text-purple-800' : 
                        r.status === 'Refunded' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {r.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                   {r.status === 'Requested' && (
                     <>
                       <button 
                         onClick={() => handleAction(r.id, 'approve')} 
                         className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm text-sm font-bold transition"
                       >
                         Approve
                       </button>
                       <button 
                         onClick={() => handleAction(r.id, 'reject')} 
                         className="flex-1 md:flex-none bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded shadow-sm text-sm font-bold transition"
                       >
                         Reject
                       </button>
                     </>
                   )}
                   
                   {r.status === 'Approved' && (
                      <button 
                        onClick={() => handleAction(r.id, 'refund')} 
                        className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-sm text-sm font-bold transition"
                      >
                        Process Refund
                      </button>
                   )}

                   {(r.status === 'Refunded' || r.status === 'Rejected') && (
                      <span className="text-gray-400 text-sm font-medium italic px-4 py-2 bg-gray-50 rounded w-full text-center md:w-auto">Action Completed</span>
                   )}
                </div>
             </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed text-gray-400">
            No return requests pending.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReturns;