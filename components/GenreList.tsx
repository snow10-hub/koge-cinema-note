type Genre = {
  id: number;
  name: string;
};

type GenreListProps = {
  genres: Genre[];
  selectedGenreId: number | null;
  isLoading: boolean;
  onSelectGenre: (genre: Genre) => void;
  onClearGenre: () => void;
};

export function GenreList({
  genres,
  selectedGenreId,
  isLoading,
  onSelectGenre,
  onClearGenre,
}: GenreListProps) {
  if (genres.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto mt-10 max-w-6xl px-6 text-slate-200 antialiased md:px-8">
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-sky-400">
          GENRES
        </p>

        <h2 className="mt-2 text-lg font-medium uppercase tracking-widest text-white md:text-xl">
          Browse by Genre
        </h2>

        <p className="mt-2.5 max-w-xl text-xs font-light leading-relaxed tracking-wide text-slate-300">
          気分に合わせてジャンルから映画を探せます。
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onClearGenre}
          disabled={isLoading}
          className={`cursor-pointer rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
            selectedGenreId === null
              ? "border-sky-400/70 bg-sky-500/15 text-sky-300 shadow-[0_0_14px_rgba(14,165,233,0.14)]"
              : "border-slate-700/80 bg-slate-900/60 text-slate-300 hover:border-sky-400/50 hover:bg-sky-500/10 hover:text-sky-300"
          }`}
        >
          ALL
        </button>

        {genres.map((genre) => (
          <button
            key={genre.id}
            type="button"
            onClick={() => onSelectGenre(genre)}
            disabled={isLoading}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-[10px] font-bold tracking-wider transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
              selectedGenreId === genre.id
                ? "border-sky-400/70 bg-sky-500/15 text-sky-300 shadow-[0_0_14px_rgba(14,165,233,0.14)]"
                : "border-slate-700/80 bg-slate-900/60 text-slate-300 hover:border-sky-400/50 hover:bg-sky-500/10 hover:text-sky-300"
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </section>
  );
}