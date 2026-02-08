import { useEffect, useState } from "react";
import API from "../api/api";

const AdminReturns = () => {
  const [returns, setReturns] = useState([]);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    // Assuming returnRoutes.js has router.get("/admin", protect, isAdmin, getAllReturns)
    const res = await API.get("/returns/admin");
    setReturns(res.data);
  };

  const handleAction = async (id, type) => {
    // type = 'approve' | 'reject' | 'refund'
    await API.put(`/returns/${id}/${type}`);
    alert("Action Processed");
    fetchReturns();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Returns Processing</h2>
      <div className="grid gap-4">
        {returns.map(r => (
           <div key={r.id} className="bg-white p-6 rounded shadow flex justify-between items-center">
              <div>
                <h4 className="font-bold">Order #{r.order_id}</h4>
                <p className="text-gray-600">Reason: {r.reason}</p>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">Status: {r.status}</span>
              </div>
              
              <div className="flex gap-2">
                 {r.status === 'Requested' && (
                   <>
                     <button onClick={() => handleAction(r.id, 'approve')} className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200">Approve</button>
                     <button onClick={() => handleAction(r.id, 'reject')} className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200">Reject</button>
                   </>
                 )}
                 {r.status === 'Approved' && (
                    <button onClick={() => handleAction(r.id, 'refund')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Process Refund</button>
                 )}
              </div>
           </div>
        ))}
        {returns.length === 0 && <p>No returns pending.</p>}
      </div>
    </div>
  );
};

export default AdminReturns;