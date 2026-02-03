"use client";

import Header from "@/components/Header";
import "./profile.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

type User = {
  _id: string;
  name: string;
  email: string;
  seller: boolean;
  country: string;
  bio: string;
};

export default function ProfilePage() {
  const router = useRouter();

  // Auth / user state
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // For seller: load products
  const [products, setProducts] = useState<any[]>([]);
  const [loadingWorks, setLoadingWorks] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // User is not loged in -> go to login page
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/auth/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        // Invalid token -> go to login
        if (!data.success) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login");
          return;
        }

        // Valid token -> show profile
        setUser(data.user);
        setLoading(false);
      })
      // On other error -> go to login
      .catch(() => router.push("/login"));
  }, [router]);

  useEffect(() => {
    if (!user) return;

    // Only sellers have works, so don’t load products for buyers
    if (!user.seller) {
      setLoadingWorks(false);
      return;
    }

    const seller = user._id;

    fetch(`/api/products/by-seller?sellerId=${encodeURIComponent(seller)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProducts(data.products);
        setLoadingWorks(false);
      })
      .catch(() => setLoadingWorks(false));
  }, [user]);

  // Show loading state So there won't be a user=null page flash
  if (loading) {
    return (
      <main className="page">
        <Header />
        <p className="profile__notice">Loading profile...</p>
      </main>
    );
  }

  if (!user) return null;

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
                <a className="btn btn--primary seller__btn" href="/profile">
                  Edit profile?
                </a>
              </div> 

              <div className="seller__right">
                <h1 className="seller__name">{user.name}</h1>
                <p className="seller__location">{user.country}</p>

                <div className="seller__bio">
                  <p>{user.bio || "No bio available."}</p>
                </div>
              </div>
            </div>

            <div className="profile__divider" />

            {/* Works. Only in the user is a seller */}
            {user.seller ? (
              <>
                <h2 className="works__title">My works</h2>

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
                        className="cardLink">
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
