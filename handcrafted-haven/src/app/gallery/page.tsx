"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import "./gallery.css";

type Product = {
  _id: string;
  name: string;
  price: number;
  category?: string;
  imageUrl?: string[];
  rating?: number;
};

export default function GalleryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get("search") || "";
  const categoryQuery = searchParams.get("category") || ""; // Optional category filter from URL needed for home page
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<string>("");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products);

          // apply category filter immediately on first load so the page would not "jump"
          if (categoryQuery) {
            setSelectedCategories([categoryQuery]); 
            const initialFiltered = data.products.filter( 
              (p: Product) => (p.category || "") === categoryQuery 
            );
            setFilteredProducts(initialFiltered); 
          } else {
            setFilteredProducts(data.products);
          }
        }
      })
      .catch((err) => console.error("Failed to load products:", err))
      .finally(() => setLoading(false));
  }, []);

  // Apply search when search query changes
  useEffect(() => {
    if (searchQuery) {
      applyFilters();
    }
  }, [searchQuery, products]);

    // auto-apply category filter when category query changes (needed for home page links to work)
  useEffect(() => {
    if (categoryQuery && products.length > 0) {
      setSelectedCategories([categoryQuery]);
      applyFilters();
    }
  }, [categoryQuery, products]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const applyFilters = () => {
    let filtered = products;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const categoryParam = searchParams.get("category") || "";
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query)
      );
    }

    // if URL has category and user hasn't selected any checkboxes yet, use URL category
    const activeCategories =
      selectedCategories.length > 0
        ? selectedCategories
        : categoryQuery
        ? [categoryQuery]
        : [];

    // Filter by category
    if (activeCategories.length > 0) {     //activeCategories instead of only selectedCategories
      filtered = filtered.filter((p) =>
        activeCategories.includes(p.category || "")
      );
    }

    // Filter by price
    filtered = filtered.filter((p) => p.price <= maxPrice);

    // Apply sorting
    filtered = applySorting(filtered, sortBy);
    setFilteredProducts(filtered);
  };

  const applySorting = (productsToSort: Product[], sortValue: string) => {
    const sorted = [...productsToSort];

    if (sortValue === "price-low") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortValue === "price-high") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortValue === "rating") {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return sorted;
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);
    
    // Apply sorting immediately with the new value
    const sorted = applySorting(filteredProducts, value);
    setFilteredProducts(sorted);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setMaxPrice(1000);
    setSortBy("");
    setFilteredProducts(products);
    
    // Clear search and categoryquery from URL if present
    if (searchQuery || categoryQuery) {
      router.push("/gallery");
    }
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

            <button className="btn btn--primary filters__apply" type="button" onClick={applyFilters}>
              Apply
            </button>
            
            <button className="btn btn--secondary filters__apply" type="button" onClick={resetFilters} style={{ marginTop: '10px' }}>
              Reset Filters
            </button>
          </aside>

          {/* RIGHT PANEL */}
          <section className="panel panel--results" aria-label="Gallery content">
            <div className="results__header">
              <div>
                <h1 className="results__title">Gallery</h1>
                {searchQuery && (
                  <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                    Search results for: "{searchQuery}"
                  </p>
                )}
              </div>

              <div className="select select--wide">
                <select aria-label="Sort dropdown" value={sortBy} onChange={handleSortChange}>
                  <option value="">Sort By</option>
                  <option value="price-low">Sort By Price: Low to High</option>
                  <option value="price-high">Sort By Price: High to Low</option>
                  <option value="rating">Sort By Rating</option>
                </select>
              </div>
            </div>

            <div className="products">
              {loading ? (
                <p>Loading products...</p>
              ) : filteredProducts.length === 0 ? (
                <p>{searchQuery ? `No products found for "${searchQuery}"` : "No products available."}</p>
              ) : (
                filteredProducts.map((product) => (
                  <Link 
                    key={product._id}
                    href={`/items/${product._id}`}
                    className="cardLink"
                  >
                    <ProductCard
                      name={product.name}
                      price={Number(product.price)}
                      imageSrc={product.imageUrl?.[0]}
                    />
                  </Link>
                ))
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
