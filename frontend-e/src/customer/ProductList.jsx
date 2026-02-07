import { useEffect, useState } from "react";
import API from "../api/api";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await API.get("/products");
    setProducts(res.data.data);
  };

  const addToCart = (p) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const found = cart.find(i => i.id === p.id);

    if (found) found.qty++;
    else cart.push({ ...p, qty: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  };

  return (
    <div className="p-6 grid grid-cols-3 gap-5">

      {products.map((p) => (
        <div key={p.id} className="bg-white p-4 shadow">

          <h3>{p.name}</h3>
          <p>₹{p.price}</p>
          <p>Stock: {p.stock}</p>

          <button
            onClick={() => addToCart(p)}
            className="bg-green-600 text-white px-3 py-1 mt-2"
          >
            Add
          </button>

        </div>
      ))}

    </div>
  );
};

export default ProductList;
