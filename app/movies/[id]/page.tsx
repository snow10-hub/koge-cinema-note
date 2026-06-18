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
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-200 selection:bg-sky-500/30">

      {/* 背景の巨大バックドロップ：不透明度を 35% ➔ 15% に落としてクールな闇を強調 */}
      {backdropUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 scale-105 pointer-events-none filter blur-[2px]"
          style={{
            backgroundImage: `url('${backdropUrl}')`,
          }}
        />
      )}

      {/* グラデーションをより深くして映画館の静寂を演出 */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-950/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <div className="mx-auto max-w-5xl w-full px-6 pb-24 pt-6 flex-1">

          {/* バックリンク：サイズをキュッと小さく（text-xs） */}
          <Link
            href="/"
            className="inline-flex items-center text-xs font-bold tracking-wider text-slate-500 uppercase transition-colors hover:text-sky-400 select-none"
          >
            ← Back to discover
          </Link>

          {/* グリッド幅を 320px ➔ 240px に絞ってスマートな比率に */}
          <section className="mt-8 grid gap-8 md:grid-cols-[240px_1fr] md:items-start">

            {/* ポスターエリア：余計な膨らみを無くしシャープに */}
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 shadow-2xl shadow-black/80">
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
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-600 font-bold uppercase tracking-wider">
                  No Poster
                </div>
              )}
            </div>

            {/* 詳細情報カード：背景の透過度を上げてスッキリ、線の色を細く */}
            <div className="rounded-2xl border border-slate-800/60 bg-slate-900/20 p-6 md:p-8 shadow-2xl shadow-black/50 backdrop-blur-xl">

              <p className="text-[10px] font-black tracking-[0.3em] text-sky-400 uppercase">
                MOVIE DETAIL
              </p>

              {/* タイトル部：大看板と完全にシンクロさせた、上品で色気のある特大フォントへ変更 */}
              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-white/5 pb-5">
                {/* 🌟 修正ポイント: font-black ➔ font-medium に落とし、大看板と同じスマートな佇まいに統一 */}
                <h1 className="text-2xl font-medium tracking-tight text-white md:text-3xl lg:text-4xl leading-tight">
                  {movie.title}
                </h1>


                {/* ボタンのサイズも内部で引き締まっているので綺麗に並びます */}
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

              {/* キャッチコピー：映画の字幕やパンフの1節のような、色気のあるセリフ体スタイル */}
              {movie.tagline && (
                <p className="mt-6 text-[13px] font-serif italic font-light tracking-widest leading-relaxed text-slate-300/90 antialiased">
                  <span className="relative inline-block pl-3 before:absolute before:left-0 before:top-0 before:h-full before:w-[1px] before:bg-gradient-to-b before:from-sky-500/40 before:to-transparent">
                    {movie.tagline}
                  </span>
                </p>
              )}

              {/* メタタグ群：余白（px-4 py-2 ➔ px-3 py-1）を極限まで薄くシャープに */}
              <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-bold tracking-wider text-slate-400">
                <span className="rounded-full border border-slate-800 bg-slate-900/30 px-3 py-1">
                  {releaseYear}
                </span>

                {movie.runtime && (
                  <span className="rounded-full border border-slate-800 bg-slate-900/30 px-3 py-1">
                    {movie.runtime} MIN
                  </span>
                )}

                <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-sky-400 font-black">
                  TMDB ★ {rating.toFixed(1)}
                </span>
              </div>

              {/* ジャンルタグ */}
              {movie.genres.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded bg-slate-900/60 border border-slate-800/40 px-2 py-0.5 text-[10px] font-bold text-slate-400 tracking-wide uppercase"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* あらすじ：文字サイズを落とし、フォントの色を薄く（slate-400）して長文の圧迫感を排除 */}
              <div className="mt-8 border-t border-white/5 pt-6">
                <h2 className="text-xs font-black tracking-widest text-slate-400 uppercase">Overview</h2>
                <p className="mt-3 text-xs md:text-sm leading-relaxed text-slate-400 tracking-wide whitespace-pre-wrap">
                  {movie.overview || "あらすじ情報はありません。"}
                </p>
              </div>

            </div>
          </section>

          {/* 下部レビューセクション */}
          <ReviewSection movieId={movie.id} />
        </div>

        <Footer />
      </div>
    </main>
  );
}