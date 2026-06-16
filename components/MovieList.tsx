import { MovieCard } from "./MovieCard";

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

export function MovieList() {
  return (
    <section className="mt-20">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm tracking-[0.25em] text-sky-400">
            FEATURED
          </p>
          <h3 className="mt-3 text-3xl font-bold">Featured Movies</h3>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}