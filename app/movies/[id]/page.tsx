import Link from "next/link";
import Image from "next/image";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { getMovieDetails, getMovieRecommendations } from "../../../lib/tmdb";
import { ReviewSection } from "../../../components/ReviewSection";
import { FavoriteButton } from "../../../components/FavoriteButton";
import { ExpandableOverview } from "../../../components/ExpandableOverview";
import { MovieCard } from "../../../components/MovieCard";

type MovieDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MovieDetailPage({
  params,
}: MovieDetailPageProps) {
  const { id } = await params;

  const [movie, recommendations] = await Promise.all([
    getMovieDetails(id),
    getMovieRecommendations(id),
  ]);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const releaseYear = movie.release_date
    ? movie.release_date.slice(0, 4)
    : "----";

  const rating = Math.round(movie.vote_average * 10) / 10;

  const recommendedMovies = recommendations.slice(0, 6).map((recommendedMovie) => ({
    id: recommendedMovie.id,
    title: recommendedMovie.title,
    year: recommendedMovie.release_date
      ? recommendedMovie.release_date.slice(0, 4)
      : "----",
    rating: Math.round(recommendedMovie.vote_average * 10) / 10,
    poster: recommendedMovie.poster_path
      ? `https://image.tmdb.org/t/p/w500${recommendedMovie.poster_path}`
      : null,
    backdrop: recommendedMovie.backdrop_path
      ? `https://image.tmdb.org/t/p/original${recommendedMovie.backdrop_path}`
      : null,
  }));

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-sky-500/30">
      {backdropUrl && (
        <div
          className="pointer-events-none absolute inset-0 scale-105 bg-cover bg-center opacity-15 blur-[2px]"
          style={{
            backgroundImage: `url('${backdropUrl}')`,
          }}
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-950/60" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />

        <div className="mx-auto w-full flex-1 max-w-6xl px-6 pb-20 pt-6 md:px-8 md:pb-24">
          <Link
            href="/"
            className="inline-flex select-none items-center text-xs font-bold uppercase tracking-wider text-slate-400 transition-colors hover:text-sky-400"
          >
            ← Back to discover
          </Link>

          <section className="mt-8">
            <div className="grid grid-cols-[128px_1fr] gap-5 sm:grid-cols-[160px_1fr] sm:gap-6 md:grid-cols-[220px_1fr] md:gap-8 lg:grid-cols-[240px_1fr]">
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900/65 shadow-2xl shadow-black/70">
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={`${movie.title} ポスター`}
                    fill
                    sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 220px, 240px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] font-bold uppercase tracking-wider text-slate-500 md:text-xs">
                    No Poster
                  </div>
                )}
              </div>

              <div className="min-w-0 self-center md:self-start md:pt-2">
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-sky-400 md:text-[10px]">
                  MOVIE DETAIL
                </p>

                <h1 className="mt-2 text-lg font-medium leading-tight tracking-tight text-white sm:text-2xl md:text-3xl lg:text-4xl">
                  {movie.title}
                </h1>

                {movie.tagline && (
                  <p className="mt-3 text-xs font-light leading-relaxed tracking-wide text-slate-300 sm:text-sm md:mt-4 md:text-slate-200/90">
                    {movie.tagline}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-1.5 text-[10px] font-bold tracking-wider text-slate-100 sm:gap-2 md:mt-5 md:text-[11px]">
                  <span className="rounded-full border border-slate-700/80 bg-slate-800/70 px-2.5 py-1 md:px-3">
                    {releaseYear}
                  </span>

                  {typeof movie.runtime === "number" && movie.runtime > 0 && (
                    <span className="rounded-full border border-slate-700/80 bg-slate-800/70 px-2.5 py-1 md:px-3">
                      {movie.runtime} MIN
                    </span>
                  )}

                  <span className="rounded-full border border-sky-500/40 bg-sky-500/15 px-2.5 py-1 font-black text-sky-300 shadow-[0_0_15px_rgba(14,165,233,0.12)] md:px-3">
                    TMDB ★ {rating.toFixed(1)}
                  </span>
                </div>

                {movie.genres.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="rounded-md border border-slate-700/80 bg-slate-800/70 px-2.5 py-1 text-[9px] font-bold tracking-wide text-slate-200 md:px-3 md:text-[10px]"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 md:mt-6">
                  <FavoriteButton
                    movie={{
                      id: movie.id,
                      title: movie.title,
                      poster: posterUrl,
                      year: releaseYear,
                      rating,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-slate-600/80 bg-slate-900/65 px-6 py-6 shadow-2xl shadow-black/70 backdrop-blur-md md:mt-10 md:p-8">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-200">
                Overview
              </h2>

              <ExpandableOverview overview={movie.overview || ""} />
            </div>
          </section>

          {recommendedMovies.length > 0 && (
            <section className="mt-12">
              <div className="mb-6 border-b border-white/5 pb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-sky-400">
                  RELATED
                </p>

                <h2 className="mt-2 text-lg font-medium uppercase tracking-widest text-white md:text-xl">
                  Recommended Movies
                </h2>

                <p className="mt-2.5 max-w-xl text-xs font-light leading-relaxed tracking-wide text-slate-300">
                  この作品に関連する映画をチェック。
                </p>
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-7 min-[390px]:grid-cols-3 min-[390px]:gap-x-2 sm:gap-x-4 sm:gap-y-8 md:grid-cols-4 lg:grid-cols-6">
                {recommendedMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>
          )}
          <ReviewSection key={movie.id} movieId={movie.id} />
        </div>

        <Footer />
      </div>
    </main>
  );
}