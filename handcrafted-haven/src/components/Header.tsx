"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import useAuthUser from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Load auth user
  const { isLoggedIn, signOut } = useAuthUser();
  
  // Load cart
  const { getTotalItems } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/gallery?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__inner">
          {/* Logo */}
          <a className="brand" href="/" aria-label="Handcrafted Haven home">
            <span className="brand__icon" aria-hidden="true">
              HH
            </span>
            <span className="brand__name">Handcrafted Haven</span>
          </a>

          {/* Navigation */}
          <nav className="nav" aria-label="Main navigation">
            <a className={`nav__link ${pathname === "/" ? "nav__link--active" : ""}`} href="/">HOME</a>
            <a className={`nav__link ${pathname === "/gallery" ? "nav__link--active" : ""}`} href="/gallery">GALLERY</a>
            <a className={`nav__link ${pathname === "/profile" ? "nav__link--active" : ""}`} href="/profile">PROFILE</a>
          </nav>

          {/* Search */}
          <form className="header__search" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search products..."
              aria-label="Search products"
              className="search__input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* CTA */}
          <div className="header__cta">
            {/* Cart Icon - Only show if logged in */}
            {isLoggedIn && (
              <a 
                href="/cart" 
                className="cart-icon"
                aria-label={`Shopping cart with ${getTotalItems()} items`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {getTotalItems() > 0 && (
                  <span className="cart-badge">{getTotalItems()}</span>
                )}
              </a>
            )}

            {isLoggedIn ? (
              <button onClick={signOut} className="btn btn--primary">
                Sign Out
              </button>
            ) : (
              <a className="btn btn--primary" href="/login">
                Login
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
