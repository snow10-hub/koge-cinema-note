"use client";

import { type FormEvent, useMemo, useState } from "react";

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
  if (typeof window === "undefined") return [];

  const rawReviews = localStorage.getItem(getStorageKey(movieId));
  if (!rawReviews) return [];

  try {
    return JSON.parse(rawReviews) as Review[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export function ReviewSection({ movieId }: ReviewSectionProps) {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [reviews, setReviews] = useState<Review[]>(() =>
    getStoredReviews(movieId)
  );
  const [revealedReviewIds, setRevealedReviewIds] = useState<number[]>([]);

  const trimmedReview = reviewText.trim();
  const isOverLimit = reviewText.length > MAX_REVIEW_LENGTH;
  const canSubmit =
    trimmedReview.length > 0 && rating > 0 && !isOverLimit && !isSubmitting;

  const displayRating = hoverRating || rating;
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
  }, [reviews]);

  const ratingSummary = useMemo(() => {
    return [5, 4, 3, 2, 1].map((score) => {
      const count = reviews.filter((review) => review.rating === score).length;
      const percentage =
        reviews.length === 0 ? 0 : Math.round((count / reviews.length) * 100);

      return { score, count, percentage };
    });
  }, [reviews]);

  function toggleReveal(reviewId: number) {
    setRevealedReviewIds((current) =>
      current.includes(reviewId)
        ? current.filter((id) => id !== reviewId)
        : [...current, reviewId]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

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
    <section className="mt-12 rounded-xl border border-sky-500/40 bg-slate-900/65 p-6 shadow-2xl shadow-black/70 backdrop-blur-md antialiased text-slate-200 md:p-8">
      <div className="flex flex-col gap-2 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-sky-400">
            COLLECTION
          </p>

          <h2 className="mt-1.5 text-lg font-bold tracking-widest text-white md:text-xl">
            マイレビュー
          </h2>

          <p className="mt-2 text-xs font-light leading-relaxed tracking-wide text-slate-300">
            映画メモを残す
          </p>
        </div>

        <p className="text-xs text-slate-300">
          星評価とネタバレ配慮つきで感想を保存できます。
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-700/80 bg-slate-900/80 p-5 backdrop-blur-sm">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold tracking-wider text-slate-300">
              総合平均点
            </p>

            <p className="mt-1 text-3xl font-black text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.05)]">
              {averageRating > 0 ? averageRating.toFixed(1) : "-"}{" "}
              <span className="text-sm font-normal text-slate-400">/ 5.0</span>
            </p>
          </div>

          <p className="text-xs font-bold tracking-wide text-slate-100">
            全 {reviews.length} 件のレビュー
          </p>
        </div>

        <div className="mt-5 space-y-2.5">
          {ratingSummary.map((item) => (
            <div
              key={item.score}
              className="grid grid-cols-[48px_1fr_32px] items-center gap-3 text-xs font-bold"
            >
              <span className="text-right text-slate-200">{item.score} ★</span>

              <div className="h-1.5 overflow-hidden rounded-full border border-slate-700 bg-slate-950">
                <div
                  className="h-full rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)] transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              <span className="text-right text-slate-200">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8">
        <div>
          <p className="mb-2 text-xs font-bold tracking-wider text-slate-200">
            あなたの評価
          </p>

          <div className="flex items-center gap-1.5" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onFocus={() => setHoverRating(star)}
                onBlur={() => setHoverRating(0)}
                className={`cursor-pointer text-2xl transition-all duration-200 hover:scale-110 active:scale-95 ${star <= displayRating
                  ? "text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]"
                  : "text-slate-500"
                  }`}
                aria-label={`${star}点をつける`}
              >
                ★
              </button>
            ))}

            <span
              className={`ml-2 text-xs font-bold ${displayRating > 0 ? "text-sky-400" : "text-slate-400"
                }`}
            >
              {displayRating > 0 ? `${displayRating} / 5 点` : "星を選択してください"}
            </span>
          </div>
        </div>

        <textarea
          value={reviewText}
          onChange={(event) => setReviewText(event.target.value)}
          placeholder="この映画の好きだったところ、余韻、ツッコミどころなどを書いてみる..."
          className="mt-5 min-h-32 w-full resize-none rounded-2xl border border-slate-600 bg-slate-800/70 p-4 text-sm leading-7 text-white outline-none shadow-inner transition-all duration-300 placeholder:text-slate-400 focus:border-sky-400 focus:bg-slate-900/90 focus:shadow-[0_0_15px_rgba(56,189,248,0.25)]"
        />

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex w-fit cursor-pointer select-none items-center gap-2 text-xs font-bold text-slate-200 hover:text-white">
            <input
              type="checkbox"
              checked={isSpoiler}
              onChange={(event) => setIsSpoiler(event.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 accent-sky-500"
            />
            ネタバレを含む
          </label>

          <p
            className={`text-xs font-bold ${isOverLimit ? "text-red-400" : "text-slate-300"
              }`}
          >
            {reviewText.length} / {MAX_REVIEW_LENGTH}文字
          </p>
        </div>

        {isOverLimit && (
          <p className="mt-2 text-xs font-medium text-red-400">
            200文字以内で入力してください。
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-5 inline-flex cursor-pointer items-center justify-center rounded-full bg-slate-100 px-6 py-2.5 text-xs font-black tracking-widest text-slate-950 transition-all duration-300 hover:scale-105 hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700/70 disabled:text-slate-300 disabled:opacity-80 disabled:hover:scale-100"
        >
          {isSubmitting ? "保存中..." : "レビューを保存する"}
        </button>
      </form>

      <div className="mt-10 space-y-6 border-t border-white/10 pt-8">
        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-6 text-center text-sm font-medium text-slate-300">
            まだレビューはありません。最初の映画メモを書いてみましょう。
          </div>
        ) : (
          reviews.map((review) => {
            const isRevealed = revealedReviewIds.includes(review.id);

            return (
              <article
                key={review.id}
                className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-all"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-100">{review.createdAt}</span>

                    <span className="flex gap-0.5 text-sm">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={
                            star <= review.rating
                              ? "text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.4)]"
                              : "text-slate-600"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </span>
                  </div>

                  {review.isSpoiler && (
                    <span className="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-0.5 text-[10px] font-black tracking-widest text-red-400">
                      ネタバレ
                    </span>
                  )}
                </div>

                {review.isSpoiler && !isRevealed ? (
                  <div className="rounded-xl border border-slate-700/70 bg-slate-950/70 p-5 text-center">
                    <p className="text-xs font-bold text-slate-200">
                      このレビューにはネタバレが含まれています。
                    </p>

                    <button
                      type="button"
                      onClick={() => toggleReveal(review.id)}
                      className="mt-2.5 cursor-pointer text-xs font-black tracking-widest text-sky-400 transition hover:text-sky-300"
                    >
                      [ レビューを表示する ]
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="whitespace-pre-wrap break-words text-[15px] font-medium leading-7 text-slate-100">
                      {review.text}
                    </p>

                    {review.isSpoiler && (
                      <div className="pt-2 text-center">
                        <button
                          type="button"
                          onClick={() => toggleReveal(review.id)}
                          className="cursor-pointer text-xs font-black tracking-wide text-slate-400 transition hover:text-sky-400"
                        >
                          [ レビューを非表示にする ]
                        </button>
                      </div>
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