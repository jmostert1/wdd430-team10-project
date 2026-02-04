import Header from "@/components/Header";
import "./item.css";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import ProductImageCarousel from "@/components/ProductImageCarousel";
import ReviewCard from "@/components/ReviewCard";
import SellerInfo from "@/components/SellerInfo";


type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ItemPage({ params }: PageProps) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) notFound();

  const client = await clientPromise;
  const db = client.db("cse430");

  const product = await db.collection("products").findOne(
    { _id: new ObjectId(id) },
    { projection: { name: 1, price: 1, description: 1, rating: 1, imageUrl: 1, sellerId: 1 } }
  );

  if (!product) {
    notFound();
  }

  const images: string[] = product.imageUrl ?? [];

  return (
    <main className="page">
      <Header />
      <section className="item">
        <div className="container">
          <div className="item__panel">
            <div className="item__grid">
              {/* LEFT COLUMN */}
              <div className="media">
                <ProductImageCarousel
                  images={images}
                  alt={product.name}
                />

                {/* Reviews are static for now. Need to change it later */}
                <ReviewCard
                  name="Buyer Information"
                  date="01.07.2025"
                  rating={4.8}
                  text="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
                />
              </div>

              {/* RIGHT COLUMN */}
              <div className="details">
                <div className="details__top">
                  <h1 className="details__title">{product.name}</h1>

                  <div className="details__meta">
                    <div className="details__price">$ {Number(product.price).toFixed(2)}</div>

                    <div className="details__rating">
                      <div className="stars" aria-label="Overall rating">★★★★★</div>
                      <div className="details__ratingText">
                        {Number(product.rating ?? 0).toFixed(1)}
                      </div>
                    </div>
                  </div>

                  <SellerInfo sellerId={String(product.sellerId)} />
                </div>

                <div className="details__desc">
                  <p>{product.description}</p>
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
