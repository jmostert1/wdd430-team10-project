"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import useAuthUser from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";
import Link from "next/link";

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
          <Link className="brand" href="/" aria-label="Handcrafted Haven home">
            <span className="brand__icon" aria-hidden="true">
              HH
            </span>
            <span className="brand__name">Handcrafted Haven</span>
          </Link>

          {/* Navigation */}
          <nav className="nav" aria-label="Main navigation">
            <Link className={`nav__link ${pathname === "/" ? "nav__link--active" : ""}`} href="/">HOME</Link>
            <Link className={`nav__link ${pathname === "/gallery" ? "nav__link--active" : ""}`} href="/gallery">GALLERY</Link>
            <Link className={`nav__link ${pathname === "/profile" ? "nav__link--active" : ""}`} href="/profile">PROFILE</Link>
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
            <>
              {/* Desktop button */}
              <button onClick={signOut} className="btn btn--primary header__loginBtn">
                Sign Out
              </button>

              {/* Mobile icon */}
              <button
                onClick={signOut}
                className="header__loginIcon"
                aria-label="Sign Out"
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
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </>
          ) : (
            <>
              {/* Desktop button */}
              <button
                type="button"
                className="btn btn--primary header__loginBtn"
                onClick={() => router.push("/login")}
              >
                Login
              </button>

              {/* Mobile icon */}
              <a 
                href="/login" 
                className="header__loginIcon"
                aria-label="Login"
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
                  <path d="M20 21a8 8 0 0 0-16 0" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </a>
            </>
          )}
          </div>
        </div>
      </div>
    </header>
  );
}
