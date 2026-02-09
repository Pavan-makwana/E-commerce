import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CreditCard, ShoppingBag } from "lucide-react";
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
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Checkout</h2>
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left: Forms */}
        <div className="flex-1 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-800">
               <MapPin className="text-blue-600" size={20} /> Shipping Information
            </h3>
            
            <div className="mb-8">
                <label className="block text-gray-700 text-sm font-medium mb-2">Delivery Address</label>
                <textarea
                    placeholder="Enter full address, city, and zip code"
                    onChange={e => setAddress(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-none"
                />
            </div>

            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-800">
               <CreditCard className="text-blue-600" size={20} /> Payment Method
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div 
                    onClick={() => setPay("COD")}
                    className={`p-4 border-2 rounded-xl cursor-pointer flex items-center gap-3 transition ${pay === 'COD' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                    <input type="radio" checked={pay === "COD"} readOnly className="w-4 h-4 text-blue-600" /> 
                    <span className="font-medium">Cash on Delivery</span>
                </div>
                <div 
                    onClick={() => setPay("UPI")}
                    className={`p-4 border-2 rounded-xl cursor-pointer flex items-center gap-3 transition ${pay === 'UPI' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                    <input type="radio" checked={pay === "UPI"} readOnly className="w-4 h-4 text-blue-600" /> 
                    <span className="font-medium">UPI / Online</span>
                </div>
            </div>

            <button
                onClick={submit}
                disabled={loading}
                className={`w-full bg-green-600 text-white font-bold py-3.5 rounded-lg shadow-md hover:bg-green-700 transition transform active:scale-95 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                {loading ? "Processing..." : `Confirm Order (₹${totalPrice.toLocaleString()})`}
            </button>
        </div>

        {/* Right: Summary */}
        <div className="w-full lg:w-96 h-fit bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                <ShoppingBag size={18} /> In Your Bag
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-sm items-center">
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-800 line-clamp-1 max-w-[150px]">{item.name}</span>
                            <span className="text-gray-500 text-xs">Qty: {item.qty}</span>
                        </div>
                        <span className="font-bold text-gray-900">₹{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t border-gray-300 font-bold text-xl text-gray-900">
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString()}</span>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;