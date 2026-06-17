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
  const rawFavorites = localStorage.getItem(STORAGE_KEY);

  if (!rawFavorites) {
    return [];
  }

  try {
    return JSON.parse(rawFavorites) as FavoriteMovie[];
  } catch {
    return [];
  }
}

export function FavoriteButton({ movie }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const favorites = getStoredFavorites();
    setIsFavorite(favorites.some((favorite) => favorite.id === movie.id));
  }, [movie.id]);

  function handleToggleFavorite() {
    const favorites = getStoredFavorites();
    const alreadyFavorite = favorites.some(
      (favorite) => favorite.id === movie.id
    );

    const nextFavorites = alreadyFavorite
      ? favorites.filter((favorite) => favorite.id !== movie.id)
      : [
          {
            ...movie,
            addedAt: new Date().toISOString(),
          },
          ...favorites,
        ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFavorites));
    setIsFavorite(!alreadyFavorite);

    setIsAnimating(true);
    window.setTimeout(() => {
      setIsAnimating(false);
    }, 180);
  }

  return (
    <button
      type="button"
      onClick={handleToggleFavorite}
      aria-pressed={isFavorite}
      className={`inline-flex h-12 w-44 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-bold transition duration-200 ${
        isFavorite
          ? "border-rose-400/60 bg-rose-500/15 text-rose-200 shadow-lg shadow-rose-950/30"
          : "border-white/10 bg-white/5 text-slate-200 hover:border-sky-400/60 hover:bg-sky-500/10 hover:text-sky-200"
      } ${isAnimating ? "scale-110" : "scale-100"}`}
    >
      <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
      {isFavorite ? "保存済み" : "My Listに追加"}
    </button>
  );
}