import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {

  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  const nav = useNavigate();

  const remove = (id) => {
    const c = cart.filter(i => i.id !== id);

    setCart(c);
    localStorage.setItem("cart", JSON.stringify(c));
  };

  return (
    <div className="p-6">

      <h2 className="text-xl mb-4">Cart</h2>

      {cart.map((p) => (
        <div key={p.id} className="flex justify-between mb-2">
          {p.name} x {p.qty}

          <button onClick={() => remove(p.id)}>❌</button>
        </div>
      ))}

      {cart.length > 0 && (
        <button
          onClick={() => nav("/checkout")}
          className="bg-blue-600 text-white px-4 py-1"
        >
          Checkout
        </button>
      )}

    </div>
  );
};

export default Cart;
