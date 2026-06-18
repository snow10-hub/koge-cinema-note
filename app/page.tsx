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
    poster: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null,
    backdrop: movie.backdrop_path
      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
      : null,
  }));
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  async function fetchTrendingMovies() {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setHasSearched(false);

      const response = await fetch("/api/trending");

      if (!response.ok) {
        throw new Error("Failed to fetch trending movies");
      }

      const data: { results: TmdbMovie[] } = await response.json();
      setMovies(formatMovies(data.results));
    } catch {
      setErrorMessage(
        "話題作の取得に失敗しました。時間をおいて再度お試しください。"
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  async function handleSearch() {
    if (!searchTerm.trim()) {
      fetchTrendingMovies();
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      setHasSearched(true);

      const response = await fetch(
        `/api/search?query=${encodeURIComponent(searchTerm)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data: { results: TmdbMovie[] } = await response.json();
      setMovies(formatMovies(data.results));
    } catch {
      setErrorMessage(
        "映画データの取得に失敗しました。時間をおいて再度お試しください。"
      );
    } finally {
      setIsLoading(false);
    }
  }

  const heroBackdrop = movies.find((movie) => movie.backdrop)?.backdrop ?? null;
  const movieListTitle = hasSearched ? "Search Results" : "Trending This Week";

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.14),_transparent_28%),linear-gradient(180deg,_rgba(2,6,23,0.2),_#020617_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-sky-500/10 to-transparent" />

      <div className="relative z-10">
        <Header />

        <section className="mx-auto flex max-w-6xl flex-col px-6 pb-24 pt-8 md:pt-10">
          <Hero
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onSearch={handleSearch}
            isLoading={isLoading}
            backdropUrl={heroBackdrop}
          />

          {errorMessage && (
            <p className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-200">
              {errorMessage}
            </p>
          )}

          {isLoading ? (
            <div className="mt-20 rounded-3xl border border-slate-800 bg-slate-900/70 px-6 py-12 text-center">
              <p className="text-lg font-bold text-white">検索中...</p>
              <p className="mt-3 text-sm text-slate-400">
                映画データを取得しています。
              </p>
            </div>
          ) : (
            <MovieList movies={movies} title={movieListTitle} />
          )}
        </section>

        <Footer />
      </div>
    </main>
  );
}