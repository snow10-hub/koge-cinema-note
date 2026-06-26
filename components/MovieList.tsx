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

  const description = isTrending
  ? "今週注目されている話題の作品をチェック。"
  : title === "SEARCH RESULTS"
    ? "検索結果を表示しています。気になる作品を選択して詳細を確認できます。"
    : "選択したジャンルの映画を表示しています。気になる作品を選択して詳細を確認できます。";

  const showFeatured = isTrending && movies.length > 0;
  const featuredMovie = showFeatured ? movies[0] : null;
  const gridMovies = showFeatured ? movies.slice(1) : movies;
  const featuredImage = featuredMovie?.backdrop ?? featuredMovie?.poster;

  return (
    <section className="mx-auto mt-12 max-w-6xl px-6 text-slate-200 antialiased md:mt-16 md:px-8">
      <div className="mb-8 border-b border-white/5 pb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-sky-400">
          {isTrending ? "FEATURED" : "DISCOVER"}
        </p>

        <h3 className="mt-2 text-lg font-medium uppercase tracking-widest text-white md:text-xl">
          {title}
        </h3>

        <p className="mt-2.5 max-w-xl text-xs font-light leading-relaxed tracking-wide text-slate-300">
          {description}
        </p>
      </div>

      {movies.length === 0 ? (
        <div className="rounded-xl border border-slate-700/70 bg-slate-900/70 px-6 py-16 text-center backdrop-blur-md">
          <p className="text-sm font-bold text-slate-300">No movies found.</p>
          <p className="mt-1 text-xs text-slate-500">
            検索結果が見つかりませんでした。正式タイトル、英題、または区切り記号を入れて検索してみてください。
          </p>
        </div>
      ) : (
        <>
          {featuredMovie && (
            <Link
              href={`/movies/${featuredMovie.id}`}
              className="group block select-none"
            >
              <article className="relative mb-8 overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900/65 shadow-2xl shadow-black/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-500/80 hover:bg-slate-900/75 hover:shadow-[0_0_28px_rgba(14,165,233,0.14)] md:mb-10">
                <div className="relative min-h-[240px] overflow-hidden sm:min-h-[260px] md:min-h-[320px]">
                  {featuredImage ? (
                    <Image
                      src={featuredImage}
                      alt={`${featuredMovie.title} 背景画像`}
                      fill
                      sizes="(max-width: 1280px) 100vw, 1200px"
                      className="object-cover transition duration-700 will-change-transform group-hover:scale-105 group-hover:opacity-70"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-slate-950" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/55 via-slate-950/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent" />

                  <div className="relative z-10 flex min-h-[240px] flex-col justify-center px-6 py-6 sm:min-h-[260px] md:min-h-[320px] md:px-12 md:py-8">
                    <div>
                      <p className="mb-3 w-fit rounded border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-sky-300">
                        WEEKLY NO.1
                      </p>

                      <h4 className="max-w-xl text-lg font-medium leading-tight tracking-tight text-white sm:text-xl md:text-3xl">
                        {featuredMovie.title}
                      </h4>

                      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] font-bold tracking-wider text-slate-300">
                        <span>{featuredMovie.year}</span>
                        <span className="h-0.5 w-0.5 rounded-full bg-slate-600" />
                        <span className="font-extrabold text-sky-300">
                          TMDB ★ {featuredMovie.rating.toFixed(1)}
                        </span>
                      </div>

                      <p className="mt-4 hidden max-w-md text-xs font-normal leading-relaxed text-slate-300/90 sm:block">
                        今週、最も注目されている作品。
                      </p>

                      <span className="mt-5 inline-block w-fit rounded-full bg-slate-100 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-950 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:bg-sky-400">
                        VIEW DETAILS
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          )}

          {gridMovies.length > 0 && (
            <div className="grid grid-cols-2 gap-x-3 gap-y-7 min-[390px]:grid-cols-3 min-[390px]:gap-x-2 sm:gap-x-4 sm:gap-y-8 md:grid-cols-4 lg:grid-cols-6">
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