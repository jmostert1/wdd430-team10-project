import Header from "@/components/Header";
import "./item.css";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import ProductImageCarousel from "@/components/ProductImageCarousel";
import ReviewCard from "@/components/ReviewCard";
import SellerInfo from "@/components/SellerInfo";
import ProductDetails from "@/components/ProductDetails";


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

  // Get one random comment for this product
  const randomComment = await db.collection("comments").aggregate([
    { $match: { productId: new ObjectId(id) } },
    { $sample: { size: 1 } }
  ]).toArray();

  const comment = randomComment[0] || null;

  // Get user info for that comment
  let commentUser = null;

  if (comment?.userId) {
    commentUser = await db.collection("users").findOne(
      { _id: comment.userId },
      { projection: { name: 1, avatar: 1 } }
    );
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

                {/* Reviews */}
                {comment && commentUser ? (
                  <ReviewCard
                    name={commentUser.name || "Buyer"}
                    date={new Date(comment.createdAt).toLocaleDateString("en-GB")}
                    rating={Number(comment.rating || 0)}
                    text={comment.text || ""}
                    avatarSrc={commentUser.avatar}
                  />
                ) : (
                  <ReviewCard
                    name="Buyer Information"
                    date=""
                    rating={5}
                    text="No reviews yet."
                  />
                )}
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

                <ProductDetails
                  productId={id}
                  name={product.name}
                  price={Number(product.price)}
                  imageSrc={images[0]}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
