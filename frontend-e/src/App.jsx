import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth
import Login from "./auth/Login";
import Register from "./auth/Register";

// Customer Pages
import ProductList from "./customer/ProductList";
import Cart from "./customer/Cart";
import Checkout from "./customer/Checkout";
import MyReturns from "./customer/MyReturns";

// Seller Pages
import SellerOrders from "./seller/SellerOrders";
import SellerProducts from "./seller/SellerProducts";
import SellerReturns from "./seller/SellerReturns";

// Admin Pages
import AdminDashboard from "./admin/AdminDashboard";
import ManageUsers from "./admin/ManageUsers";        // <--- NEW IMPORT
import GlobalAnalytics from "./admin/GlobalAnalytics"; // <--- NEW IMPORT

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-1 container mx-auto px-4 py-6">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<ProductList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Customer Routes */}
            <Route path="/cart" element={
                <ProtectedRoute role="customer">
                  <Cart />
                </ProtectedRoute>
              } 
            />
            <Route path="/checkout" element={
                <ProtectedRoute role="customer">
                  <Checkout />
                </ProtectedRoute>
              } 
            />
            <Route path="/returns" element={
                <ProtectedRoute role="customer">
                  <MyReturns />
                </ProtectedRoute>
              } 
            />

            {/* Seller Routes */}
            <Route path="/seller/orders" element={
                <ProtectedRoute role="seller">
                  <SellerOrders />
                </ProtectedRoute>
              } 
            />
            <Route path="/seller/products" element={
                <ProtectedRoute role="seller">
                  <SellerProducts />
                </ProtectedRoute>
              } 
            />
            <Route path="/seller/returns" element={
                <ProtectedRoute role="seller">
                  <SellerReturns />
                </ProtectedRoute>
              } 
            />

            {/* --- ADMIN ROUTES (Fixed) --- */}
            <Route path="/admin" element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* This was missing! */}
            <Route path="/admin/users" element={
                <ProtectedRoute role="admin">
                  <ManageUsers />
                </ProtectedRoute>
              } 
            />
            
            {/* This was missing! */}
            <Route path="/admin/analytics" element={
                <ProtectedRoute role="admin">
                  <GlobalAnalytics />
                </ProtectedRoute>
              } 
            />

          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;