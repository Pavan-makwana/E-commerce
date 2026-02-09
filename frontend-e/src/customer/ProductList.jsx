import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import API from "../api/api"; 

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchTerm = searchParams.get("search") || "";

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data.data || []); 
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (p) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first to add items to cart!");
      navigate("/login");
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const found = cart.find((i) => i.id === p.id);

    if (found) {
      found.qty++;
    } else {
      cart.push({ ...p, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${p.name} added to cart! 🛒`);
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          {searchTerm ? `Results for "${searchTerm}"` : "Featured Products"}
        </h2>
        <span className="text-sm font-medium bg-white px-3 py-1 rounded-full border border-gray-200 text-gray-600 shadow-sm">
            {filteredProducts.length} Items
        </span>
      </div>

      {/* Grid Layout */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div 
              key={p.id} 
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full group"
            >
              
              {/* Image Section */}
              <div className="h-52 p-6 bg-white flex items-center justify-center relative overflow-hidden">
                <img 
                  src={p.image_url || "https://placehold.co/400?text=No+Image"} 
                  alt={p.name} 
                  className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { e.target.src = "https://placehold.co/400?text=Error"; }} 
                />
                {p.stock === 0 && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                    <span className="bg-red-500 text-white px-3 py-1 text-sm font-bold rounded-full shadow-lg">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-5 flex flex-col flex-1 bg-white">
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-2">{p.category}</p>
                <h3 className="font-bold text-gray-900 text-lg mb-1 leading-tight line-clamp-2" title={p.name}>{p.name}</h3>
                
                {/* Price & Action */}
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-xl font-extrabold text-gray-900">₹{p.price.toLocaleString()}</span>
                  
                  <button
                    onClick={() => addToCart(p)}
                    disabled={p.stock === 0}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all transform active:scale-95 ${
                      p.stock > 0 
                        ? "bg-yellow-400 hover:bg-yellow-500 text-black shadow-md hover:shadow-lg" 
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {p.stock > 0 ? "Add to Cart" : "Sold Out"}
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <Search className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 text-lg font-medium">No products found matching your search.</p>
          <button 
            onClick={() => navigate("/")}
            className="mt-4 text-blue-600 font-bold hover:underline"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;