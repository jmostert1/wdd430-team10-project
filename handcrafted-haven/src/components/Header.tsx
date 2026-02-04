"use client";

import { usePathname } from "next/navigation";
import useAuthUser from "@/hooks/useAuth";

export default function Header() {
  const pathname = usePathname();

  // Load auth user
  const { isLoggedIn, signOut } = useAuthUser();

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
