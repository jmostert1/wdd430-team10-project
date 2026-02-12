"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import CategoryCard from "@/components/CategoryCard";
import Image from "next/image";

export default function HomePage() {
  const searchParams = useSearchParams();
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const successMessage = searchParams.get("success");
    if (successMessage) {
      setSuccess(successMessage);
      // Clear the success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000);
    }
  }, [searchParams]);

  return (
    <main className="page">
      <Header />

      {success && (
        <div className="alert alert--success">
          {success}
        </div>
      )}  

      {/* Hero */}
      <section className="hero" aria-label="Featured content">
        <div className="container">
          <div className="hero__media">
            <Image
              src="/hero.png"
              alt="Featured handcrafted products"
              fill
              priority
              className="hero__img"
            />
          </div>
        </div>
      </section>

      {/* Lower content */}
      <section className="below">
        <div className="container below__grid">
          {/* Left text */}
          <div className="below__text">
            <h1 className="below__title">Find Something Truly Special</h1>
            <p className="below__desc">
              Browse a collection of handmade products created by independent artisans.
              Each item offers quality, character, and a personal touch.
            </p>
            <a className="btn btn--primary" href="/gallery">Learn more</a>
          </div>

          {/* Right cards */}
          <div className="below__cards" aria-label="Featured categories">
            <CategoryCard
              src="/home2.png"
              alt="Handmade home decor"
              title="Textiles"
              href="/gallery?category=Textiles"
            />
            <CategoryCard
              src="/home1.png"
              alt="Handcrafted accessories"
              title="Ceramics"
              href="/gallery?category=Ceramics"
            />
            <CategoryCard
              src="/home3.png"
              alt="Artisan gifts"
              title="Home Decor"
              href="/gallery?category=Home Decor"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
