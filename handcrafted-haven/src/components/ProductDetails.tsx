"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useCart from "@/hooks/useCart";
import useAuthUser from "@/hooks/useAuth";
import CommentForm from "./CommentForm";

type ProductDetailsProps = {
  productId: string;
  name: string;
  price: number;
  imageSrc?: string;
};

export default function ProductDetails({productId, name, price, imageSrc }: ProductDetailsProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuthUser();
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);

  // Comments (checks if visible)
  const [showCommentForm, setShowCommentForm] = useState(false);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      router.push("/login?redirect=/items/" + productId);
      return;
    }

    addToCart({productId, name, price, imageSrc});
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleAddCommentClick = () => {
    if (!isLoggedIn) {
      router.push("/login?redirect=/items/" + productId);
      return;
    }

    // shift value
    setShowCommentForm((v) => !v);
  };

  return (
    <>
      <div className="details__actions">
        <button
          className="btn btn--primary details__btn"
          type="button"
          onClick={handleAddToCart}
        >
          {addedToCart ? "✓ Added!" : "Add to Cart"}
        </button>

        <button
          className="btn btn--primary details__btn"
          type="button"
          onClick={handleAddCommentClick}
        >
          {showCommentForm ? "Close" : "Add Comment"}
        </button>
      </div>
    
      {/* Comment form */}
      <CommentForm
        productId={productId}
        isOpen={showCommentForm}
        onClose={() => setShowCommentForm(false)}
      />
    </>
  );
}
