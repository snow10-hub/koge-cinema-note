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
  // 検索結果かトレンドかで説明文をスマートに出し分け
  const description =
    title === "SEARCH RESULTS"
      ? "検索したキーワードに近い映画を表示しています。気になる作品を選んで詳細をチェックできます。"
      : "今週注目されている映画を、ポスターから気軽にチェック。";

  // 🌟プロのバグ回避ロジック:
  // 「話題の映画」かつ「データが豊富にある時」だけ大看板（Featured）を有効化する
  const isTrending = title === "TRENDING THIS WEEK";
  const showFeatured = isTrending && movies.length > 0;

  const featuredMovie = showFeatured ? movies[0] : null;
  // 大看板を表示する場合は2枚目から、検索結果の場合は1枚目からすべてグリッドに回す
  const gridMovies = showFeatured ? movies.slice(1) : movies;
  const featuredImage = featuredMovie?.backdrop ?? featuredMovie?.poster;

  return (
    <section className="mx-auto max-w-6xl px-6 mt-16 md:mt-24 antialiased">
      
      {/* セクション見出し */}
      <div className="mb-8 border-b border-white/5 pb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sky-400">
          {isTrending ? "FEATURED" : "DISCOVER"}
        </p>
        <h3 className="mt-1.5 text-xl font-bold tracking-wide text-white md:text-2xl">
          {title}
        </h3>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
          {description}
        </p>
      </div>

      {/* 1件もヒットしなかった場合のプレースホルダー */}
      {movies.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 px-6 py-16 text-center backdrop-blur-md">
          <p className="text-base font-bold text-white">
            該当する映画が見つかりませんでした
          </p>
          <p className="mt-2 text-xs text-slate-400">
            別のキーワードで検索してみてください。
          </p>
        </div>
      ) : (
        <>
          {/* 🌟 大看板エリア（話題の映画のトップ1位だけがこの豪華なガワをまとえる） */}
          {featuredMovie && (
            <Link href={`/movies/${featuredMovie.id}`} className="group block select-none">
              <article className="relative mb-12 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 shadow-2xl shadow-black/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/50 hover:shadow-sky-950/20">
                <div className="relative min-h-[300px] overflow-hidden md:min-h-[380px]">
                  {featuredImage ? (
                    <Image
                      src={featuredImage}
                      alt={`${featuredMovie.title} 背景画像`}
                      fill
                      sizes="(max-width: 1280px) 100vw, 1200px"
                      className="object-cover opacity-60 transition duration-700 will-change-transform group-hover:scale-[1.03] group-hover:opacity-70"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-slate-900" />
                  )}

                  {/* 映画館の暗闇を再現するシネマグラデーション */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                  {/* 大看板の中身のテキスト */}
                  <div className="relative z-10 flex min-h-[300px] flex-col justify-end px-6 py-8 md:min-h-[380px] md:px-10 md:py-10">
                    <p className="mb-4 w-fit rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.25em] text-sky-400">
                      Pick Up
                    </p>

                    <h4 className="max-w-2xl text-2xl font-black leading-tight text-white drop-shadow-xl md:text-5xl tracking-wide">
                      {featuredMovie.title}
                    </h4>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-300 tracking-wider">
                      <span>{featuredMovie.year}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-600" />
                      <span className="text-sky-400 font-extrabold">TMDB ★ {featuredMovie.rating}</span>
                    </div>

                    <p className="mt-5 max-w-xl text-xs md:text-sm leading-7 text-slate-400 hidden sm:block">
                      今週最も注目されている話題の作品。ポスターだけでは伝わらない壮大な世界観を、作品詳細から今すぐチェック。
                    </p>

                    <span className="mt-6 w-fit rounded-full bg-slate-100 px-5 py-2.5 text-[11px] font-black tracking-widest text-slate-950 transition-all duration-300 group-hover:bg-sky-400 group-hover:scale-105 shadow-md">
                      VIEW DETAILS
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          )}

          {/* 🌟 映画カード一覧（残りの映画、または検索結果のすべてがここに並ぶ） */}
          {gridMovies.length > 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
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