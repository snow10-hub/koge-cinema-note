"use client";

import { useState } from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { MovieList } from "../components/MovieList";

type Movie = {
  id: number;
  title: string;
  year: string;
  rating: number;
  poster: string | null;
};

type TmdbMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
};

const initialMovies: Movie[] = [
  {
    id: 27205,
    title: "Inception",
    year: "2010",
    rating: 8.4,
    poster: "https://image.tmdb.org/t/p/w500/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg",
  },
  {
    id: 157336,
    title: "Interstellar",
    year: "2014",
    rating: 8.5,
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  },
  {
    id: 329,
    title: "Jurassic Park",
    year: "1993",
    rating: 8.0,
    poster: "https://image.tmdb.org/t/p/w500/63viWuPfYQjRYLSZSZNq7dglJP5.jpg",
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSearch() {
    if (!searchTerm.trim()) {
      setMovies(initialMovies);
      setErrorMessage("");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetch(
        `/api/search?query=${encodeURIComponent(searchTerm)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data: { results: TmdbMovie[] } = await response.json();

      const formattedMovies = data.results.map((movie) => ({
        id: movie.id,
        title: movie.title,
        year: movie.release_date ? movie.release_date.slice(0, 4) : "----",
        rating: Math.round(movie.vote_average * 10) / 10,
        poster: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
      }));

      setMovies(formattedMovies);
    } catch {
      setErrorMessage("映画データの取得に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto flex max-w-6xl flex-col px-6 py-20">
        <Hero
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={handleSearch}
          isLoading={isLoading}
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
          <MovieList movies={movies} />
        )}
      </section>
    </main>
  );
}