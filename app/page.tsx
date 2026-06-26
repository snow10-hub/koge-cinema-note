"use client";

import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { GenreList } from "../components/GenreList";
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

type Genre = {
  id: number;
  name: string;
};

type TmdbMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
};

type ViewMode = "trending" | "search" | "genre";

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
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [heroBackdropUrl, setHeroBackdropUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("trending");

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  async function fetchTrendingMovies() {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setViewMode("trending");
      setSelectedGenre(null);
      setCurrentPage(1);
      setHasMore(false);
      setHeroBackdropUrl(null);

      const response = await fetch("/api/trending");

      if (!response.ok) {
        throw new Error("Failed to fetch trending movies");
      }

      const data: { results: TmdbMovie[] } = await response.json();
      setMovies(formatMovies(data.results));
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "話題作の取得に失敗しました。時間をおいて再度お試しください。"
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [trendingResponse, genresResponse] = await Promise.all([
          fetch("/api/trending"),
          fetch("/api/genres"),
        ]);

        if (!trendingResponse.ok) {
          throw new Error("Failed to fetch trending movies");
        }

        if (!genresResponse.ok) {
          throw new Error("Failed to fetch genres");
        }

        const trendingData: { results: TmdbMovie[] } =
          await trendingResponse.json();

        const genresData: { genres: Genre[] } = await genresResponse.json();

        const formattedMovies = formatMovies(trendingData.results);

        setMovies(formattedMovies);
        setGenres(genresData.genres);
        setViewMode("trending");
        setSelectedGenre(null);
        setCurrentPage(1);
        setHasMore(false);
        setHeroBackdropUrl(null);
        setErrorMessage("");

      } catch (error) {
        console.error(error);
        setErrorMessage(
          "映画情報の取得に失敗しました。時間をおいて再度お試しください。"
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadInitialData();
  }, []);

  async function handleSearch(pageToFetch = 1) {
    if (!searchTerm.trim()) {
      fetchTrendingMovies();
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      setViewMode("search");

      if (pageToFetch === 1) {
        setSelectedGenre(null);
        setHeroBackdropUrl(null);
      }

      const response = await fetch(
        `/api/search?query=${encodeURIComponent(searchTerm)}&page=${pageToFetch}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data: { results: TmdbMovie[]; total_pages?: number } =
        await response.json();

      const newMovies = formatMovies(data.results);

      if (pageToFetch === 1) {
        setMovies(newMovies);
        setHeroBackdropUrl(
          newMovies.find((movie) => movie.backdrop)?.backdrop ?? null
        );
      } else {
        setMovies((prevMovies) => [...prevMovies, ...newMovies]);
      }

      setCurrentPage(pageToFetch);

      const totalPages = data.total_pages ?? 1;
      setHasMore(pageToFetch < totalPages && data.results.length > 0);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "映画データの取得に失敗しました。時間をおいて再度お試しください。"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGenreSearch(genre: Genre, pageToFetch = 1) {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setViewMode("genre");

      if (pageToFetch === 1) {
        setSelectedGenre(genre);
        setSearchTerm("");
        setHeroBackdropUrl(null);
      }

      const response = await fetch(
        `/api/discover?genreId=${genre.id}&page=${pageToFetch}`
      );

      if (!response.ok) {
        throw new Error("Failed to discover movies");
      }

      const data: { results: TmdbMovie[]; total_pages?: number } =
        await response.json();

      const newMovies = formatMovies(data.results);

      if (pageToFetch === 1) {
        setMovies(newMovies);
      } else {
        setMovies((prevMovies) => [...prevMovies, ...newMovies]);
      }

      setCurrentPage(pageToFetch);

      const totalPages = data.total_pages ?? 1;
      setHasMore(pageToFetch < totalPages && data.results.length > 0);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "ジャンル別映画の取得に失敗しました。時間をおいて再度お試しください。"
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleLoadMore() {
    if (isLoading) return;

    const nextPage = currentPage + 1;

    if (viewMode === "search") {
      handleSearch(nextPage);
      return;
    }

    if (viewMode === "genre" && selectedGenre) {
      handleGenreSearch(selectedGenre, nextPage);
    }
  }

  const movieListTitle =
    viewMode === "search"
      ? "SEARCH RESULTS"
      : viewMode === "genre" && selectedGenre
        ? `${selectedGenre.name} MOVIES`
        : "TRENDING THIS WEEK";

  return (
    <main className="relative min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.14),_transparent_28%),linear-gradient(180deg,_rgba(2,6,23,0.2),_#020617_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-sky-500/10 to-transparent" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />

        <Hero
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={() => handleSearch(1)}
          isLoading={isLoading}
          backdropUrl={heroBackdropUrl}
        />

        <div className="flex-1 pb-24">
          {errorMessage && (
            <div className="mx-auto mt-8 max-w-6xl px-6 md:px-8">
              <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-200">
                {errorMessage}
              </p>
            </div>
          )}

          <GenreList
            genres={genres}
            selectedGenreId={selectedGenre?.id ?? null}
            isLoading={isLoading}
            onSelectGenre={(genre) => handleGenreSearch(genre, 1)}
            onClearGenre={fetchTrendingMovies}
          />

          <MovieList movies={movies} title={movieListTitle} />

          {viewMode !== "trending" && hasMore && (
            <div className="mt-12 flex justify-center px-6 md:px-8">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoading}
                className="w-full max-w-xs cursor-pointer rounded-full bg-slate-100 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-950 transition-all duration-300 hover:scale-105 hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700/70 disabled:text-slate-300 disabled:opacity-80 disabled:hover:scale-100"
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