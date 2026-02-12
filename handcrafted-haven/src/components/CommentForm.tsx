"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthUser from "@/hooks/useAuth";

type CommentFormProps = {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function CommentForm({ productId, isOpen, onClose }: CommentFormProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuthUser();

  // Form state
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  // UI messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // If not open, render nothing
  if (!isOpen) return null;

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset messages
    setError("");
    setSuccess("");

    // Checking if user is logged in
    if (!isLoggedIn) {
      router.push("/login?redirect=/items/" + productId);
      return;
    }

    // Validation
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
      // Submit comment to API
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, rating, text: safeText }),
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

      // Close form and refresh product page data
      onClose();
      router.refresh();
    } catch {
      setError("Error. Try again.");
    }
  };

  return (
    <div className="commentBlock">
      <h3 className="commentBlock__title">Leave a comment</h3>

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

        {/* Error message */}
        {error && <p className="commentForm__msg commentForm__msg--error">{error}</p>}

        {/* Success message */}
        {success && <p className="commentForm__msg commentForm__msg--success">{success}</p>}

        <button className="btn btn--primary commentForm__submit" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
