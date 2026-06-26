"use client";

import Image from "next/image";
import { Pin, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";

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

function getFavoritesSnapshot() {
    if (typeof window === "undefined") return "[]";
    return localStorage.getItem(STORAGE_KEY) ?? "[]";
}

function getServerFavoritesSnapshot() {
    return "[]";
}

function subscribeFavorites(callback: () => void) {
    if (typeof window === "undefined") return () => { };

    window.addEventListener("koge_favorites_updated", callback);
    window.addEventListener("storage", callback);

    return () => {
        window.removeEventListener("koge_favorites_updated", callback);
        window.removeEventListener("storage", callback);
    };
}

function parseFavoritesSnapshot(snapshot: string): FavoriteMovie[] {
    try {
        return JSON.parse(snapshot) as FavoriteMovie[];
    } catch {
        return [];
    }
}

function getSortableYear(year: string) {
    const parsedYear = Number(year);
    return Number.isNaN(parsedYear) ? 0 : parsedYear;
}

export function FavoritesList() {
    const [sortMode, setSortMode] = useState<SortMode>("addedAt");

    const favoritesSnapshot = useSyncExternalStore(
        subscribeFavorites,
        getFavoritesSnapshot,
        getServerFavoritesSnapshot
    );

    const favorites = useMemo(
        () => parseFavoritesSnapshot(favoritesSnapshot),
        [favoritesSnapshot]
    );

    const sortedFavorites = useMemo(() => {
        return [...favorites].sort((a, b) => {
            const pinCompare = Number(Boolean(b.isPinned)) - Number(Boolean(a.isPinned));
            if (pinCompare !== 0) return pinCompare;

            if (sortMode === "year") {
                return getSortableYear(b.year) - getSortableYear(a.year);
            }
            return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        });
    }, [favorites, sortMode]);

    function handleRemove(movieId: number, movieTitle: string) {
        const isConfirmed = window.confirm(`本当に「${movieTitle}」をお気に入りから削除しますか？`);
        if (!isConfirmed) return;

        const nextFavorites = favorites.filter((movie) => movie.id !== movieId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFavorites));
        window.dispatchEvent(new Event("koge_favorites_updated"));
    }

    function handleTogglePin(movieId: number) {
        const nextFavorites = favorites.map((movie) =>
            movie.id === movieId ? { ...movie, isPinned: !movie.isPinned } : movie
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFavorites));
        window.dispatchEvent(new Event("koge_favorites_updated"));
    }

    return (
        <section className="mx-auto max-w-6xl px-6 py-12 antialiased text-slate-200 md:px-8">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-white/5 pb-5">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-sky-400">
                        COLLECTION
                    </p>
                    <h1 className="mt-1.5 text-lg font-medium tracking-widest text-white md:text-xl uppercase">
                        MY FAVORITES
                    </h1>
                    <p className="mt-2 text-xs font-light tracking-wide text-slate-300 leading-relaxed">
                        ストックしたお気に入りの映画一覧。
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                    <span className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1.5 text-slate-200 tracking-wider">
                        お気に入り: {favorites.length} 件
                    </span>

                    <button
                        type="button"
                        onClick={() => setSortMode("addedAt")}
                        className={`cursor-pointer rounded-full px-3.5 py-1.5 tracking-wide transition-all ${sortMode === "addedAt"
                            ? "bg-slate-100 text-slate-950 font-black"
                            : "border border-slate-700 bg-slate-900/40 text-slate-300 hover:text-sky-400 hover:border-sky-500/50"
                            }`}
                    >
                        追加順
                    </button>

                    <button
                        type="button"
                        onClick={() => setSortMode("year")}
                        className={`cursor-pointer rounded-full px-3.5 py-1.5 tracking-wide transition-all ${sortMode === "year"
                            ? "bg-slate-100 text-slate-950 font-black"
                            : "border border-slate-700 bg-slate-900/40 text-slate-300 hover:text-sky-400 hover:border-sky-500/50"
                            }`}
                    >
                        公開年順
                    </button>
                </div>
            </div>

            {favorites.length === 0 ? (
                <div className="mt-12 rounded-2xl border border-slate-900 bg-slate-900/10 p-12 text-center backdrop-blur-md">
                    <p className="text-sm font-bold text-slate-300">
                        お気に入りリストは空っぽです。
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        映画詳細ページから「My Listに追加」を押すと、ここに保存されます。
                    </p>
                    <Link
                        href="/"
                        className="mt-6 inline-flex rounded-full bg-slate-100 px-5 py-2 text-xs font-black tracking-widest text-slate-950 transition-all hover:bg-sky-400 hover:scale-105"
                    >
                        映画を探しにいく
                    </Link>
                </div>
            ) : (

                <div className="mt-8 grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-5">
                    {sortedFavorites.map((movie) => (
                        <article
                            key={movie.id}
                            className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900/65 shadow-xl shadow-black/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-500/80 hover:bg-slate-900/75"
                        >

                            <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
                                <Link href={`/movies/${movie.id}`} className="block h-full w-full">
                                    {movie.poster ? (
                                        <Image
                                            src={movie.poster}
                                            alt={`${movie.title} ポスター`}
                                            fill
                                            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                            className="object-cover transition duration-500 will-change-transform group-hover:scale-[1.02]"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-slate-400 tracking-wider">
                                            NO IMAGE
                                        </div>
                                    )}
                                </Link>

                                {movie.isPinned && (
                                    <div className="absolute top-2 left-2 flex items-center gap-1 rounded bg-amber-400 px-1.5 py-0.5 text-[8px] font-black tracking-wider text-slate-950 shadow-sm">
                                        <Pin className="h-2 w-2 fill-current" />
                                        次に観る
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-1 flex-col p-3.5">
                                <div className="mb-1.5 flex items-center justify-between text-[11px] font-bold tracking-wide text-slate-200">
                                    <span>{movie.year} 年</span>
                                    <span className="text-sky-400 font-extrabold">★ {movie.rating.toFixed(1)}</span>
                                </div>

                                <div className="flex flex-1 items-start">
                                    <Link href={`/movies/${movie.id}`} className="block w-full">
                                        <h2 className="line-clamp-2 text-sm font-bold leading-snug text-white transition-colors">
                                            {movie.title}
                                        </h2>
                                    </Link>
                                </div>

                                <div className="mt-4 space-y-2 border-t border-white/5 pt-3">
                                    <button
                                        type="button"
                                        onClick={() => handleTogglePin(movie.id)}
                                        className={`inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border py-2 text-[11px] font-bold tracking-wide transition-all duration-200 active:scale-[0.98] ${movie.isPinned
                                            ? "border-amber-400/70 bg-amber-400/10 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.1)]"
                                            : "border-slate-700/80 bg-slate-800/70 text-slate-200 hover:border-amber-400/60 hover:bg-amber-400/5 hover:text-amber-300"
                                            }`}
                                    >
                                        <Pin className={`h-2.5 w-2.5 ${movie.isPinned ? "fill-current" : ""}`} />
                                        {movie.isPinned ? "ピン留め解除" : "次に観る"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleRemove(movie.id, movie.title)}
                                        className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-slate-700/80 bg-slate-800/70 py-2 text-[11px] font-bold tracking-wide text-slate-300 transition-all duration-200 active:scale-[0.98] hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-400"
                                    >
                                        <Trash2 className="h-2.5 w-2.5" />
                                        削除する
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}