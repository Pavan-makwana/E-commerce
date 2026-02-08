import { useEffect, useState } from "react";
import API from "../api/api";

const AdminProducts = () => {
  const [tab, setTab] = useState("inventory"); // inventory | sales
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  
  // Add Product Form State
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", category: "Electronics", stock: "", image_url: ""
  });



  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data.data);
  };

  const fetchSales = async () => {
    const res = await API.get("/admin/sales");
    setSales(res.data.data);
  };

    useEffect(() => {
    if (tab === "inventory") fetchProducts();
    else fetchSales();
  }, [tab]);

  const handleDelete = async (id) => {
    if(window.confirm("Delete this product?")) {
      await API.delete(`/products/${id}`);
      fetchProducts();
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post("/products", formData);
      alert("Product Added");
      setFormData({ name: "", description: "", price: "", category: "Electronics", stock: "", image_url: "" });
      fetchProducts();
    } catch(err) { alert("Error adding product"); }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Product & Sales Center</h2>
      
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button onClick={() => setTab("inventory")} className={`px-4 py-2 rounded ${tab==="inventory" ? "bg-blue-600 text-white" : "bg-white"}`}>Manage Inventory</button>
        <button onClick={() => setTab("sales")} className={`px-4 py-2 rounded ${tab==="sales" ? "bg-blue-600 text-white" : "bg-white"}`}>Sales History</button>
      </div>

      {/* --- INVENTORY TAB (CRUD) --- */}
      {tab === "inventory" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add Form */}
          <div className="bg-white p-6 rounded shadow h-fit">
            <h3 className="font-bold mb-4">Add New Product</h3>
            <form onSubmit={handleAdd} className="flex flex-col gap-3">
              <input placeholder="Name" className="border p-2 rounded" onChange={e => setFormData({...formData, name: e.target.value})} value={formData.name} required />
              <input placeholder="Price" type="number" className="border p-2 rounded" onChange={e => setFormData({...formData, price: e.target.value})} value={formData.price} required />
              <input placeholder="Stock" type="number" className="border p-2 rounded" onChange={e => setFormData({...formData, stock: e.target.value})} value={formData.stock} required />
              <input placeholder="Image URL" className="border p-2 rounded" onChange={e => setFormData({...formData, image_url: e.target.value})} value={formData.image_url} />
              <select className="border p-2 rounded" onChange={e => setFormData({...formData, category: e.target.value})} value={formData.category}>
                 <option>Electronics</option><option>Fashion</option><option>Home</option>
              </select>
              <textarea placeholder="Desc" className="border p-2 rounded" onChange={e => setFormData({...formData, description: e.target.value})} value={formData.description} />
              <button className="bg-green-600 text-white py-2 rounded">Add Product</button>
            </form>
          </div>

          {/* List */}
          <div className="col-span-2 grid gap-4">
             {products.map(p => (
               <div key={p.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                 <div className="flex gap-4 items-center">
                    <img src={p.image_url} alt="" className="w-12 h-12 object-cover rounded"/>
                    <div>
                      <h4 className="font-bold">{p.name}</h4>
                      <p className="text-sm text-gray-500">₹{p.price} • Stock: {p.stock}</p>
                    </div>
                 </div>
                 <button onClick={() => handleDelete(p.id)} className="text-red-500 text-sm border border-red-200 px-3 py-1 rounded hover:bg-red-50">Delete</button>
               </div>
             ))}
          </div>
        </div>
      )}

      {/* --- SALES HISTORY TAB --- */}
      {tab === "sales" && (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
               <tr>
                 <th className="p-4">Date</th>
                 <th className="p-4">Product</th>
                 <th className="p-4">Seller</th>
                 <th className="p-4">Buyer</th>
                 <th className="p-4">Qty</th>
                 <th className="p-4">Price</th>
               </tr>
            </thead>
            <tbody>
              {sales.map(s => (
                <tr key={s.id} className="border-b">
                   <td className="p-4 text-sm">{new Date(s.created_at).toLocaleDateString()}</td>
                   <td className="p-4 flex items-center gap-2">
                     <img src={s.image_url} className="w-8 h-8 rounded"/> {s.product_name}
                   </td>
                   <td className="p-4 text-blue-600 font-medium">{s.seller_name}</td>
                   <td className="p-4 text-green-600 font-medium">{s.buyer_name}</td>
                   <td className="p-4">{s.quantity}</td>
                   <td className="p-4">₹{s.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;