import { useEffect, useState } from "react";
import API from "../api/api"; // Adjust path if needed

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", category: "Electronics", stock: "", image_url: ""
  });

  // 1. Fetch Logic (Moved User decoding inside to prevent crashes)
  const fetchMyProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Decode token payload safely
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;

      const res = await API.get("/products");
      // Filter products belonging to this seller
      const myProducts = (res.data.data || []).filter(p => p.seller_id === userId);
      setProducts(myProducts);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };
  
  useEffect(() => {
    fetchMyProducts();
  }, []);

  // 2. Add Product Logic
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await API.post("/products", formData);
      alert("Product Added Successfully! ");
      
      // Reset Form & Refresh List
      setShowForm(false);
      setFormData({ name: "", description: "", price: "", category: "Electronics", stock: "", image_url: "" });
      fetchMyProducts(); 
    } catch (err) {
      alert("Error adding product: " + (err.response?.data?.message || err.message));
    }
  };

  // 3. Update Stock Logic
  const updateStock = async (id, newStock) => {
    try {
      await API.put(`/products/${id}`, { stock: newStock });
      // Optional: alert("Stock Updated!"); 
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  // 4. Delete Product Logic (New)
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await API.delete(`/products/${id}`);
      alert("Product Deleted 🗑️");
      fetchMyProducts(); // Refresh list
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Inventory</h1>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          {showForm ? "Close Form" : "+ Add New Product"}
        </button>
      </div>

      {/* ADD PRODUCT FORM */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-blue-100">
          <h3 className="font-bold mb-4">Add New Product</h3>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              placeholder="Product Name" 
              className="border p-2 rounded" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})} 
              required 
            />
            <input 
              placeholder="Price (₹)" 
              type="number" 
              className="border p-2 rounded" 
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})} 
              required 
            />
            <select 
              className="border p-2 rounded" 
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
              className="border p-2 rounded" 
              value={formData.stock}
              onChange={e => setFormData({...formData, stock: e.target.value})} 
              required 
            />
            <input 
              placeholder="Image URL" 
              className="border p-2 rounded col-span-2" 
              value={formData.image_url}
              onChange={e => setFormData({...formData, image_url: e.target.value})} 
            />
            <textarea 
              placeholder="Description" 
              className="border p-2 rounded col-span-2" 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
            <button type="submit" className="bg-green-600 text-white py-2 rounded col-span-2 font-bold hover:bg-green-700">
              Save Product
            </button>
          </form>
        </div>
      )}

      {/* PRODUCT LIST */}
      <div className="grid gap-4">
        {products.length > 0 ? (
          products.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded shadow flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src={p.image_url || "https://via.placeholder.com/50"} 
                  alt={p.name} 
                  className="w-16 h-16 object-cover rounded bg-gray-100"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/50?text=No+Img"; }}
                />
                <div>
                  <h3 className="font-bold text-gray-800">{p.name}</h3>
                  <p className="text-sm text-gray-500">₹{p.price} | {p.category}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <label className="text-xs font-semibold text-gray-500 mb-1">Stock</label>
                  <input 
                    type="number" 
                    defaultValue={p.stock} 
                    onBlur={(e) => updateStock(p.id, e.target.value)}
                    className="w-16 border border-gray-300 p-1 rounded text-center focus:border-blue-500 outline-none"
                  />
                </div>
                <button 
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-50 text-red-500 px-3 py-1 rounded hover:bg-red-100 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-10">No products added yet. Start selling!</p>
        )}
      </div>
    </div>
  );
};

export default SellerProducts;