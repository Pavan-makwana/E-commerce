import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const Checkout = () => {
  const nav = useNavigate();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const [address, setAddress] = useState("");
  const [pay, setPay] = useState("COD");

  const submit = async () => {

    const items = cart.map(p => ({
      product_id: p.id,
      quantity: p.qty
    }));

    await API.post("/orders", {
      items,
      payment_method: pay
    });

    localStorage.removeItem("cart");

    alert("Order Placed");
    nav("/");
  };

  return (
    <div className="p-6">

      <h2>Checkout</h2>

      <textarea
        placeholder="Address"
        onChange={e => setAddress(e.target.value)}
        className="border w-full"
      />

      <br />

      <select onChange={e => setPay(e.target.value)}>
        <option>COD</option>
        <option>UPI</option>
      </select>

      <br /><br />

      <button
        onClick={submit}
        className="bg-green-600 text-white px-4 py-1"
      >
        Confirm
      </button>

    </div>
  );
};

export default Checkout;
