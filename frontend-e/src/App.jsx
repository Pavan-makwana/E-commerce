import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./auth/Login";

import ProductList from "./customer/ProductList";
import Cart from "./customer/Cart";
import Checkout from "./customer/Checkout";
import MyReturns from "./customer/MyReturns";
import Register from "./auth/Register";


function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<ProductList />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute role="customer">
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute role="customer">
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/returns"
          element={
            <ProtectedRoute role="customer">
              <MyReturns />
            </ProtectedRoute>
          }
        />

      </Routes>

      <Footer />

    </BrowserRouter>
  );
}

export default App;
