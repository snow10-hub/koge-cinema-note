"use client";

import { useState } from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { MovieList } from "../components/MovieList";

const movies = [
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

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto flex max-w-6xl flex-col px-6 py-20">
        <Hero searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
        <MovieList movies={filteredMovies} />
      </section>
    </main>
  );
}