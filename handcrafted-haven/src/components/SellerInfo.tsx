import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Link from "next/link";

type SellerInfoProps = {
  sellerId: string; // we'll pass String(product.sellerId)
};

export default async function SellerInfo({ sellerId }: SellerInfoProps) {
  // if sellerId is not a valid ObjectId, show fallback
  if (!ObjectId.isValid(sellerId)) {
    return (
      <div className="sellerRow">
        <div className="avatar avatar--sm" aria-label="Seller avatar" />
        <div className="sellerRow__text">Seller not found</div>
      </div>
    );
  }

  const client = await clientPromise;
  const db = client.db("cse430");

  const seller = await db.collection("users").findOne(
    { _id: new ObjectId(sellerId) },
    { projection: { name: 1, country: 1, rating: 1, avatar: 1, seller: 1 } }
  );

  // If seller not found, show fallback
  if (!seller) {
    return (
      <div className="sellerRow">
        <div className="avatar avatar--sm" aria-label="Seller avatar" />
        <div className="sellerRow__text">Seller not found</div>
      </div>
    );
  }

  return (
    <div className="sellerRow">
      <img
        className="avatar avatar--xs"
        src={seller.avatar || "/users/default-avatar.png"}
        alt={`${seller.name} avatar`}
      />

      <div className="sellerRow__text">
        <Link
          href={`/sellers/${sellerId}`}
          className="sellerRow__nameLink"
        >
          {seller.name}
        </Link>
        <div className="sellerRow__country">{seller.country}</div>
      </div>
    </div>
  );
}