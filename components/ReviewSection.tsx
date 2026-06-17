"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";

type Review = {
  id: number;
  text: string;
  rating: number;
  isSpoiler: boolean;
  createdAt: string;
};

type ReviewSectionProps = {
  movieId: number;
};

const MAX_REVIEW_LENGTH = 200;
const STORAGE_KEY_PREFIX = "koge-cinema-reviews";

function getStorageKey(movieId: number) {
  return `${STORAGE_KEY_PREFIX}-${movieId}`;
}

function getStoredReviews(movieId: number): Review[] {
  const rawReviews = localStorage.getItem(getStorageKey(movieId));

  if (!rawReviews) {
    return [];
  }

  try {
    return JSON.parse(rawReviews) as Review[];
  } catch {
    return [];
  }
}

export function ReviewSection({ movieId }: ReviewSectionProps) {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [revealedReviewIds, setRevealedReviewIds] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    setReviews(getStoredReviews(movieId));
  }, [movieId]);

  const trimmedReview = reviewText.trim();
  const isOverLimit = reviewText.length > MAX_REVIEW_LENGTH;
  const canSubmit =
    trimmedReview.length > 0 && rating > 0 && !isOverLimit && !isSubmitting;

  const averageRating = useMemo(() => {
    if (reviews.length === 0) {
      return 0;
    }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
  }, [reviews]);

  const ratingSummary = useMemo(() => {
    return [5, 4, 3, 2, 1].map((score) => {
      const count = reviews.filter((review) => review.rating === score).length;
      const percentage =
        reviews.length === 0 ? 0 : Math.round((count / reviews.length) * 100);

      return {
        score,
        count,
        percentage,
      };
    });
  }, [reviews]);

  function toggleReveal(reviewId: number) {
    setRevealedReviewIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(reviewId)) {
        nextIds.delete(reviewId);
      } else {
        nextIds.add(reviewId);
      }

      return nextIds;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const newReview: Review = {
      id: Date.now(),
      text: trimmedReview,
      rating,
      isSpoiler,
      createdAt: new Date().toLocaleDateString("ja-JP"),
    };

    const nextReviews = [newReview, ...reviews];

    localStorage.setItem(getStorageKey(movieId), JSON.stringify(nextReviews));
    setReviews(nextReviews);
    setReviewText("");
    setRating(0);
    setIsSpoiler(false);
    setIsSubmitting(false);
  }

  return (
    <section className="mt-10 rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-black/40 backdrop-blur-md">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold tracking-[0.3em] text-sky-300">
            MY REVIEW
          </p>
          <h2 className="mt-3 text-2xl font-bold">映画メモを書く</h2>
        </div>

        <p className="text-sm text-slate-400">
          星評価とネタバレ配慮つきで感想を残せます。
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-slate-400">平均評価</p>
            <p className="mt-1 text-3xl font-bold text-slate-100">
              {averageRating > 0 ? averageRating : "-"}{" "}
              <span className="text-base text-slate-400">/ 5</span>
            </p>
          </div>

          <p className="text-sm text-slate-400">{reviews.length} reviews</p>
        </div>

        <div className="mt-5 space-y-3">
          {ratingSummary.map((item) => (
            <div
              key={item.score}
              className="grid grid-cols-[56px_1fr_48px] items-center gap-3 text-sm"
            >
              <span className="text-slate-300">{item.score} ★</span>

              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-sky-400 transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              <span className="text-right text-slate-400">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <div>
          <p className="mb-2 text-sm font-bold text-slate-300">あなたの評価</p>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`cursor-pointer text-3xl transition hover:scale-110 ${
                  star <= rating ? "text-sky-300" : "text-slate-700"
                }`}
                aria-label={`${star}点をつける`}
              >
                ★
              </button>
            ))}

            <span className="ml-2 text-sm text-slate-400">
              {rating > 0 ? `${rating} / 5` : "未評価"}
            </span>
          </div>
        </div>

        <textarea
          value={reviewText}
          onChange={(event) => setReviewText(event.target.value)}
          placeholder="この映画の好きだったところ、余韻、ツッコミどころなどを書いてみる..."
          className="mt-5 min-h-36 w-full resize-none rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500/70"
        />

        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={isSpoiler}
              onChange={(event) => setIsSpoiler(event.target.checked)}
              className="h-4 w-4 accent-sky-500"
            />
            ネタバレを含む
          </label>

          <p
            className={`text-sm ${
              isOverLimit ? "text-red-300" : "text-slate-400"
            }`}
          >
            {reviewText.length} / {MAX_REVIEW_LENGTH}文字
          </p>
        </div>

        {isOverLimit && (
          <p className="mt-3 text-sm text-red-300">
            200文字以内で入力してください。
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-5 inline-flex cursor-pointer items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "投稿中..." : "レビューを追加"}
        </button>
      </form>

      <div className="mt-8 space-y-4">
        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-400">
            まだレビューはありません。最初の映画メモを書いてみましょう。
          </div>
        ) : (
          reviews.map((review) => {
            const isRevealed = revealedReviewIds.has(review.id);

            return (
              <article
                key={review.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
              >
                <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span>{review.createdAt}</span>

                  <span className="text-sky-300">
                    {"★".repeat(review.rating)}
                    <span className="text-slate-700">
                      {"★".repeat(5 - review.rating)}
                    </span>
                  </span>

                  {review.isSpoiler && (
                    <span className="rounded-full border border-red-400/40 bg-red-500/10 px-3 py-1 text-red-200">
                      SPOILER
                    </span>
                  )}
                </div>

                {review.isSpoiler && !isRevealed ? (
                  <div>
                    <p className="text-sm text-slate-300">
                      このレビューにはネタバレが含まれています。
                    </p>
                    <button
                      type="button"
                      onClick={() => toggleReveal(review.id)}
                      className="mt-3 cursor-pointer text-sm font-bold text-sky-300 transition hover:text-sky-200"
                    >
                      内容を表示する
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="whitespace-pre-wrap break-words leading-7 text-slate-200">
                      {review.text}
                    </p>

                    {review.isSpoiler && (
                      <button
                        type="button"
                        onClick={() => toggleReveal(review.id)}
                        className="mt-3 cursor-pointer text-sm font-bold text-sky-300 transition hover:text-sky-200"
                      >
                        内容を隠す
                      </button>
                    )}
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}