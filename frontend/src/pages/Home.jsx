
import React, { useEffect, useState } from "react";
import ProductCard from "../components/productCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
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
    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/products/", {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Failed to load products: ${res.status}`);
        }

        const data = await res.json();

        setProducts(
          Array.isArray(data.products) ? data.products : []
        );
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error(err.message);
        setError(
          "Products are currently unavailable. Please try again later."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [retry]);

  const handleRetry = () => {
    setRetry((previous) => previous + 1);
  };

  return (
    <div className="home-container">
      {/* Hero Banner - Original design */}
      <div className="hero-banner">
        <h1>Welcome to ShopNest</h1>
        <p>Discover the best products at unbeatable prices.</p>
      </div>

      <h2 className="featured">Featured Products</h2>
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
        <label htmlFor="home-category-filter">Browse by category</label>
        <select
          id="home-category-filter"
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

      {/* Loading UI */}
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
        /* Error UI */
        <div className="home-state error-state" role="alert">
          <div className="state-icon error-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </div>


          <h3>Oops! Something went wrong.</h3>

          <p>{error}</p>

          <button
            type="button"
            className="state-button"
            onClick={handleRetry}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 7v5h-5" />
              <path d="M4 17v-5h5" />
              <path d="M5.6 9A7 7 0 0 1 18 6l2 6" />
              <path d="M18.4 15A7 7 0 0 1 6 18l-2-6" />
            </svg>
            Try Again
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        /* Empty Products UI */
        <div className={`home-state empty-state ${
          search.trim() || selectedCategory ? "search-empty-state" : ""
        }`}>
          <div className="state-icon empty-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 3h2l2.4 11.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6" />
              <circle cx="10" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
          </div>

          <span className="state-label">
            {search.trim() || selectedCategory ? "NO RESULTS" : "COMING SOON"}
          </span>

          <h3>{products.length === 0 ? "No products available yet." : "No matching products found."}</h3>

          <p>
            {products.length === 0
              ? "We're getting things ready. Please check back soon to discover something you'll love."
              : "Try a different product name or category."}
          </p>

          <button
            type="button"
            className="state-button"
            onClick={() => {
              if (search.trim() || selectedCategory) {
                setSearch("");
                setSelectedCategory("");
              } else {
                handleRetry();
              }
            }}
          >
            {search.trim() || selectedCategory ? "Clear Filters" : "Refresh Products"}
          </button>
        </div>
      ) : (
        /* Products UI - Original ProductCard */
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
