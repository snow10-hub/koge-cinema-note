"use client";

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

const genreButtonBaseClass =
  "shrink-0 cursor-pointer rounded-full border px-3 py-1.5 text-[10px] font-bold tracking-wider transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50";

const genreButtonActiveClass =
  "border-sky-400/70 bg-sky-500/15 text-sky-300 shadow-[0_0_14px_rgba(14,165,233,0.14)]";

const genreButtonInactiveClass =
  "border-slate-700/80 bg-slate-900/60 text-slate-300 hover:border-sky-400/50 hover:bg-sky-500/10 hover:text-sky-300";

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

      <div className="relative -mx-6 md:mx-0">
        <div className="flex gap-2 overflow-x-auto pl-6 pr-14 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
          <button
            type="button"
            onClick={onClearGenre}
            disabled={isLoading}
            className={`${genreButtonBaseClass} uppercase ${selectedGenreId === null
                ? genreButtonActiveClass
                : genreButtonInactiveClass
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
              className={`${genreButtonBaseClass} ${selectedGenreId === genre.id
                  ? genreButtonActiveClass
                  : genreButtonInactiveClass
                }`}
            >
              {genre.name}
            </button>
          ))}
        </div>

        <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent md:hidden" />
      </div>
    </section>
  );
}