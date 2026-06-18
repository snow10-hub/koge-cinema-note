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
  if (typeof window === "undefined") return [];
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const syncFavoriteState = () => {
      const favorites = getStoredFavorites();
      setIsFavorite(favorites.some((favorite) => favorite.id === movie.id));
    };

    syncFavoriteState();

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

    window.dispatchEvent(new Event("koge_favorites_updated"));

    setIsAnimating(true);
    window.setTimeout(() => {
      setIsAnimating(false);
    }, 180);
  }

  // マウント前のスケルトンも四角いモダン形状に合わせる
  if (!isMounted) {
    return (
      <div className="inline-flex h-10 w-40 items-center justify-center gap-2 rounded-xl border border-white/5 bg-slate-900/10 text-slate-600 opacity-40">
        <Heart className="h-4 w-4" />
        <span className="text-[10px] font-medium tracking-widest uppercase">LOADING</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggleFavorite}
      aria-pressed={isFavorite}
      /* 🌟 変更ポイント: 
         - h-12 ➔ h-10, w-44 ➔ w-40 にして少しシャープに凝縮
         - rounded-full ➔ rounded-xl にして角丸のトーンを統一
         - font-black text-sm ➔ font-medium text-[11px] tracking-widest にして文字に圧倒的な品を出す
      */
      className={`inline-flex h-10 w-40 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 transition-all duration-300 antialiased font-medium text-[11px] tracking-widest uppercase ${
        isFavorite
          ? "border-sky-500/20 bg-sky-500/10 text-sky-400 shadow-xl shadow-sky-950/20 hover:bg-sky-500/20"
          : "border-white/10 bg-slate-900/20 text-slate-300 hover:border-white/20 hover:bg-white/5 hover:text-white"
      } ${isAnimating ? "scale-105" : "scale-100 active:scale-98"}`}
    >
      {/* 🌟 変更ポイント: ハートも塗り潰しではなく、skyの細いラインで光るシネマティック仕様に */}
      <Heart 
        className={`h-4 w-4 transition-all duration-300 ${
          isFavorite ? "fill-sky-400/20 text-sky-400 stroke-[2.2]" : "stroke-[1.8]"
        }`} 
      />
      {isFavorite ? "IN MY LIST" : "ADD TO LIST"}
    </button>
  );
}