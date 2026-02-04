"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import "./gallery.css";

interface Product {
  _id: string;
  sellerId: string;
  sellerName: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  createdAt: string;
}

export default function GalleryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch products");
        }

        setProducts(data.products);
        setFilteredProducts(data.products);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const applyFilters = () => {
    let filtered = [...products];

    console.log('Applying filters:', { selectedCategories, maxPrice });
    console.log('Total products:', products.length);
    console.log('All product categories:', products.map(p => p.category));

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) => {
        const productCategory = product.category.toLowerCase().trim();
        const matches = selectedCategories.some((cat) => {
          const filterCategory = cat.toLowerCase().trim();
          // Check if product category contains filter category OR filter category contains product category
          return productCategory.includes(filterCategory) || filterCategory.includes(productCategory);
        });
        console.log(`Product "${product.name}" category "${product.category}" matches:`, matches);
        return matches;
      });
      console.log('After category filter:', filtered.length);
    }

    // Filter by price
    filtered = filtered.filter((product) => product.price <= maxPrice);
    console.log('After price filter:', filtered.length);
// Apply sorting
    applySorting(filtered);
  };

  const applySorting = (productsToSort: Product[]) => {
    let sorted = [...productsToSort];

    switch (sortBy) {
      case "newest":
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "price-low":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "price-high":
        sorted.sort((a, b) => a.price - b.price);
        break;
    }

    setFilteredProducts(sorted);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    setSortBy(newSort);
    applySorting(filteredProducts);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setMaxPrice(1000);
    setSortBy("newest");
    setFilteredProducts(products);
  };

  return (
    <main className="page">
      <Header />
      <section className="gallery">
        <div className="container gallery__layout">
          {/* LEFT PANEL */}
          <aside className="panel panel--filters" aria-label="Filters">
            <h2 className="panel__title">Filters</h2>
            <div className="panel__line" />

            <h3 className="panel__subtitle">Category</h3>

            <label className="check">
              <input
                type="checkbox"
                checked={selectedCategories.includes("Home Decor")}
                onChange={() => handleCategoryChange("Home Decor")}
              />
              <span>Home Decor</span>
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={selectedCategories.includes("Jewelry")}
                onChange={() => handleCategoryChange("Jewelry")}
              />
              <span>Jewelry</span>
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={selectedCategories.includes("Ceramics")}
                onChange={() => handleCategoryChange("Ceramics")}
              />
              <span>Ceramics</span>
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={selectedCategories.includes("Textiles")}
                onChange={() => handleCategoryChange("Textiles")}
              />
              <span>Textiles</span>
            </label>

            <div className="panel__line panel__line--spaced" />

            <h3 className="panel__subtitle">Price</h3>

            <div className="price__labels">
              <span>$10</span>
              <span>${maxPrice}</span>
            </div>

            <input
              className="price__range"
              type="range"
              min={10}
              max={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />

            <button
              className="btn btn--primary filters__apply"
              type="button"
              onClick={applyFilters}
            >
              Apply
            </button>

            <button
              className="btn filters__apply"
              type="button"
              onClick={resetFilters}
              style={{
                marginTop: "10px",
                background: "#fff",
                color: "#333",
                border: "1px solid #ddd"
              }}
            >
              Reset Filters
            </button>
          </aside>

          {/* RIGHT PANEL */}
          <section className="panel panel--results" aria-label="Gallery content">
            <div className="results__header">
              <div>
                <h1 className="results__title">Gallery</h1>
              </div>

              <div className="select select--wide">
                <select aria-label="Sort dropdown" value={sortBy} onChange={handleSortChange}>
                  <option value="newest">Sort By Newest</option>
                  <option value="price-low">Sort By Price: Low to High</option>
                  <option value="price-high">Sort By Price: High to Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div style={{ padding: "40px", textAlign: "center" }}>
                Loading products...
              </div>
            ) : error ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#c33" }}>
                {error}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                {products.length === 0 ? "No products available yet." : "No products match your filters."}
              </div>
            ) : (
              <div className="products">
                {filteredProducts.map((product) => (
                  <article className="product" key={product._id}>
                    <div className="product__img">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: "#f0f0f0" }} />
                      )}
                      <button className="product__heart" type="button" aria-label="Favorite">
                        ♡
                      </button>
                    </div>

                    <div className="product__meta">
                      <div className="product__name">{product.name}</div>
                      <div className="product__price">$ {product.price.toFixed(2)}</div>
                      <div className="product__store">{product.sellerName}</div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
