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
    // 全体が一枚のカードとして高さを統一できるように h-full を維持
    <Link href={`/movies/${movie.id}`} className="group block h-full select-none">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 shadow-xl shadow-black/30 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/50 hover:bg-slate-900/70 hover:shadow-sky-950/20">
        
        {/* ポスター画像エリア（アスペクト比 2:3 固定） */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
          {movie.poster ? (
            <Image
              src={movie.poster}
              alt={`${movie.title} ポスター`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
              className="object-cover transition duration-500 will-change-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-medium text-slate-500">
              NO IMAGE
            </div>
          )}
        </div>

        {/* テキストコンテンツエリア */}
        {/* flex-1 をつけて下の余白まで自動で引き伸ばす */}
        <div className="flex flex-1 flex-col p-3 md:p-3.5">
          
          {/* メタ情報（公開年 ＆ 評価） */}
          <div className="mb-2 flex items-center justify-between gap-2 text-[11px] font-bold tracking-wider text-slate-400">
            <span>{movie.year}</span>
            <span className="shrink-0 text-sky-400 font-extrabold">TMDB ★{movie.rating}</span>
          </div>

          {/* 映画タイトル */}
          {/* flex-1 と flex items-start を駆使することで、固定高さを指定しなくても綺麗に上下が揃う */}
          <div className="flex flex-1 items-start">
            <h4 className="line-clamp-2 text-sm font-bold leading-snug text-slate-100 transition-colors group-hover:text-white md:text-[15px]">
              {movie.title}
            </h4>
          </div>

        </div>
      </article>
    </Link>
  );
}