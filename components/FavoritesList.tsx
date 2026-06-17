"use client";

import { Pin } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type FavoriteMovie = {
    id: number;
    title: string;
    poster: string | null;
    year: string;
    rating: number;
    addedAt: string;
    isPinned?: boolean;
};

type SortMode = "addedAt" | "year";

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

export function FavoritesList() {
    const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
    const [sortMode, setSortMode] = useState<SortMode>("addedAt");

    useEffect(() => {
        setFavorites(getStoredFavorites());
    }, []);

    const sortedFavorites = useMemo(() => {
        return [...favorites].sort((a, b) => {
            const pinCompare = Number(Boolean(b.isPinned)) - Number(Boolean(a.isPinned));

            if (pinCompare !== 0) {
                return pinCompare;
            }

            if (sortMode === "year") {
                return Number(b.year) - Number(a.year);
            }

            return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        });
    }, [favorites, sortMode]);

    function handleRemove(movieId: number) {
        const nextFavorites = favorites.filter((movie) => movie.id !== movieId);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFavorites));
        setFavorites(nextFavorites);
    }

    function handleTogglePin(movieId: number) {
        const nextFavorites = favorites.map((movie) =>
            movie.id === movieId
                ? {
                    ...movie,
                    isPinned: !movie.isPinned,
                }
                : movie
        );

        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFavorites));
        setFavorites(nextFavorites);
    }

    return (
        <section className="mx-auto max-w-6xl px-6 py-12">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-sm font-bold tracking-[0.3em] text-sky-300">
                        MY LIST
                    </p>
                    <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
                        お気に入り映画
                    </h1>
                    <p className="mt-3 text-sm text-slate-400">
                        保存した映画をあとから見返せます。
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                        {favorites.length} movies
                    </span>

                    <button
                        type="button"
                        onClick={() => setSortMode("addedAt")}
                        className={`cursor-pointer rounded-full px-4 py-2 text-sm font-bold transition ${sortMode === "addedAt"
                            ? "bg-sky-500 text-slate-950"
                            : "border border-white/10 bg-white/5 text-slate-300 hover:border-sky-400/60 hover:text-sky-200"
                            }`}
                    >
                        追加順
                    </button>

                    <button
                        type="button"
                        onClick={() => setSortMode("year")}
                        className={`cursor-pointer rounded-full px-4 py-2 text-sm font-bold transition ${sortMode === "year"
                            ? "bg-sky-500 text-slate-950"
                            : "border border-white/10 bg-white/5 text-slate-300 hover:border-sky-400/60 hover:text-sky-200"
                            }`}
                    >
                        公開年順
                    </button>
                </div>
            </div>

            {favorites.length === 0 ? (
                <div className="mt-10 rounded-3xl border border-white/10 bg-slate-900/70 p-10 text-center">
                    <p className="text-lg font-bold text-slate-200">
                        まだお気に入りはありません。
                    </p>
                    <p className="mt-3 text-sm text-slate-400">
                        映画詳細ページから「My Listに追加」を押すと、ここに保存されます。
                    </p>

                    <Link
                        href="/"
                        className="mt-6 inline-flex rounded-full bg-sky-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-400"
                    >
                        映画を探す
                    </Link>
                </div>
            ) : (
                <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
                    {sortedFavorites.map((movie) => (
                        <article
                            key={movie.id}
                            className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl shadow-black/30 transition hover:-translate-y-1 hover:border-sky-400/50"
                        >
                            <Link href={`/movies/${movie.id}`}>
                                {movie.poster ? (
                                    <img
                                        src={movie.poster}
                                        alt={`${movie.title} poster`}
                                        className="aspect-[2/3] w-full object-cover transition duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex aspect-[2/3] w-full items-center justify-center bg-slate-800 text-sm text-slate-400">
                                        No Image
                                    </div>
                                )}
                            </Link>

                            <div className="p-4">
                                <Link href={`/movies/${movie.id}`}>
                                    <h2 className="line-clamp-2 font-bold leading-6 text-slate-100 transition hover:text-sky-300">
                                        {movie.title}
                                    </h2>
                                </Link>

                                <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
                                    <span>{movie.year}</span>
                                    <span className="text-sky-300">★ {movie.rating}</span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleTogglePin(movie.id)}
                                    className={`mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition ${movie.isPinned
                                            ? "border-amber-300/60 bg-amber-400/10 text-amber-200"
                                            : "border-white/10 text-slate-300 hover:border-amber-300/60 hover:bg-amber-400/10 hover:text-amber-200"
                                        }`}
                                >
                                    <Pin className={`h-4 w-4 ${movie.isPinned ? "fill-current" : ""}`} />
                                    {movie.isPinned ? "次に観るリストから外す" : "次に観る"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleRemove(movie.id)}
                                    className="mt-4 w-full cursor-pointer rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-rose-400/60 hover:bg-rose-500/10 hover:text-rose-200"
                                >
                                    リストから削除
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}