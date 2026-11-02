import React, { useEffect } from "react";
import { useState } from "react";
import ProductCard from "../components/productCard";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const categories = [...new Set(
    products
      .map((product) => product.category?.trim())
      .filter(Boolean)
  )].sort((first, second) => first.localeCompare(second));

  const filteredProducts = products.filter((product) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [product.name, product.category, product.description]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
    const matchesCategory =
      !selectedCategory || product.category?.trim() === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
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
  }, []);
  return (
    <div className="home-container shop-container" style={{ marginTop: "31px" }}>
      <div className="search-bar-wrapper">
        <input
          className="search-bar"
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search products"
        />
      </div>
      <div className="category-filter">
        <label htmlFor="shop-category-filter">Browse by category</label>
        <select
          id="shop-category-filter"
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
          aria-label="Filter products by category"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="product-grid" aria-label="Loading products">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="product-skeleton" key={index}>
              <div className="skeleton-image shimmer" />
              <div className="skeleton-content">
                <div className="skeleton-line shimmer" />
                <div className="skeleton-line short shimmer" />
                <div className="skeleton-bottom">
                  <div className="skeleton-price shimmer" />
                  <div className="skeleton-button shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="home-state error-state" role="alert">
          <h3>Unable to load products</h3>
          <p>{error}</p>
        </div>
      ) : (
        filteredProducts.length === 0 ? (
          <div className="home-state empty-state search-empty-state">
            <div className="state-icon empty-icon" aria-hidden="true">⌕</div>
            <span className="state-label">NO RESULTS</span>
            <h3>No products found</h3>
            <p>We couldn't find products matching your search and category filters.</p>
            <button
              type="button"
              className="state-button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("");
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Shop;
