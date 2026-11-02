import React from "react";
import { Link } from "react-router-dom";
import "../style/footer.css";

const Footer = () => {

  return (
    <footer className="shop-footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
            <img src="/ShopNestLogo.png" className="footer-logo" ></img>
            Shop<span>Nest</span></Link>
            <p className="footer-description">
             Quality products, great value, effortless shopping
            </p>
          </div>

          <div className="footer-links-group">
            <h4>Explore</h4>
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/shop">Shop Products</Link>
          </div>

          <div className="footer-links-group">
            <h4>Customer Care</h4>
            <Link to="/returnPolicy">Return Policy</Link>
            <Link to="/disclaimer">Disclaimer</Link>
            <a href="mailto:admin76059@gmail.com">Contact Support</a>
          </div>

          <div className="footer-links-group footer-social-column">
            <h4>Follow Us</h4>
            <a href="https://www.instagram.com/mukulsaini202/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://github.com/MukulSaini-76059" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/mukul-saini-603346321/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>

        

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ShopNest. All rights reserved.</p>
          <p className="footer-made-with">Made with <span>&hearts;</span> for shoppers</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
