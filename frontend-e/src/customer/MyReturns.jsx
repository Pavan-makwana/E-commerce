import { useEffect, useState } from "react";
import API from "../api/api";

const MyReturns = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await API.get("/orders/my");
    setOrders(res.data.data);
  };

  const request = async (id) => {
    await API.post("/returns", {
      order_id: id,
      reason: "Not satisfied"
    });

    alert("Return requested");
  };

  return (
    <div className="p-6">

      <h2>My Returns</h2>

      {orders.map(o => (
        <div key={o.id} className="mb-3">

          Order #{o.id} - {o.status}

          {o.status === "Delivered" && (
            <button
              onClick={() => request(o.id)}
              className="ml-3 text-blue-600"
            >
              Return
            </button>
          )}

        </div>
      ))}

    </div>
  );
};

export default MyReturns;
