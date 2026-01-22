import Header from "@/components/Header";
import "./gallery.css";

export default function GalleryPage() {
  return (
    <main className="page">
      <Header />
      <section className="gallery">
        <div className="container gallery__layout">
          {/* LEFT PANEL */}
          <aside className="panel panel--filters" aria-label="Filters">
            <h2 className="panel__title">Filters</h2>
            <div className="panel__line" />

            <h3 className="panel__subtitle">Category</h3>

            <label className="check">
              <input type="checkbox" />
              <span>Home Decor</span>
            </label>
            <label className="check">
              <input type="checkbox" />
              <span>Jewelry</span>
            </label>
            <label className="check">
              <input type="checkbox" />
              <span>Ceramics</span>
            </label>
            <label className="check">
              <input type="checkbox" />
              <span>Textiles</span>
            </label>

            <div className="panel__line panel__line--spaced" />

            <h3 className="panel__subtitle">Price</h3>

            <div className="price__labels">
              <span>$10</span>
              <span>$1000</span>
            </div>

            <input className="price__range" type="range" min={10} max={1000} defaultValue={700} />

            <button className="btn btn--primary filters__apply" type="button">
              Apply
            </button>
          </aside>

          {/* RIGHT PANEL */}
          <section className="panel panel--results" aria-label="Gallery content">
            <div className="results__header">
              <div>
                <h1 className="results__title">Gallery</h1>

                <div className="select select--small">
                  <select aria-label="Price range dropdown">
                    <option>$10 - $1000</option>
                    <option>$10 - $100</option>
                    <option>$100 - $500</option>
                    <option>$500 - $1000</option>
                  </select>
                </div>
              </div>

              <div className="select select--wide">
                <select aria-label="Sort dropdown">
                  <option>Sort By Most Popular</option>
                  <option>Sort By Newest</option>
                  <option>Sort By Price: Low to High</option>
                  <option>Sort By Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="products">
              {Array.from({ length: 6 }).map((_, i) => (
                <article className="product" key={i}>
                  <div className="product__img">
                    <button className="product__heart" type="button" aria-label="Favorite">
                      ♡
                    </button>
                  </div>

                  <div className="product__meta">
                    <div className="product__name">Name of the Item</div>
                    <div className="product__price">$ 25.00</div>
                    <div className="product__store">Store Name</div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
