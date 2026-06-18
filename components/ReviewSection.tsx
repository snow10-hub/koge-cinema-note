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

export function ReviewSection({ movieId }: ReviewSectionProps) {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 🌟バグ回避: SSRとの整合性を保つため、初期値は絶対に空配列にする
  const [reviews, setReviews] = useState<Review[]>([]);
  // 開閉管理をシンプルなID配列に変更してコードを簡略化
  const [revealedReviewIds, setRevealedReviewIds] = useState<number[]>([]);

  // 🌟安全なデータ読み込み: コンポーネントがブラウザにマウントされた後に初めてlocalStorageを読む
  useEffect(() => {
    const rawReviews = localStorage.getItem(getStorageKey(movieId));
    if (rawReviews) {
      try {
        setReviews(JSON.parse(rawReviews) as Review[]);
      } catch (error) {
        console.error(error);
        setReviews([]);
      }
    } else {
      setReviews([]);
    }
    setRevealedReviewIds([]); // 映画が変わったら開閉状態もリセット
  }, [movieId]);

  const trimmedReview = reviewText.trim();
  const isOverLimit = reviewText.length > MAX_REVIEW_LENGTH;
  const canSubmit = trimmedReview.length > 0 && rating > 0 && !isOverLimit && !isSubmitting;

  // 平均点の計算
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
  }, [reviews]);

  // 各星ごとの分布グラフ用データ作成
  const ratingSummary = useMemo(() => {
    return [5, 4, 3, 2, 1].map((score) => {
      const count = reviews.filter((review) => review.rating === score).length;
      const percentage = reviews.length === 0 ? 0 : Math.round((count / reviews.length) * 100);
      return { score, count, percentage };
    });
  }, [reviews]);

  // ネタバレ表示のトグルスイッチ
  function toggleReveal(reviewId: number) {
    setRevealedReviewIds((current) =>
      current.includes(reviewId)
        ? current.filter((id) => id !== reviewId)
        : [...current, reviewId]
    );
  }

  // レビュー送信処理
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600)); // 送信シミュレーション

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
    <section className="mt-12 rounded-3xl border border-white/10 bg-slate-950/40 p-6 md:p-8 shadow-2xl shadow-black/50 backdrop-blur-md antialiased">
      {/* 見出し */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-white/5 pb-5">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-sky-400 uppercase">
            MY REVIEW
          </p>
          <h2 className="mt-1.5 text-xl font-bold tracking-wide text-white md:text-2xl">映画メモを残す</h2>
        </div>
        <p className="text-xs text-slate-400">星評価とネタバレ配慮つきで感想を保存できます。</p>
      </div>

      {/* レビュー統計エリア */}
      <div className="mt-6 rounded-2xl border border-white/5 bg-slate-900/20 p-5 backdrop-blur-sm">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">AVERAGE RATING</p>
            <p className="mt-1 text-3xl font-black text-slate-100">
              {averageRating > 0 ? averageRating.toFixed(1) : "-"}{" "}
              <span className="text-sm font-normal text-slate-500">/ 5.0</span>
            </p>
          </div>
          <p className="text-xs font-bold text-slate-400 tracking-wide">{reviews.length} REVIEWS</p>
        </div>

        {/* 5ツ星の棒グラフ */}
        <div className="mt-5 space-y-2.5">
          {ratingSummary.map((item) => (
            <div key={item.score} className="grid grid-cols-[48px_1fr_32px] items-center gap-3 text-xs font-bold">
              <span className="text-slate-400 text-right">{item.score} ★</span>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-900">
                <div
                  className="h-full rounded-full bg-sky-400 transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-right text-slate-500">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 投稿フォーム */}
      <form onSubmit={handleSubmit} className="mt-8">
        <div>
          <p className="mb-2 text-xs font-bold tracking-wider text-slate-400">YOUR RATING</p>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`cursor-pointer text-2xl transition-all duration-200 active:scale-95 hover:scale-110 ${
                  star <= rating ? "text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.3)]" : "text-slate-800"
                }`}
                aria-label={`${star}点をつける`}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-xs font-bold text-slate-500">
              {rating > 0 ? `${rating} / 5` : "SELECT STAR"}
            </span>
          </div>
        </div>

        <textarea
          value={reviewText}
          onChange={(event) => setReviewText(event.target.value)}
          placeholder="この映画の好きだったところ、余韻、ツッコミどころなどを書いてみる..."
          className="mt-5 min-h-32 w-full resize-none rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-sm leading-7 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-500/50 focus:bg-slate-900/60"
        />

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex w-fit cursor-pointer items-center gap-2 text-xs font-bold text-slate-400 select-none hover:text-slate-300">
            <input
              type="checkbox"
              checked={isSpoiler}
              onChange={(event) => setIsSpoiler(event.target.checked)}
              className="h-4 w-4 rounded border-slate-800 bg-slate-900 accent-sky-500"
            />
            ネタバレを含む
          </label>

          <p className={`text-xs font-bold ${isOverLimit ? "text-red-400" : "text-slate-500"}`}>
            {reviewText.length} / {MAX_REVIEW_LENGTH}文字
          </p>
        </div>

        {isOverLimit && (
          <p className="mt-2 text-xs font-medium text-red-400">200文字以内で入力してください。</p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-5 inline-flex cursor-pointer items-center justify-center rounded-full bg-slate-100 px-6 py-2.5 text-xs font-black tracking-widest text-slate-950 transition-all duration-300 hover:bg-sky-400 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30 disabled:scale-100 disabled:bg-slate-700 disabled:text-slate-400"
        >
          {isSubmitting ? "STORING..." : "ADD REVIEW"}
        </button>
      </form>

      {/* レビュー一覧表示 */}
      <div className="mt-10 space-y-4 border-t border-white/5 pt-8">
        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5 text-xs font-medium text-slate-500 text-center">
            まだレビューはありません。最初の映画メモを書いてみましょう。
          </div>
        ) : (
          reviews.map((review) => {
            const isRevealed = revealedReviewIds.includes(review.id);

            return (
              <article key={review.id} className="rounded-2xl border border-slate-800/60 bg-slate-900/20 p-5 shadow-sm">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-[11px] font-bold text-slate-500">
                  <div className="flex items-center gap-3">
                    <span>{review.createdAt}</span>
                    {/* 🌟 改善: ループ処理で星を一発描画。Tailwindで色をスマートに制御 */}
                    <span className="flex gap-0.5 tracking-none text-xs">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= review.rating ? "text-sky-400" : "text-slate-800"}>
                          ★
                        </span>
                      ))}
                    </span>
                  </div>

                  {review.isSpoiler && (
                    <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-[9px] font-black tracking-widest text-red-400 uppercase">
                      SPOILER
                    </span>
                  )}
                </div>

                {review.isSpoiler && !isRevealed ? (
                  <div className="rounded-xl bg-slate-950/40 border border-slate-900 p-4 text-center">
                    <p className="text-xs font-medium text-slate-400">
                      このレビューにはネタバレが含まれています。
                    </p>
                    <button
                      type="button"
                      onClick={() => toggleReveal(review.id)}
                      className="mt-2 cursor-pointer text-xs font-black tracking-widest text-sky-400 transition hover:text-sky-300 uppercase"
                    >
                      [ SHOW CONTENT ]
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-300">
                      {review.text}
                    </p>

                    {review.isSpoiler && (
                      <button
                        type="button"
                        onClick={() => toggleReveal(review.id)}
                        className="cursor-pointer text-xs font-black tracking-widest text-slate-500 transition hover:text-sky-400 uppercase"
                      >
                        [ HIDE CONTENT ]
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