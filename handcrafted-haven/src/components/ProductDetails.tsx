"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useCart from "@/hooks/useCart";
import useAuthUser from "@/hooks/useAuth";

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

  // Comments
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      router.push("/login?redirect=/items/" + productId);
      return;
    }

    addToCart({
      productId,
      name,
      price,
      imageSrc,
    });

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

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset messages
    setError("");
    setSuccess("");

    // validation
    const safeText = text.trim();
    if (!safeText) {
      setError("Please write a comment.");
      return;
    }
    if (safeText.length < 5) {
      setError("Comment is too short.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be signed in to comment.");
      return;
    }

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          rating,
          text: safeText,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to submit comment.");
        return;
      }
      
      // Success
      setSuccess("✓ Comment added!");
      setText("");
      setRating(5);

      // close and refresh
      setShowCommentForm(false);
      router.refresh();
    } catch (err) {
      setError("Error. Try again.");
    }
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

      {showCommentForm && (
        <div className="commentBlock">
          <h3 className="commentBlock__title">Leave a comment</h3>

          {/* Comment form */}
          <form className="commentForm" onSubmit={handleSubmitComment}>
            {/* Rating dropdown */}
            <label className="commentForm__label">
              Rating
              <select
                className="commentForm__select"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Good</option>
                <option value={3}>3 - Okay</option>
                <option value={2}>2 - Bad</option>
                <option value={1}>1 - Terrible</option>
              </select>
            </label>

            {/* Comment text input */}
            <label className="commentForm__label">
              Comment
              <textarea
                className="commentForm__textarea"
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your experience..."
              />
            </label>

            {/* Error message*/}
            {error && (
              <p className="commentForm__msg commentForm__msg--error">{error}</p>
            )}
            {/* Success message*/}
            {success && (
              <p className="commentForm__msg commentForm__msg--success">{success}</p>
            )}

            <button className="btn btn--primary commentForm__submit" type="submit">
              Submit
            </button>
          </form>
        </div>
      )}
    </>
  );
}
