"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import "../../login/login.css";

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in and is a seller
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (userData) {
      const user = JSON.parse(userData);
      if (!user.seller) {
        router.push("/");
        return;
      }
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate price
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid price");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: price,
          category: formData.category,
          imageUrl: formData.imageUrl || "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add product");
      }

      // Redirect to profile page
      router.push("/profile");
    } catch (err: any) {
      setError(err.message || "An error occurred while adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <Header />

      <section className="login-section">
        <div className="container">
          <div className="login-wrapper">
            <div className="login-card">
              <h1 className="login-title">Add New Product</h1>
              <p className="login-subtitle">Share your handcrafted creation</p>

              {error && (
                <div
                  style={{
                    background: "#fee",
                    color: "#c33",
                    padding: "12px",
                    borderRadius: "6px",
                    marginBottom: "20px",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </div>
              )}

              <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    placeholder="Handmade Ceramic Vase"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-input"
                    placeholder="Describe your product..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    required
                    style={{ resize: "vertical" }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price" className="form-label">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    className="form-input"
                    placeholder="25.00"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="form-input"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Pottery">Pottery</option>
                    <option value="Jewelry">Jewelry</option>
                    <option value="Textile">Textile</option>
                    <option value="Ceramic">Ceramic</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="imageUrl" className="form-label">
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    className="form-input"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn--primary btn--full"
                  disabled={loading}
                >
                  {loading ? "Adding Product..." : "Add Product"}
                </button>

                <button
                  type="button"
                  className="btn btn--full"
                  onClick={() => router.push("/profile")}
                  disabled={loading}
                  style={{
                    marginTop: "12px",
                    background: "#fff",
                    color: "#333",
                    border: "1px solid #ddd",
                  }}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
