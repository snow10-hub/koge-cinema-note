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
    <Link href={`/movies/${movie.id}`} className="group block h-full select-none">
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900/65 shadow-xl shadow-black/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-500/80 hover:bg-slate-900/75">
        
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950/60">
          {movie.poster ? (
            <Image
              src={movie.poster}
              alt={`${movie.title} ポスター`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
              className="object-cover transition duration-500 will-change-transform group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-slate-700 tracking-wider">
              NO IMAGE
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-3">
          <div className="mb-1.5 flex items-center justify-between gap-2 text-[10px] font-bold tracking-wide text-slate-500">
            <span>{movie.year}</span>
            <span className="shrink-0 font-extrabold text-sky-400/90">★ {movie.rating.toFixed(1)}</span>
          </div>

          <div className="flex flex-1 items-start">
            <h4 className="line-clamp-2 text-xs font-medium tracking-tight leading-snug text-slate-300 transition-colors duration-200 group-hover:text-white md:text-[13px]">
              {movie.title}
            </h4>
          </div>

        </div>
      </article>
    </Link>
  );
}