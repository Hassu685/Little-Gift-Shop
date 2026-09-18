"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function ReviewForm({ productId }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage(data.message);
      setStatus("success");
      setComment("");
    } catch (err) {
      setMessage(err.message || "Something went wrong.");
      setStatus("error");
    }
  };

  if (!user) {
    return (
      <p className="text-sm text-ink/60">
        <a href="/login" className="font-medium text-primary underline">
          Sign in
        </a>{" "}
        to leave a review.
      </p>
    );
  }

  if (status === "success") {
    return <p className="text-sm text-emerald-600">{message}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
          >
            <Star
              size={20}
              className={n <= rating ? "text-gold" : "text-ink/20"}
              fill={n <= rating ? "currentColor" : "none"}
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        rows={3}
        placeholder="Share your experience with this product..."
        className="w-full rounded-xl border border-primary/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
      />
      {status === "error" && <p className="text-xs text-red-500">{message}</p>}
      <button type="submit" disabled={status === "loading"} className="btn-primary text-sm disabled:opacity-70">
        {status === "loading" && <Loader2 size={14} className="animate-spin" />}
        Submit Review
      </button>
    </form>
  );
}
