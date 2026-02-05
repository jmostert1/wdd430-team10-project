"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import useAuthUser from "@/hooks/useAuth";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Load auth user
  const { isLoggedIn, signOut } = useAuthUser();

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
