"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

type FavoriteMovie = {
  id: number;
  title: string;
  poster: string | null;
  year: string;
  rating: number;
  addedAt: string;
};

type FavoriteButtonProps = {
  movie: {
    id: number;
    title: string;
    poster: string | null;
    year: string;
    rating: number;
  };
};

const STORAGE_KEY = "koge-cinema-favorites";

function getStoredFavorites(): FavoriteMovie[] {
  if (typeof window === "undefined") return []; // サーバーサイドでの安全対策
  const rawFavorites = localStorage.getItem(STORAGE_KEY);
  if (!rawFavorites) return [];

  try {
    return JSON.parse(rawFavorites) as FavoriteMovie[];
  } catch {
    return [];
  }
}

export function FavoriteButton({ movie }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  // 🌟追加: クライアント側でのマウント完了を管理するフラグ（チラつき防止）
  const [isMounted, setIsMounted] = useState(false);

  // 初回マウント時 ＆ 外部でlocalStorageが変わったイベントを検知して同期する
  useEffect(() => {
    setIsMounted(true);
    
    const syncFavoriteState = () => {
      const favorites = getStoredFavorites();
      setIsFavorite(favorites.some((favorite) => favorite.id === movie.id));
    };

    syncFavoriteState();

    // 🌟ドヤポイント: カスタムイベントをリッスンして、別コンポーネントの変化もリアルタイム検知
    window.addEventListener("koge_favorites_updated", syncFavoriteState);
    return () => window.removeEventListener("koge_favorites_updated", syncFavoriteState);
  }, [movie.id]);

  function handleToggleFavorite() {
    const favorites = getStoredFavorites();
    const alreadyFavorite = favorites.some((favorite) => favorite.id === movie.id);

    const nextFavorites = alreadyFavorite
      ? favorites.filter((favorite) => favorite.id !== movie.id)
      : [{ ...movie, addedAt: new Date().toISOString() }, ...favorites];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFavorites));
    setIsFavorite(!alreadyFavorite);

    // 🌟ドヤポイント: localStorageを更新したことをサイト全体に通知（ブロードキャスト）
    window.dispatchEvent(new Event("koge_favorites_updated"));

    setIsAnimating(true);
    window.setTimeout(() => {
      setIsAnimating(false);
    }, 180);
  }

  // 🌟マウントされる前（SSR時）は、レイアウトが崩れないように中立なボタンを置いてチラつきを完全に防ぐ
  if (!isMounted) {
    return (
      <div className="inline-flex h-12 w-44 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 text-slate-500 opacity-50">
        <Heart className="h-5 w-5" />
        読み込み中...
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggleFavorite}
      aria-pressed={isFavorite}
      className={`inline-flex h-12 w-44 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-black tracking-wide transition-all duration-300 antialiased select-none ${
        isFavorite
          ? "border-rose-500/40 bg-rose-500/10 text-rose-300 shadow-lg shadow-rose-950/20 hover:bg-rose-500/20"
          : "border-white/10 bg-white/5 text-slate-300 hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-sky-400"
      } ${isAnimating ? "scale-110" : "scale-100 active:scale-95"}`}
    >
      {/* fill-current のカラーをTailwindクラス側でより鮮やかに制御 */}
      <Heart className={`h-5 w-5 transition-transform duration-300 ${isFavorite ? "fill-rose-400 text-rose-400" : ""}`} />
      {isFavorite ? "SAVED" : "ADD TO LIST"}
    </button>
  );
}