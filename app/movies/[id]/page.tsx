import Link from "next/link";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { getMovieDetails } from "../../../lib/tmdb";

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
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {backdropUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            backgroundImage: `url('${backdropUrl}')`,
          }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />

      <div className="relative z-10">
        <Header />
        
          <Link
            href="/"
            className="text-sm font-medium text-sky-300 transition hover:text-sky-200"
          >
            ← Back to search
          </Link>

          <section className="mt-12 grid gap-10 md:grid-cols-[320px_1fr] md:items-start">
            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-black/40">
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={`${movie.title} poster`}
                  className="w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[2/3] w-full items-center justify-center bg-slate-800 text-sm text-slate-400">
                  No Image
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-black/40 backdrop-blur-md">
              <p className="text-sm font-bold tracking-[0.3em] text-sky-300">
                MOVIE DETAIL
              </p>

              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="mt-4 text-lg italic text-slate-300">
                  {movie.tagline}
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
                <span className="rounded-full border border-slate-700 px-4 py-2">
                  {releaseYear}
                </span>

                {movie.runtime && (
                  <span className="rounded-full border border-slate-700 px-4 py-2">
                    {movie.runtime} min
                  </span>
                )}

                <span className="rounded-full border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-sky-300">
                  ★ {rating}
                </span>
              </div>

              {movie.genres.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-full bg-slate-800/80 px-3 py-1 text-xs text-slate-300"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-8">
                <h2 className="text-lg font-bold">Overview</h2>
                <p className="mt-3 leading-8 text-slate-300">
                  {movie.overview || "あらすじ情報はありません。"}
                </p>
              </div>
            </div>
          </section>
          <Footer />
        </div>
    </main>
  );
}