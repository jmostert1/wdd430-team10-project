export default function Header() {
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
            <a className="btn btn--primary" href="/login">Login</a>
          </div>
        </div>
      </div>
    </header>
  );
}
