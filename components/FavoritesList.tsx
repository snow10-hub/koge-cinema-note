"use client";

import Image from "next/image";
import { Pin, Trash2, Film } from "lucide-react";
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
    if (typeof window === "undefined") return [];
    const rawFavorites = localStorage.getItem(STORAGE_KEY);
    if (!rawFavorites) return [];

    try {
        return JSON.parse(rawFavorites) as FavoriteMovie[];
    } catch {
        return [];
    }
}

export function FavoritesList() {
    const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
    const [sortMode, setSortMode] = useState<SortMode>("addedAt");
    const [isMounted, setIsMounted] = useState(false); // 🌟ハイドレーションエラー防止

    // 初回ロード ＆ 外部の更新電波を受信してリアルタイム同期
    useEffect(() => {
        setIsMounted(true);
        const loadFavorites = () => {
            setFavorites(getStoredFavorites());
        };

        loadFavorites();

        // 🌟詳細ページのハートボタンを押した時と完全に連動させる
        window.addEventListener("koge_favorites_updated", loadFavorites);
        return () => window.removeEventListener("koge_favorites_updated", loadFavorites);
    }, []);

    // ソートロジック（ピン留めが最上位）
    const sortedFavorites = useMemo(() => {
        return [...favorites].sort((a, b) => {
            const pinCompare = Number(Boolean(b.isPinned)) - Number(Boolean(a.isPinned));
            if (pinCompare !== 0) return pinCompare;

            if (sortMode === "year") {
                return Number(b.year) - Number(a.year);
            }
            return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        });
    }, [favorites, sortMode]);

    // リストから削除
    function handleRemove(movieId: number) {
        const nextFavorites = favorites.filter((movie) => movie.id !== movieId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFavorites));
        setFavorites(nextFavorites);
        
        // 全体に同期電波を発信
        window.dispatchEvent(new Event("koge_favorites_updated"));
    }

    // ピン留めトグル
    function handleTogglePin(movieId: number) {
        const nextFavorites = favorites.map((movie) =>
            movie.id === movieId ? { ...movie, isPinned: !movie.isPinned } : movie
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFavorites));
        setFavorites(nextFavorites);
        
        // 全体に同期電波を発信
        window.dispatchEvent(new Event("koge_favorites_updated"));
    }

    // マウント前は静かなローディングを表示
    if (!isMounted) {
        return (
            <div className="mx-auto max-w-5xl px-6 py-24 text-center">
                <p className="text-xs tracking-widest text-slate-500 uppercase animate-pulse">Loading list...</p>
            </div>
        );
    }

    return (
        <section className="mx-auto max-w-5xl px-6 py-12 antialiased text-slate-200">
            
            {/* ヘッダー：文字サイズを絞り、字間をあけてスタイリッシュに */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-white/5 pb-5">
                <div>
                    <p className="text-[10px] font-black tracking-[0.3em] text-sky-400 uppercase">
                        MY LIST
                    </p>
                    <h1 className="mt-1 text-2xl font-black tracking-tight text-white md:text-3xl uppercase">
                        MY FAVORITES
                    </h1>
                </div>

                {/* 操作エリア：フォントサイズを text-xs に落とし、大ぶりな要素を排除 */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                    <span className="rounded-full border border-slate-900 bg-slate-950 px-3 py-1.5 text-slate-500 tracking-wider">
                        {favorites.length} MOVIES
                    </span>

                    <button
                        type="button"
                        onClick={() => setSortMode("addedAt")}
                        className={`cursor-pointer rounded-full px-3.5 py-1.5 tracking-wide transition-all ${
                            sortMode === "addedAt"
                                ? "bg-slate-100 text-slate-950 font-black"
                                : "border border-slate-800/80 bg-slate-900/20 text-slate-400 hover:text-sky-400 hover:border-sky-500/30"
                        }`}
                    >
                        追加順
                    </button>

                    <button
                        type="button"
                        onClick={() => setSortMode("year")}
                        className={`cursor-pointer rounded-full px-3.5 py-1.5 tracking-wide transition-all ${
                            sortMode === "year"
                                ? "bg-slate-100 text-slate-950 font-black"
                                : "border border-slate-800/80 bg-slate-900/20 text-slate-400 hover:text-sky-400 hover:border-sky-500/30"
                        }`}
                    >
                        公開年順
                    </button>
                </div>
            </div>

            {favorites.length === 0 ? (
                /* 空状態のプレースホルダー：引き締まったダークトーン */
                <div className="mt-12 rounded-2xl border border-slate-900 bg-slate-900/10 p-12 text-center backdrop-blur-md">
                    <p className="text-sm font-bold text-slate-400">
                        Your list is currently empty.
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                        映画詳細ページから「My Listに追加」を押すと、ここに保存されます。
                    </p>
                    <Link
                        href="/"
                        className="mt-6 inline-flex rounded-full bg-slate-100 px-5 py-2 text-[11px] font-black tracking-widest text-slate-950 transition-all hover:bg-sky-400 hover:scale-105 shadow-md uppercase"
                    >
                        Find Movies
                    </Link>
                </div>
            ) : (
                /* グリッド：横幅をスマートにレスポンシブ化（スマホ2列、PC4列） */
                <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4">
                    {sortedFavorites.map((movie) => (
                        <article
                            key={movie.id}
                            className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-900 bg-slate-900/20 shadow-xl shadow-black/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/30 hover:bg-slate-900/40"
                        >
                            {/* ポスター画像エリア：アスペクト比 2:3 固定 ＆ レスポンシブ最適化 */}
                            <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
                                <Link href={`/movies/${movie.id}`} className="block h-full w-full">
                                    {movie.poster ? (
                                        <Image
                                            src={movie.poster}
                                            alt={`${movie.title} poster`}
                                            fill
                                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                            className="object-cover transition duration-500 will-change-transform group-hover:scale-102"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-slate-700 tracking-wider">
                                            NO IMAGE
                                        </div>
                                    )}
                                </Link>
                                
                                {/* ピン留め中のリッチミニマルバッジ */}
                                {movie.isPinned && (
                                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-md bg-amber-400 px-2 py-0.5 text-[8px] font-black tracking-wider text-slate-950 shadow-sm">
                                        <Pin className="h-2 w-2 fill-current" />
                                        NEXT
                                    </div>
                                )}
                            </div>

                            {/* テキスト ＆ ボタンコンテンツ */}
                            <div className="flex flex-1 flex-col p-3">
                                <div className="mb-1 flex items-center justify-between text-[11px] font-bold tracking-wide text-slate-500">
                                    <span>{movie.year}</span>
                                    <span className="text-sky-400/90 font-extrabold">★ {movie.rating.toFixed(1)}</span>
                                </div>

                                <div className="flex flex-1 items-start">
                                    <Link href={`/movies/${movie.id}`} className="block w-full">
                                        <h2 className="line-clamp-2 text-xs font-bold leading-normal text-slate-300 transition-colors group-hover:text-white">
                                            {movie.title}
                                        </h2>
                                    </Link>
                                </div>

                                {/* 操作ボタン群：主張を抑えた極細の線と11px文字 */}
                                <div className="mt-3 space-y-1.5 border-t border-white/5 pt-2.5">
                                    <button
                                        type="button"
                                        onClick={() => handleTogglePin(movie.id)}
                                        className={`inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border py-1.5 text-[10px] font-bold tracking-wide transition-all duration-200 active:scale-98 ${
                                            movie.isPinned
                                                ? "border-amber-400/30 bg-amber-400/5 text-amber-300"
                                                : "border-slate-800/80 text-slate-500 hover:border-amber-400/30 hover:text-amber-300"
                                        }`}
                                    >
                                        <Pin className={`h-2.5 w-2.5 ${movie.isPinned ? "fill-current" : ""}`} />
                                        {movie.isPinned ? "UNPIN" : "PIN TO NEXT"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleRemove(movie.id)}
                                        className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent py-1.5 text-[10px] font-bold tracking-wide text-slate-600 transition-all duration-200 active:scale-98 hover:border-rose-500/20 hover:bg-rose-500/5 hover:text-rose-400"
                                    >
                                        <Trash2 className="h-2.5 w-2.5" />
                                        REMOVE
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