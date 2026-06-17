type Movie = {
  id: number;
  title: string;
  year: string;
  rating: number;
  poster: string | null;
};

type MovieCardProps = {
  movie: Movie;
};

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-xl shadow-black/30 transition hover:-translate-y-1 hover:border-sky-500/60">
      {movie.poster ? (
        <img
          src={movie.poster}
          alt={`${movie.title} poster`}
          className="h-[420px] w-full object-cover"
        />
      ) : (
        <div className="flex h-[420px] w-full items-center justify-center bg-slate-800 text-sm text-slate-400">
          No Image
        </div>
      )}

      <div className="p-5">
        <div className="mb-3 flex items-center justify-between text-sm text-slate-400">
          <span>{movie.year}</span>
          <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sky-300">
            ★ {movie.rating}
          </span>
        </div>

        <h4 className="text-xl font-bold">{movie.title}</h4>
      </div>
    </article>
  );
}