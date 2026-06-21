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

  if (!isMounted) {
    return (
      <div className="inline-flex h-9.5 w-44 items-center justify-center gap-2 rounded-xl border border-sky-500/20 bg-slate-900/10 text-sky-500/40 opacity-40">
        <Heart className="h-3.5 w-3.5" />
        <span className="text-xs font-bold tracking-wider">読み込み中</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggleFavorite}
      aria-pressed={isFavorite}

      className={`inline-flex h-9.5 w-44 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 transition-all duration-300 antialiased font-bold text-xs tracking-wider ${isFavorite
        ? "border-sky-400/50 bg-sky-500/10 text-sky-300 hover:border-sky-400 hover:bg-sky-500/20"
        : "border-sky-500/50 bg-slate-900/50 text-sky-400 hover:border-sky-400 hover:bg-sky-500/10 hover:text-sky-300"
        } ${isAnimating ? "scale-104" : "scale-100 active:scale-98"}`}
    >
      <Heart
        className={`h-3.5 w-3.5 transition-all duration-300 ${isFavorite
            ? "fill-sky-300 text-sky-300 stroke-[2.2]"
            : "text-sky-400 stroke-[2]"
          }`}
      />
      <span>{isFavorite ? "お気に入り登録中" : "お気に入りに追加"}</span>
    </button>
  );
}