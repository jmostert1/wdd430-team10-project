"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";


export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false); // added to avoid hydration issues


  useEffect(() => {
    // Check if user is logged in
    setMounted(true);
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleSignOut = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    // Redirect to home
    router.push("/");
  };

  if (!mounted) {
  return null;
}

  return (
    <header className="header">
      <div className="container">
        <div className="header__inner">
          {/* Logo */}
          <a className="brand" href="/" aria-label="Handcrafted Haven home">
            <span className="brand__icon" aria-hidden="true">HH</span>
            <span className="brand__name">Handcrafted Haven</span>
          </a>

          {/* Navigation */}
          <nav className="nav" aria-label="Main navigation">
            <a className={`nav__link ${pathname === "/" ? "nav__link--active" : ""}`} href="/">HOME</a>
            <a className={`nav__link ${pathname === "/gallery" ? "nav__link--active" : ""}`} href="/gallery">GALLERY</a>
            <a className={`nav__link ${pathname === "/profile" ? "nav__link--active" : ""}`} href="/profile">PROFILE</a>
          </nav>

          {/* Search */}
          <div className="header__search">
            <input
              type="search"
              placeholder="Search products..."
              aria-label="Search products"
              className="search__input"
            />
          </div>

          {/* CTA */}
          <div className="header__cta">
            {isLoggedIn ? (
              <button 
                onClick={handleSignOut}
                className="btn btn--primary"
              >
                Sign Out
              </button>
            ) : (
              <a className="btn btn--primary" href="/login">Login</a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
