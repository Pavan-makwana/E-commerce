import { useEffect, useState } from "react";
import API from "../api/api";

const AdminProducts = () => {
  const [tab, setTab] = useState("inventory"); 
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  
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
    } catch(err) { alert("Error adding product" ,err); }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Product & Sales Center</h2>
      
      {/* Tabs */}
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        <button onClick={() => setTab("inventory")} className={`px-4 py-2 rounded whitespace-nowrap transition ${tab==="inventory" ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-600 border border-gray-200"}`}>Manage Inventory</button>
        <button onClick={() => setTab("sales")} className={`px-4 py-2 rounded whitespace-nowrap transition ${tab==="sales" ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-600 border border-gray-200"}`}>Sales History</button>
      </div>

      {/*  INVENTORY TAB */}
      {tab === "inventory" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
            <h3 className="font-bold mb-4 text-gray-800">Add New Product</h3>
            <form onSubmit={handleAdd} className="flex flex-col gap-3">
              <input placeholder="Name" className="border p-2 rounded focus:ring-2 focus:ring-blue-100 outline-none" onChange={e => setFormData({...formData, name: e.target.value})} value={formData.name} required />
              <div className="flex gap-2">
                  <input placeholder="Price" type="number" className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-100 outline-none" onChange={e => setFormData({...formData, price: e.target.value})} value={formData.price} required />
                  <input placeholder="Stock" type="number" className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-100 outline-none" onChange={e => setFormData({...formData, stock: e.target.value})} value={formData.stock} required />
              </div>
              <input placeholder="Image URL" className="border p-2 rounded focus:ring-2 focus:ring-blue-100 outline-none" onChange={e => setFormData({...formData, image_url: e.target.value})} value={formData.image_url} />
              <select className="border p-2 rounded bg-white focus:ring-2 focus:ring-blue-100 outline-none" onChange={e => setFormData({...formData, category: e.target.value})} value={formData.category}>
                 <option>Electronics</option><option>Fashion</option><option>Home</option>
              </select>
              <textarea placeholder="Description" rows="3" className="border p-2 rounded focus:ring-2 focus:ring-blue-100 outline-none resize-none" onChange={e => setFormData({...formData, description: e.target.value})} value={formData.description} />
              <button className="bg-green-600 text-white py-2.5 rounded font-medium hover:bg-green-700 transition">Add Product</button>
            </form>
          </div>

          {/* List */}
          <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
             {products.map(p => (
               <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
                 <div className="flex gap-4 items-start mb-4">
                    <img src={p.image_url} alt="" className="w-16 h-16 object-cover rounded-lg bg-gray-100"/>
                    <div>
                      <h4 className="font-bold text-gray-800 line-clamp-1">{p.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">₹{p.price}</p>
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 mt-2 inline-block">Stock: {p.stock}</span>
                    </div>
                 </div>
                 <button onClick={() => handleDelete(p.id)} className="w-full text-red-500 text-sm border border-red-200 px-3 py-1.5 rounded hover:bg-red-50 transition">Delete Product</button>
               </div>
             ))}
          </div>
        </div>
      )}

      {/* SALES HISTORY TAB  */}
      {tab === "sales" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-gray-100 text-gray-700">
                <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Product</th>
                    <th className="p-4">Seller</th>
                    <th className="p-4">Buyer</th>
                    <th className="p-4">Qty</th>
                    <th className="p-4">Price</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {sales.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50">
                        <td className="p-4 text-sm text-gray-500">{new Date(s.created_at).toLocaleDateString()}</td>
                        <td className="p-4 flex items-center gap-2 font-medium text-gray-800">
                            <img src={s.image_url} className="w-8 h-8 rounded object-cover bg-gray-100"/> {s.product_name}
                        </td>
                        <td className="p-4 text-blue-600 font-medium">{s.seller_name}</td>
                        <td className="p-4 text-green-600 font-medium">{s.buyer_name}</td>
                        <td className="p-4 text-gray-600">{s.quantity}</td>
                        <td className="p-4 font-bold text-gray-800">₹{s.price}</td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;