"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";

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
        <div style={{
          background: "#d4edda",
          color: "#155724",
          padding: "12px",
          textAlign: "center",
          fontSize: "14px",
          border: "1px solid #c3e6cb"
        }}>
          {success}
        </div>
      )}

      {/* Hero */}
      <section className="hero" aria-label="Featured content">
        <div className="container">
          <div
            className="hero__media"
            role="img"
            aria-label="Featured handcrafted products"
          >
            {/* Will need to add image here later */}
          </div>
        </div>
      </section>

      {/* Lower content */}
      <section className="below">
        <div className="container below__grid">
          {/* Left text */}
          <div className="below__text">
            <h1 className="below__title">Lorem ipsum dolor sit amet, ck</h1>
            <p className="below__desc">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
            </p>
            <a className="btn btn--primary" href="/gallery">Learn more</a>
          </div>

          {/* Right cards */}
          <div className="below__cards" aria-label="Featured categories">
            <article className="card" />
            <article className="card" />
            <article className="card" />
          </div>
        </div>
      </section>
    </main>
  );
}
