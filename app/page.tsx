"use client";

import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { MovieList } from "../components/MovieList";

type Movie = {
  id: number;
  title: string;
  year: string;
  rating: number;
  poster: string | null;
  backdrop: string | null;
};

type TmdbMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
};

function formatMovies(tmdbMovies: TmdbMovie[]): Movie[] {
  return tmdbMovies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    year: movie.release_date ? movie.release_date.slice(0, 4) : "----",
    rating: Math.round(movie.vote_average * 10) / 10,
    poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
    backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null,
  }));
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  
  // 🌟 追加: 現在のページ数を管理するステート
  const [currentPage, setCurrentPage] = useState(1);
  // 🌟 追加: 次のページがまだ存在するかどうかを判定するフラグ (全件読み込んだらView Moreを消すため)
  const [hasMore, setHasMore] = useState(true);

  // トレンド取得 (トレンドは追加読み込み不要にするため、常に1ページ固定)
  async function fetchTrendingMovies() {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setHasSearched(false);
      setCurrentPage(1);
      setHasMore(false); // トレンド時はView Moreを出さない

      const response = await fetch("/api/trending");
      if (!response.ok) throw new Error("Failed to fetch trending movies");

      const data: { results: TmdbMovie[] } = await response.json();
      setMovies(formatMovies(data.results));
    } catch (error) {
      console.error(error);
      setErrorMessage("話題作の取得に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  // 🌟 検索関数 (第1引数に「読み込みたいページ数」を受け取るように拡張)
  async function handleSearch(pageToFetch = 1) {
    if (!searchTerm.trim()) {
      fetchTrendingMovies();
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      setHasSearched(true);

      // 🌟 APIのRouteに &page=X を渡す (API側が対応している必要があります)
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(searchTerm)}&page=${pageToFetch}`
      );
      if (!response.ok) throw new Error("Failed to fetch movies");

      const data: { results: TmdbMovie[]; total_pages?: number } = await response.json();
      const newMovies = formatMovies(data.results);

      if (pageToFetch === 1) {
        // 🌟 初回検索時は結果を丸ごと置き換え
        setMovies(newMovies);
      } else {
        // 🌟 「View More」の時は、既存の映画リストの後ろに新しい20件をガッチャンコ！
        setMovies((prevMovies) => [...prevMovies, ...newMovies]);
      }

      // 現在のページ数をステートに保存
      setCurrentPage(pageToFetch);

      // TMDBの総ページ数（無ければデフォルト20等）と比較して、まだ次があるか判定
      const totalPages = data.total_pages ?? 1;
      setHasMore(pageToFetch < totalPages && data.results.length > 0);

    } catch (error) {
      console.error(error);
      setErrorMessage("映画データの取得に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setIsLoading(false);
    }
  }

  // 🌟 新しく「View More」ボタンを押したときの処理
  const handleLoadMore = () => {
    if (isLoading) return;
    const nextPage = currentPage + 1;
    handleSearch(nextPage);
  };

  const heroBackdrop = movies.find((movie) => movie.backdrop)?.backdrop ?? null;
  const movieListTitle = hasSearched ? "SEARCH RESULTS" : "TRENDING THIS WEEK";

  return (
    <main className="relative min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.14),_transparent_28%),linear-gradient(180deg,_rgba(2,6,23,0.2),_#020617_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-sky-500/10 to-transparent" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        {/* 🌟 フォームのEnterや検索ボタンの時は「必ず1ページ目から検索」させる */}
        <Hero
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={() => handleSearch(1)}
          isLoading={isLoading}
          backdropUrl={heroBackdrop}
        />

        <div className="flex-1 pb-24">
          {errorMessage && (
            <div className="mx-auto max-w-6xl px-6 mt-8">
              <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-200">
                {errorMessage}
              </p>
            </div>
          )}

          {/* 映画リスト表示エリア */}
          <MovieList movies={movies} title={movieListTitle} />

          {/* 🌟 追加: 「View More」ボタンエリア */}
          {hasSearched && hasMore && (
            <div className="mt-12 flex justify-center px-6">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="w-full max-w-xs cursor-pointer rounded-xl border border-sky-500/30 bg-sky-950/20 px-6 py-3.5 text-xs font-semibold tracking-widest text-sky-400 uppercase shadow-lg shadow-sky-950/20 backdrop-blur-md transition-all duration-300 hover:border-sky-400 hover:bg-sky-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isLoading ? "Loading..." : "View More"}
              </button>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </main>
  );
}