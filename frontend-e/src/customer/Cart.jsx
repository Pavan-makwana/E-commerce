import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  // Load cart on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Update localStorage whenever cart changes
  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const increaseQty = (id) => {
    const newCart = cart.map(item => 
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    );
    updateCart(newCart);
  };

  const decreaseQty = (id) => {
    const newCart = cart.map(item => 
      item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
    );
    updateCart(newCart);
  };

  const remove = (id) => {
    const newCart = cart.filter((item) => item.id !== id);
    updateCart(newCart);
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
        <button onClick={() => navigate("/")} className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Shopping Cart</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Cart Items List */}
        <div className="flex-1 space-y-4">
          {cart.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
              
              <div className="flex items-center gap-4">
                {/* Image Placeholder */}
                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                   <img src={p.image_url || "https://placehold.co/100"} alt={p.name} className="w-full h-full object-cover"/>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{p.name}</h3>
                  <p className="text-gray-500 text-sm">₹{p.price}</p>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded">
                    <button onClick={() => decreaseQty(p.id)} className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600">-</button>
                    <span className="px-3 py-1 text-sm font-semibold">{p.qty}</span>
                    <button onClick={() => increaseQty(p.id)} className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600">+</button>
                </div>
                
                <button 
                  onClick={() => remove(p.id)} 
                  className="text-red-500 hover:text-red-700 p-2" 
                  title="Remove Item"
                >
                  🗑️
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Order Summary</h3>
            
            <div className="flex justify-between mb-2 text-gray-600">
              <span>Subtotal ({cart.length} items)</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="flex justify-between mb-4 text-green-600">
              <span>Delivery</span>
              <span>Free</span>
            </div>
            
            <div className="flex justify-between mb-6 text-xl font-bold text-gray-900 border-t pt-2">
              <span>Total Amount</span>
              <span>₹{totalPrice}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded shadow transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;