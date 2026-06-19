import Link from "next/link";
import Image from "next/image";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { getMovieDetails } from "../../../lib/tmdb";
import { ReviewSection } from "../../../components/ReviewSection";
import { FavoriteButton } from "../../../components/FavoriteButton";

type MovieDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MovieDetailPage({
  params,
}: MovieDetailPageProps) {
  const { id } = await params;
  const movie = await getMovieDetails(id);

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

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-950/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />

        <div className="mx-auto flex-1 w-full max-w-5xl px-6 pb-24 pt-6">
          <Link
            href="/"
            className="inline-flex select-none items-center text-xs font-bold uppercase tracking-wider text-slate-400 transition-colors hover:text-sky-400"
          >
            ← Back to discover
          </Link>

          <section className="mt-8 grid gap-8 md:grid-cols-[240px_1fr] md:items-start">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900/65 shadow-2xl shadow-black/70">
              {posterUrl ? (
                <Image
                  src={posterUrl}
                  alt={`${movie.title} ポスター`}
                  fill
                  sizes="(max-width: 768px) 100vw, 240px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-bold uppercase tracking-wider text-slate-500">
                  No Poster
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-600/80 bg-slate-900/65 p-6 shadow-2xl shadow-black/70 backdrop-blur-md md:p-8">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-400">
                MOVIE DETAIL
              </p>

              <div className="mt-3 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <h1 className="text-2xl font-medium leading-tight tracking-tight text-white md:text-3xl lg:text-4xl">
                  {movie.title}
                </h1>

                <div className="shrink-0">
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

              {movie.tagline && (
                <p className="mt-6 text-sm font-light leading-relaxed tracking-wide text-slate-200/90 antialiased">
                  <span className="relative inline-block pl-3 before:absolute before:left-0 before:top-0 before:h-full before:w-[1px] before:bg-gradient-to-b before:from-sky-400/60 before:to-transparent">
                    {movie.tagline}
                  </span>
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-bold tracking-wider text-slate-100">
                <span className="rounded-full border border-slate-700/80 bg-slate-800/70 px-3 py-1">
                  {releaseYear}
                </span>

                {movie.runtime && (
                  <span className="rounded-full border border-slate-700/80 bg-slate-800/70 px-3 py-1">
                    {movie.runtime} MIN
                  </span>
                )}

                <span className="rounded-full border border-sky-500/40 bg-sky-500/15 px-3 py-1 font-black text-sky-300 shadow-[0_0_15px_rgba(14,165,233,0.12)]">
                  TMDB ★ {rating.toFixed(1)}
                </span>
              </div>

              {movie.genres.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded border border-slate-700/80 bg-slate-800/70 px-2 py-0.5 text-[10px] font-bold tracking-wide text-slate-200"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-8">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-200">
                  Overview
                </h2>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-200">
                  {movie.overview || "あらすじ情報はありません。"}
                </p>
              </div>
            </div>
          </section>

          <ReviewSection movieId={movie.id} />
        </div>

        <Footer />
      </div>
    </main>
  );
}