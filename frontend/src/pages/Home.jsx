import React, { useEffect } from "react";
import { useState } from "react";
import ProductCard from "../components/productCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/product`);
        if (!res.ok) {
          throw new Error(`Failed to load products: ${res.status}`);
        }
        const data = await res.json();
        setProducts(Array.isArray(data.products) ? data.products.slice(0, ) : []);
      } catch (err) {
        console.error(err.message);
        setError("Products are currently unavailable. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [apiUrl]);
  return (
    <div className="home-container">
      <div className="hero-banner">
        <h1>Welcome to ShopNest</h1>
        <p>Discover the best products as unbeatable prices.</p>
      </div>
      <h2>Featured Products</h2>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="loading">{error}</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
