import { useEffect, useState } from "react";
import { Trash2, Plus, X } from "lucide-react";
import API from "../api/api"; 

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", category: "Electronics", stock: "", image_url: ""
  });

  const fetchMyProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;

      const res = await API.get("/products");
      const myProducts = (res.data.data || []).filter(p => p.seller_id === userId);
      setProducts(myProducts);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };
  
  useEffect(() => {
    fetchMyProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await API.post("/products", formData);
      alert("Product Added Successfully! ");
      setShowForm(false);
      setFormData({ name: "", description: "", price: "", category: "Electronics", stock: "", image_url: "" });
      fetchMyProducts(); 
    } catch (err) {
      alert("Error adding product: " + (err.response?.data?.message || err.message));
    }
  };

  const updateStock = async (id, newStock) => {
    try {
      await API.put(`/products/${id}`, { stock: newStock });
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await API.delete(`/products/${id}`);
      alert("Product Deleted ");
      fetchMyProducts();
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">My Inventory</h1>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          {showForm ? <><X size={18} /> Close Form</> : <><Plus size={18} /> Add New Product</>}
        </button>
      </div>

      {/* ADD PRODUCT FORM */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-blue-100">
          <h3 className="font-bold mb-4 text-lg">Add New Product</h3>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              placeholder="Product Name" 
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})} 
              required 
            />
            <input 
              placeholder="Price (₹)" 
              type="number" 
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" 
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})} 
              required 
            />
            <select 
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none bg-white" 
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Home</option>
              <option>Books</option>
            </select>
            <input 
              placeholder="Initial Stock" 
              type="number" 
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" 
              value={formData.stock}
              onChange={e => setFormData({...formData, stock: e.target.value})} 
              required 
            />
            <input 
              placeholder="Image URL" 
              className="border p-3 rounded-lg md:col-span-2 focus:ring-2 focus:ring-blue-100 outline-none" 
              value={formData.image_url}
              onChange={e => setFormData({...formData, image_url: e.target.value})} 
            />
            <textarea 
              placeholder="Description" 
              className="border p-3 rounded-lg md:col-span-2 focus:ring-2 focus:ring-blue-100 outline-none resize-none" 
              rows="3"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
            <button type="submit" className="bg-green-600 text-white py-3 rounded-lg md:col-span-2 font-bold hover:bg-green-700 transition">
              Save Product
            </button>
          </form>
        </div>
      )}

      {/* PRODUCT LIST */}
      <div className="grid gap-4">
        {products.length > 0 ? (
          products.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full">
                <img 
                  src={p.image_url || "https://via.placeholder.com/50"} 
                  alt={p.name} 
                  className="w-16 h-16 object-cover rounded-lg bg-gray-100 border border-gray-200"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/50?text=No+Img"; }}
                />
                <div>
                  <h3 className="font-bold text-gray-800 line-clamp-1">{p.name}</h3>
                  <p className="text-sm text-gray-500">₹{p.price} | {p.category}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex flex-col items-center">
                  <label className="text-[10px] uppercase font-bold text-gray-400 mb-1">Stock</label>
                  <input 
                    type="number" 
                    defaultValue={p.stock} 
                    onBlur={(e) => updateStock(p.id, e.target.value)}
                    className="w-16 border border-gray-300 p-1.5 rounded-lg text-center focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                <button 
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-100 transition"
                  title="Delete Product"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center py-20 bg-white rounded-xl border border-dashed">
            No products added yet. Start selling!
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProducts;