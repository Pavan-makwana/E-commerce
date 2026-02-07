import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api/api"; 

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get search term from URL (e.g., ?search=laptop)
  const searchTerm = searchParams.get("search") || "";

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await API.get("/products");
      // If your API returns { success: true, data: [...] }
      setProducts(res.data.data || []); 
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  // Filter products based on search term (Client-side filtering)
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
      // Ensure we save the image and price for the cart display too
      cart.push({ ...p, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Optional: distinct visual feedback
    alert(`${p.name} added to cart! 🛒`);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {searchTerm ? `Results for "${searchTerm}"` : "Featured Products"}
        </h2>
        <span className="text-gray-500">{filteredProducts.length} Items</span>
      </div>

      {/* Grid Layout */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div 
              key={p.id} 
              className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col"
            >
              
              {/* Image Section */}
              <div className="h-48 p-4 bg-gray-50 flex items-center justify-center relative group">
                <img 
                  src={p.image_url || "https://placehold.co/400?text=No+Image"} 
                  alt={p.name} 
                  className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => { e.target.src = "https://placehold.co/400?text=Error"; }} // Fallback if link is broken
                />
                {p.stock === 0 && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-3 py-1 text-sm font-bold rounded">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-4 flex flex-col flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{p.category}</p>
                <h3 className="font-bold text-gray-800 text-lg truncate mb-1" title={p.name}>{p.name}</h3>
                
                {/* Price & Action */}
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xl font-extrabold text-gray-900">₹{p.price}</span>
                  
                  <button
                    onClick={() => addToCart(p)}
                    disabled={p.stock === 0}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      p.stock > 0 
                        ? "bg-yellow-400 hover:bg-yellow-500 text-black shadow-sm" 
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
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
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl">No products found matching your search.</p>
          <button 
            onClick={() => navigate("/")}
            className="mt-4 text-blue-600 font-semibold hover:underline"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;