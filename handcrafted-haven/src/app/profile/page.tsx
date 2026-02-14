"use client";

import Header from "@/components/Header";
import "./profile.css";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import useSellerProducts from "@/hooks/useSellerProducts";
import useAuthUser from "@/hooks/useAuth";
import { useState, FormEvent } from "react";
import Image from "next/image";


export default function ProfilePage() {
  // Load auth user
  const { user, loadingUser } = useAuthUser({ redirectToLogin: true });

  // Load seller products
  const { products, loadingWorks, refetchProducts } = useSellerProducts(user?.seller ? user._id : "");

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    bio: "",
    country: "",
    avatar: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  // Add product mode state
  const [isAddProductMode, setIsAddProductMode] = useState(false);
  const [productFormData, setProductFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: "1",
    imageUrl: "",
  });
  const [productLoading, setProductLoading] = useState(false);
  const [productError, setProductError] = useState("");
  const [productSuccess, setProductSuccess] = useState("");

  // Show loading state So there won't be a user=null page flash
  if (loadingUser) {
    return (
      <main className="page">
        <Header />
        <p className="profile__notice">Loading profile...</p>
      </main>
    );
  }

  if (!user) return null;

  // Handle edit profile button click
  const handleEditClick = () => {
    setEditFormData({
      name: user.name || "",
      bio: user.bio || "",
      country: user.country || "",
      avatar: user.avatar || "",
    });
    setIsEditMode(true);
    setEditError("");
    setEditSuccess("");
  };

  // Handle save profile
  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    setEditSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      // Update local storage
      localStorage.setItem("user", JSON.stringify(data.user));
      setEditSuccess("Profile updated successfully!");
      setTimeout(() => {
        setIsEditMode(false);
        window.location.reload();
      }, 1500);
    } catch (err) {
      if (err instanceof Error) {
        setEditError(err.message);
      } else {
        setEditError("An error occurred");
      }
    } finally {
          setEditLoading(false);
        }
      };

  // Handle add product
  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    setProductLoading(true);
    setProductError("");
    setProductSuccess("");

    try {
      const token = localStorage.getItem("token");
      const imageUrls = productFormData.imageUrl
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...productFormData,
          imageUrl: imageUrls.length > 0 ? imageUrls : ["/products/default-product.png"],
          sellerId: user._id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      setProductSuccess("Product added successfully!");
      setProductFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        quantity: "1",
        imageUrl: "",
      });
      
      // Refresh products list
      refetchProducts();
      
      setTimeout(() => {
        setIsAddProductMode(false);
        setProductSuccess("");
      }, 1500);
    } catch (err) {
      if (err instanceof Error) {
        setProductError(err.message);
      } else {
        setProductError("An error occurred");
      }
    } finally {
          setProductLoading(false);
        }
      };

  return (
    <main className="page">
      <Header />
      <section className="profile">
        <div className="container">
          <div className="profile__panel">
            {/* Seller info */}
            <div className="seller">
              <div className="seller__left">
                <Image
                  className="seller__avatar"
                  src={user.avatar || "/users/default-avatar.png"}
                  alt={`${user.name} avatar`}
                  width={140}
                  height={140}
                  priority
                />
                <button
                  className="btn btn--primary seller__btn"
                  onClick={handleEditClick}
                  disabled={isEditMode}
                >
                  {isEditMode ? "Editing..." : "Edit profile"}
                </button>
              </div>

              <div className="seller__right">
                {isEditMode ? (
                  <form onSubmit={handleSaveProfile} className="edit-form">
                    <h2 className="edit-form__title">Edit Profile</h2>
                    {editError && (
                      <div className="form-message form-message--error">
                        {editError}
                      </div>
                    )}
                    {editSuccess && (
                      <div className="form-message form-message--success">
                        {editSuccess}
                      </div>
                    )}
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="form-input"
                        value={editFormData.name}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="country" className="form-label">
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        className="form-input"
                        value={editFormData.country}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, country: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="bio" className="form-label">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        className="form-input"
                        rows={4}
                        value={editFormData.bio}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, bio: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="avatar" className="form-label">
                        Avatar URL
                      </label>
                      <input
                        type="text"
                        id="avatar"
                        className="form-input"
                        value={editFormData.avatar}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, avatar: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-actions">
                      <button
                        type="submit"
                        className="btn btn--primary"
                        disabled={editLoading}
                      >
                        {editLoading ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        className="btn btn--secondary"
                        onClick={() => setIsEditMode(false)}
                        disabled={editLoading}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h1 className="seller__name">{user.name}</h1>
                    <p className="seller__location">{user.country}</p>

                    <div className="seller__bio">
                      <p>{user.bio || "No bio available."}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="profile__divider" />

            {/* Works. Only if the user is a seller */}
            {user.seller ? (
              <>
                <div className="works__header">
                  <h2 className="works__title">My works</h2>
                  <button
                    className="btn btn--primary"
                    onClick={() => setIsAddProductMode(!isAddProductMode)}
                  >
                    {isAddProductMode ? "Cancel" : "Add Product"}
                  </button>
                </div>

                {/* Add Product Form */}
                {isAddProductMode && (
                  <div className="add-product-form">
                    <h3 className="add-product-form__title">Add New Product</h3>
                    {productError && (
                      <div className="form-message form-message--error">
                        {productError}
                      </div>
                    )}
                    {productSuccess && (
                      <div className="form-message form-message--success">
                        {productSuccess}
                      </div>
                    )}
                    <form onSubmit={handleAddProduct}>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="productName" className="form-label">
                            Product Name *
                          </label>
                          <input
                            type="text"
                            id="productName"
                            className="form-input"
                            value={productFormData.name}
                            onChange={(e) =>
                              setProductFormData({
                                ...productFormData,
                                name: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="category" className="form-label">
                            Category *
                          </label>
                          <select
                            id="category"
                            className="form-input"
                            value={productFormData.category}
                            onChange={(e) =>
                              setProductFormData({
                                ...productFormData,
                                category: e.target.value,
                              })
                            }
                            required
                          >
                            <option value="">Select a category</option>
                            <option value="Ceramics">Ceramics</option>
                            <option value="Textiles">Textiles</option>
                            <option value="Home Decor">Home Decor</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="description" className="form-label">
                          Description *
                        </label>
                        <textarea
                          id="description"
                          className="form-input"
                          rows={3}
                          value={productFormData.description}
                          onChange={(e) =>
                            setProductFormData({
                              ...productFormData,
                              description: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="price" className="form-label">
                            Price ($) *
                          </label>
                          <input
                            type="number"
                            id="price"
                            className="form-input"
                            step="0.01"
                            min="0"
                            value={productFormData.price}
                            onChange={(e) =>
                              setProductFormData({
                                ...productFormData,
                                price: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="quantity" className="form-label">
                            Quantity
                          </label>
                          <input
                            type="number"
                            id="quantity"
                            className="form-input"
                            min="1"
                            value={productFormData.quantity}
                            onChange={(e) =>
                              setProductFormData({
                                ...productFormData,
                                quantity: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="imageUrl" className="form-label">
                          Image URLs (comma-separated)
                        </label>
                        <input
                          type="text"
                          id="imageUrl"
                          className="form-input"
                          placeholder="/products/image1.png, /products/image2.png"
                          value={productFormData.imageUrl}
                          onChange={(e) =>
                            setProductFormData({
                              ...productFormData,
                              imageUrl: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="form-actions">
                        <button
                          type="submit"
                          className="btn btn--primary"
                          disabled={productLoading}
                        >
                          {productLoading ? "Adding..." : "Add Product"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="works__grid" aria-label="Seller works">
                  {loadingWorks ? (
                    <p>Loading works...</p>
                  ) : products.length === 0 ? (
                    <p>No works yet.</p>
                  ) : (
                    products.map((p) => (
                      <Link
                        key={p._id}
                        href={`/items/${p._id}`}
                        className="cardLink"
                      >
                        <ProductCard
                          name={p.name}
                          price={Number(p.price)}
                          imageSrc={p.imageUrl?.[0]}
                        />
                      </Link>
                    ))
                  )}
                </div>
              </>
            ) : (
              <p className="profile__notice">
                This is a customer account. No works to display.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
