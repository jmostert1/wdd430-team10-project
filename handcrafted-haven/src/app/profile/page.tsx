/* Maybe need to do it the same way as items cuz need the ID for user */
import Header from "@/components/Header";
import "./profile.css";

export default function ProfilePage() {
  return (
    <main className="page">
        <Header />
      <section className="profile">
        <div className="container">
          <div className="profile__panel">
            {/* Seller info */}
            <div className="seller">
              <div className="seller__left">
                <div className="seller__avatar" aria-label="Seller avatar" />
                <a className="btn btn--primary seller__btn" href="/profile">
                  See More
                </a>
              </div>

              <div className="seller__right">
                <h1 className="seller__name">Name Lastname</h1>
                <p className="seller__location">City, Country</p>

                <div className="seller__bio">
                  <p>Lorem ipsum dolor sit amet, consectetur</p>
                  <p>adipiscing elit, sed do eiusmod tempor</p>
                  <p>incididunt ut labore et dolore magna</p>
                  <p>aliq adipiscing elit, sed do eiusmod</p>
                  <p>tempor</p>
                </div>
              </div>
            </div>

            <div className="profile__divider" />

            {/* Works */}
            <h2 className="works__title">My works</h2>

            <div className="works__grid" aria-label="Seller works">
              {Array.from({ length: 3 }).map((_, i) => (
                <article className="work" key={i}>
                  <div className="work__img" aria-label="Product image placeholder" />
                  <div className="work__meta">
                    <div className="work__name">Name of the Item</div>
                    <div className="work__price">$ 25.00</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

