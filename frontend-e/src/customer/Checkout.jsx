import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const Checkout = () => {
  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  const [address, setAddress] = useState("");
  const [pay, setPay] = useState("COD");
  const [loading, setLoading] = useState(false);

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const submit = async () => {
    if(!address) {
        alert("Please enter a shipping address.");
        return;
    }
    setLoading(true);

    try {
        const items = cart.map(p => ({
            product_id: p.id,
            quantity: p.qty
        }));

        await API.post("/orders", {
            items,
            payment_method: pay
        });

        localStorage.removeItem("cart");
        alert("Order Placed Successfully! 🎉");
        navigate("/");
    } catch (err) {
        alert("Order failed: " + err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Checkout</h2>
      
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left: Forms */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-lg mb-4">Shipping Information</h3>
            
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Delivery Address</label>
                <textarea
                    placeholder="Enter full address, city, and zip code"
                    onChange={e => setAddress(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500 min-h-[100px]"
                />
            </div>

            <h3 className="font-semibold text-lg mb-4">Payment Method</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div 
                    onClick={() => setPay("COD")}
                    className={`p-4 border rounded cursor-pointer flex items-center gap-2 ${pay === 'COD' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                >
                    <input type="radio" checked={pay === "COD"} readOnly /> 
                    <span>Cash on Delivery</span>
                </div>
                <div 
                    onClick={() => setPay("UPI")}
                    className={`p-4 border rounded cursor-pointer flex items-center gap-2 ${pay === 'UPI' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                >
                    <input type="radio" checked={pay === "UPI"} readOnly /> 
                    <span>UPI / Online</span>
                </div>
            </div>

            <button
                onClick={submit}
                disabled={loading}
                className={`w-full bg-green-600 text-white font-bold py-3 rounded shadow hover:bg-green-700 transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                {loading ? "Processing..." : `Confirm Order (₹${totalPrice})`}
            </button>
        </div>

        {/* Right: Summary */}
        <div className="w-full md:w-80 h-fit bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">In Your Bag</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
                {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.name} <span className="text-gray-500">x{item.qty}</span></span>
                        <span className="font-medium">₹{item.price * item.qty}</span>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t font-bold text-lg">
                <span>Total</span>
                <span>₹{totalPrice}</span>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;