"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    setIsLoggedIn(!!token);
    
    if (userData) {
      const user = JSON.parse(userData);
      setIsSeller(user.seller === true);
    }
    
    setMounted(true);
  }, []);

  const handleSignOut = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    // Redirect to home
    router.push("/");
  };

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
            <a className="nav__link nav__link--active" href="/">HOME</a>
            <a className="nav__link" href="/gallery">GALLERY</a>
            <a className="nav__link" href="/dashboard">DASHBOARD</a>
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
            {!mounted ? (
              <div className="btn btn--primary" style={{ visibility: 'hidden' }}>Login</div>
            ) : isLoggedIn ? (
              <>
                {isSeller && (
                  <a href="/profile" className="btn btn--primary btn--green">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Profile
                  </a>
                )}
                <button 
                  onClick={handleSignOut}
                  className="btn btn--primary"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <a className="btn btn--primary" href="/login">Login</a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
