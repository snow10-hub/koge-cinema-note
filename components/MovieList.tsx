import Image from "next/image";
import Link from "next/link";
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
  title: string;
};

export function MovieList({ movies, title }: MovieListProps) {
  const isTrending = title === "TRENDING THIS WEEK";
  
  const description =
    title === "SEARCH RESULTS"
      ? "検索結果を表示しています。気になる作品を選択して詳細を確認できます。"
      : "今週注目されている話題の作品をチェック。";

  const showFeatured = isTrending && movies.length > 0;
  const featuredMovie = showFeatured ? movies[0] : null;
  
  // 🌟 検索結果（SEARCH RESULTS）の時は movies をそのまま20件すべて表示します
  const gridMovies = showFeatured ? movies.slice(1) : movies;
  const featuredImage = featuredMovie?.backdrop ?? featuredMovie?.poster;

  return (
    <section className="mx-auto max-w-6xl px-6 mt-12 md:mt-16 antialiased text-slate-200">
      
      {/* セクション見出し */}
      <div className="mb-8 border-b border-white/5 pb-4">
        {/* カテゴリ：字間をさらに広げてロゴっぽく佇ませる */}
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-sky-400">
          {isTrending ? "FEATURED" : "DISCOVER"}
        </p>
        
        {/* メイン見出し：大文字（uppercase）を活かし、字間を広くあけてスマートな中太（font-medium）に */}
        <h3 className="mt-1.5 text-lg font-medium tracking-widest text-white md:text-xl uppercase">
          {title}
        </h3>
        
        {/* サブ説明文：サイズを12px(text-xs)に上げつつ、font-lightで上品に佇ませる */}
        <p className="mt-2.5 max-w-xl text-xs font-light tracking-wide text-slate-400/90 leading-relaxed">
          {description}
        </p>
      </div>

      {movies.length === 0 ? (
        <div className="rounded-xl border border-slate-900 bg-slate-900/10 px-6 py-16 text-center backdrop-blur-md">
          <p className="text-sm font-bold text-slate-400">
            No movies found.
          </p>
          <p className="mt-1 text-xs text-slate-600">
            別のキーワードで検索してみてください。
          </p>
        </div>
      ) : (
        <>

          {featuredMovie && (
            <Link href={`/movies/${featuredMovie.id}`} className="group block select-none">
              <article className="relative mb-10 overflow-hidden rounded-xl border border-white/10 bg-slate-900/10 shadow-2xl shadow-black/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/20">
                <div className="relative min-h-[260px] overflow-hidden md:min-h-[320px]">
                  {featuredImage ? (
                    <Image
                      src={featuredImage}
                      alt={`${featuredMovie.title} 背景画像`}
                      fill
                      sizes="(max-width: 1280px) 100vw, 1200px"
                      className="object-cover opacity-45 transition duration-700 will-change-transform group-hover:scale-101 group-hover:opacity-55"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-slate-950" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

                  <div className="relative z-10 flex min-h-[260px] flex-col justify-center px-6 py-6 md:min-h-[320px] md:px-12 md:py-8">
                    <div>
                      <p className="mb-3 w-fit rounded bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-sky-400">
                        WEEKLY NO.1
                      </p>

                      <h4 className="max-w-xl text-xl font-medium leading-tight text-white md:text-3xl tracking-tight">
                        {featuredMovie.title}
                      </h4>

                      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-400 tracking-wider">
                        <span>{featuredMovie.year}</span>
                        <span className="h-0.5 w-0.5 rounded-full bg-slate-700" />
                        <span className="text-sky-400/90 font-extrabold">TMDB ★ {featuredMovie.rating.toFixed(1)}</span>
                      </div>

                      <p className="mt-4 max-w-md text-xs leading-relaxed text-slate-400 font-normal hidden sm:block opacity-80">
                        今週、世界中で最も多くの映画ファンにチェックされているトップラインナップ作品。
                      </p>

                      <span className="mt-5 inline-block w-fit rounded-full bg-slate-100 px-4 py-1.5 text-[10px] font-black tracking-widest text-slate-950 transition-all duration-300 group-hover:bg-sky-400 group-hover:scale-103 shadow-md uppercase">
                        VIEW DETAILS
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          )}

          {/* 🌟 映画カード一覧エリア（検索時・トレンド時のグリッド） */}
          {gridMovies.length > 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {gridMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}