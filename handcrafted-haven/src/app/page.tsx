import Header from "@/components/Header";

export default function HomePage() {
  return (
    <main className="page">
      <Header />

      {/* Hero */}
      <section className="hero" aria-label="Featured content">
        <div className="container">
          <div
            className="hero__media"
            role="img"
            aria-label="Featured handcrafted products"
          >
            {/* Will need to add image here later */}
          </div>
        </div>
      </section>

      {/* Lower content */}
      <section className="below">
        <div className="container below__grid">
          {/* Left text */}
          <div className="below__text">
            <h1 className="below__title">Lorem ipsum dolor sit amet, ck</h1>
            <p className="below__desc">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
            </p>
            <a className="btn btn--primary" href="/gallery">Learn more</a>
          </div>

          {/* Right cards */}
          <div className="below__cards" aria-label="Featured categories">
            <article className="card" />
            <article className="card" />
            <article className="card" />
          </div>
        </div>
      </section>
    </main>
  );
}
