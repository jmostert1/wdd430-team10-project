"use client";

import Header from "@/components/Header";
import "@/app/profile/profile.css";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

type Seller = {
  _id: string;
  name: string;
  seller: boolean;
  country: string;
  bio: string;
};

export default function SellerPage() {
  const params = useParams();
  const sellerId = params.sellerId as string;

  const [seller, setSeller] = useState<Seller | null>(null);
  const [loadingSeller, setLoadingSeller] = useState(true);

  const [products, setProducts] = useState<any[]>([]);
  const [loadingWorks, setLoadingWorks] = useState(true);

  // Load seller info
  useEffect(() => {
    if (!sellerId) return;

    setLoadingSeller(true);

    fetch(`/api/users/${sellerId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setSeller(data.user);
        else setSeller(null);
      })
      .catch(() => setSeller(null))
      .finally(() => setLoadingSeller(false));
  }, [sellerId]);

  // Load seller products
  useEffect(() => {
    if (!sellerId) return;

    setLoadingWorks(true);

    fetch(`/api/products/by-seller?sellerId=${encodeURIComponent(sellerId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProducts(data.products);
        else setProducts([]);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoadingWorks(false));
  }, [sellerId]);

  // Safety (we can probably delete it or style it better later)
  if (loadingSeller) {
    return (
      <main className="page">
        <Header />
        <p className="profile__notice">Loading seller...</p>
      </main>
    );
  }

  // Safety (we can probably delete it or style it better later)
  if (!seller) {
    return (
      <main className="page">
        <Header />
        <p className="profile__notice">Seller not found.</p>
      </main>
    );
  }

  return (
    <main className="page">
      <Header />
      <section className="profile">
        <div className="container">
          <div className="profile__panel">
            <div className="seller">
              <div className="seller__left">
                <div className="seller__avatar" aria-label="Seller avatar" />
              </div>

              <div className="seller__right">
                <h1 className="seller__name">{seller.name}</h1>
                <p className="seller__location">{seller.country}</p>

                <div className="seller__bio">
                  <p>{seller.bio || "No bio available."}</p>
                </div>
              </div>
            </div>

            <div className="profile__divider" />

            {seller.seller ? (
              <>
                <h2 className="works__title">Works</h2>

                <div className="works__grid" aria-label="Seller works">
                  {loadingWorks ? (
                    <p>Loading works...</p>
                  ) : products.length === 0 ? (
                    <p>No works yet.</p>
                  ) : (
                    products.map((p) => (
                      <Link key={p._id} href={`/items/${p._id}`} className="cardLink">
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
              <p className="profile__notice">No works here.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
