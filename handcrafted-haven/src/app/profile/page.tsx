"use client";

import Header from "@/components/Header";
import "./profile.css";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import useSellerProducts from "@/hooks/useSellerProducts";
import useAuthUser from "@/hooks/useAuth";

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
  // Load auth user
  const { user, loadingUser } = useAuthUser({ redirectToLogin: true });

  // Load seller products
  const { products, loadingWorks } = useSellerProducts(user?.seller ? user._id : "");


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

  return (
    <main className="page">
      <Header />
      <section className="profile">
        <div className="container">
          <div className="profile__panel">
            {/* Seller info */}
            <div className="seller">
              <div className="seller__left">
                <img
                  className="seller__avatar"
                  src={user.avatar || "/users/default-avatar.png"}
                  alt={`${user.name} avatar`}
                />
                {user.seller && (
                  <a className="btn btn--primary seller__btn" href="/profile/edit">
                    Edit Profile
                  </a>
                )}
              </div> 

              <div className="seller__right">
                <h1 className="seller__name">{user.name}</h1>
                <p className="seller__location">{user.email}</p>
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

                <div style={{ marginTop: "30px", textAlign: "center" }}>
                  <a href="/products/add" className="btn btn--primary">
                    Add New Product
                  </a>
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
