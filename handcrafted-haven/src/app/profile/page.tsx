"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import "./profile.css";

interface Profile {
  _id: string;
  userId: string;
  name: string;
  email: string;
  location: string;
  bio: string;
  createdAt: string;
}

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

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token) {
          router.push("/login");
          return;
        }

        if (userData) {
          const user = JSON.parse(userData);
          setIsSeller(user.seller === true);
          
          if (!user.seller) {
            setError("You must be a seller to view this page");
            setLoading(false);
            return;
          }
        }

        const response = await fetch("/api/profile", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch profile");
        }

        setProfile(data.profile);
        setProducts(data.products || []);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <main className="page">
        <Header />
        <section className="profile">
          <div className="container">
            <div className="profile__panel">
              <p>Loading profile...</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <Header />
        <section className="profile">
          <div className="container">
            <div className="profile__panel">
              <p style={{ color: "#c33" }}>{error}</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="page">
        <Header />
        <section className="profile">
          <div className="container">
            <div className="profile__panel">
              <p>Profile not found</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <Header />
      <section className="profile">
        <div className="container">
          <div className="profile__panel">
            {/* Seller info */}
            <div className="seller">
              <div className="seller__left">
                <div className="seller__avatar" aria-label="Seller avatar" />
                {isSeller && (
                  <a className="btn btn--primary seller__btn" href="/profile/edit">
                    Edit Profile
                  </a>
                )}
              </div>

              <div className="seller__right">
                <h1 className="seller__name">{profile.name}</h1>
                <p className="seller__location">
                  {profile.email}
                </p>
                <p className="seller__location">
                  {profile.location || "No location set"}
                </p>

                <div className="seller__bio">
                  {profile.bio ? (
                    profile.bio.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))
                  ) : (
                    <p>No bio added yet</p>
                  )}
                </div>
              </div>
            </div>

            <div className="profile__divider" />

            {/* Works */}
            <h2 className="works__title">My works</h2>

            {products.length === 0 ? (
              <p style={{ textAlign: "center", color: "#666", margin: "20px 0" }}>
                No products yet. Add your first product to get started!
              </p>
            ) : (
              <div className="works__grid" aria-label="Seller works">
                {products.map((product) => (
                  <article className="work" key={product._id}>
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="work__img"
                        style={{ objectFit: "cover", width: "100%", height: "100%" }}
                      />
                    ) : (
                      <div className="work__img" aria-label="Product image placeholder" />
                    )}
                    <div className="work__meta">
                      <div className="work__name">{product.name}</div>
                      <div className="work__price">$ {product.price.toFixed(2)}</div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {isSeller && (
              <div style={{ marginTop: "30px", textAlign: "center" }}>
                <a href="/products/add" className="btn btn--primary">
                  Add New Product
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

