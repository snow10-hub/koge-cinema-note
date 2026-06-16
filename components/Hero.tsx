export function Hero() {
  return (
    <>
      <p className="mb-4 text-sm tracking-[0.3em] text-sky-400">
        MOVIE NOTE
      </p>

      <h2 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
        Find your next favorite movie.
      </h2>

      <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
        次に観る、その一本を。映画との出会いを記録する、ダークトーンの映画ノート。
      </p>

      <div className="mt-10 flex max-w-2xl rounded-full border border-slate-700 bg-slate-900/80 p-2 shadow-2xl shadow-sky-950/40">
        <input
          type="text"
          placeholder="映画タイトルを検索..."
          className="flex-1 bg-transparent px-5 text-sm text-white outline-none placeholder:text-slate-500"
        />
        <button className="rounded-full bg-sky-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-400">
          Search
        </button>
      </div>
    </>
  );
}