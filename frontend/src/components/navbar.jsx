import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../style/navbar.css";
import { useSelector } from "react-redux";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const Navbar = () => {
  const {user, logout} = useContext(AuthContext)
  const { showToast } = useToast();
  const cartItems = useSelector((state) => state.cart.cartItems)
  const navigate = useNavigate()
  const handleLogout = () =>{
    logout();
    showToast("Logged out successfully.");
    navigate("/login")
  }
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <img src="ShopNestLogo.png" alt="ShopNest Logo" className="navbar-logo" />
          Shop<span>Nest</span>
        </Link>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/shop">Shop</NavLink>
        </li>
        <li>
          <NavLink to="/cart">Cart<span>({cartItems.length})</span></NavLink>
        </li>
        {user ?(
        <>
        <li>
          <NavLink to="/profile">Hi, {user.name}</NavLink>
        </li>
        {user.role === "admin"  && <li><NavLink to="/admin">Admin</NavLink></li>}
        <li><button onClick={handleLogout} className="btn-logout">Logout</button></li>
        </>
        ):(
          <li><NavLink to="/login">Login</NavLink></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
