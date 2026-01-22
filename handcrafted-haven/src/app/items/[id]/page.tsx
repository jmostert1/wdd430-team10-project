import Header from "@/components/Header";
import "./item.css";

export default function ItemPage() {
  return (
    <main className="page">
    <Header />
      <section className="item">
        <div className="container">
          <div className="item__panel">
            <div className="item__grid">
              {/* LEFT COLUMN */}
              <div className="media">
                <div className="media__main" aria-label="Product image" />

                <div className="media__thumbRow" aria-label="Product thumbnails">
                  <button className="thumbNav" type="button" aria-label="Previous images">
                    ‹
                  </button>

                  <div className="thumb" />
                  <div className="thumb" />
                  <div className="thumb" />

                  <button className="thumbNav" type="button" aria-label="Next images">
                    ›
                  </button>
                </div>

                <div className="reviewPreview">
                  <div className="reviewPreview__top">
                    <div className="avatar" />

                    <div className="reviewPreview__meta">
                        <div className="reviewPreview__header">
                        <span className="reviewPreview__name">Buyer Information</span>
                        <span className="stars stars--sm">★★★★★</span>
                        </div>

                        <div className="reviewPreview__date">01.07.2025</div>
                    </div>
                    </div>


                  <p className="reviewPreview__text">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqui adipiscing elit, sed do eiusmod tempor
                    tempor.
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="details">
                <h1 className="details__title">Product Name</h1>
                <div className="details__price">$ 25.00</div>

                <div className="details__rating">
                  <div className="stars" aria-label="Overall rating">★★★★★</div>
                  <div className="details__ratingText">5.0 (12 Reviews)</div>
                </div>

                <div className="sellerRow">
                  <div className="avatar avatar--sm" aria-label="Seller avatar" />
                  <div className="sellerRow__text">Seller Information</div>
                </div>

                <div className="details__desc">
                  <p>Lorem ipsum dolor sit amet, consectetur</p>
                  <p>adipiscing elit, sed do eiusmod tempor</p>
                  <p>incididunt ut labore et dolore magna</p>
                  <p>aliq adipiscing elit, sed do eiusmod</p>
                  <p>tempor</p>
                </div>

                <div className="details__actions">
                  <button className="btn btn--primary details__btn" type="button">
                    Add to Cart
                  </button>
                  <button className="btn btn--primary details__btn" type="button">
                    Save for Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
