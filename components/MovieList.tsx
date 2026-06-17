import { MovieCard } from "./MovieCard";

type Movie = {
  id: number;
  title: string;
  year: string;
  rating: number;
  poster: string | null;
  backdrop: string | null;
};

type MovieListProps = {
  movies: Movie[];
};

export function MovieList({ movies }: MovieListProps) {
  return (
    <section className="mt-20">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm tracking-[0.25em] text-sky-400">FEATURED</p>
          <h3 className="mt-3 text-3xl font-bold">Featured Movies</h3>
        </div>
      </div>

      {movies.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 px-6 py-12 text-center">
          <p className="text-lg font-bold text-white">
            該当する映画が見つかりませんでした
          </p>
          <p className="mt-3 text-sm text-slate-400">
            別のキーワードで検索してみてください。
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
}