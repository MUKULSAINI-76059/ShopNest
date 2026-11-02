import React, { useEffect } from "react";
import {BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom"
import Home from "./pages/Home";
import About from "./pages/About"
import Disclaimer from "./pages/Disclaimer"
import ReturnPolicy from "./pages/ReturnPolicy"
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Assistant from "./components/assistant";
import Shop from "./pages/Shop";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import EditProduct from "./admin/EditProduct"
import AdminUsers from "./admin/AdminUsers"
import AdminProducts from "./admin/AdminProducts"
import AdminDashboard from "./admin/AdminDashboard"
import AddProduct from "./admin/AddProduct"
import AdminOrders from "./admin/AdminOrders"

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<AdminDashboard/>} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/edit-product/:id" element={<EditProduct />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/returnPolicy" element={<ReturnPolicy />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />        
        <Route path="/profile" element={<Profile />} />        
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/ordersuccess" element={<OrderSuccess/>} />
      </Routes>
      <Footer />
      <Assistant />
    </Router>
  );
}

export default App;
