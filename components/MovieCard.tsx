import Link from "next/link";
import Image from "next/image";

type Movie = {
  id: number;
  title: string;
  year: string;
  rating: number;
  poster: string | null;
  backdrop: string | null;
};

type MovieCardProps = {
  movie: Movie;
};

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movies/${movie.id}`} className="block">
      <article className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-xl shadow-black/30 transition hover:-translate-y-1 hover:border-sky-500/60">
        {movie.poster ? (
          <Image
            src={movie.poster}
            alt={`${movie.title} poster`}
            width={500}
            height={750}
            className="aspect-[2/3] w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-[420px] w-full items-center justify-center bg-slate-800 text-sm text-slate-400">
            No Image
          </div>
        )}

        <div className="p-5">
          <div className="mb-3 flex items-center justify-between text-sm text-slate-400">
            <span>{movie.year}</span>
            <span className="text-sky-300">TMDB ★ {movie.rating}</span>
          </div>

          <h4 className="text-xl font-bold">{movie.title}</h4>
        </div>
      </article>
    </Link>
  );
}