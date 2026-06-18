import { Search } from "lucide-react";

type HeroProps = {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  backdropUrl: string | null;
};

export function Hero({
  searchTerm,
  onSearchTermChange,
  onSearch,
  isLoading,
  backdropUrl,
}: HeroProps) {
  return (
    <section id="search" className="relative overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl shadow-black/40">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-45"
        style={{
          backgroundImage: backdropUrl ? `url('${backdropUrl}')` : undefined,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/20" />

      <div className="relative z-10 px-8 py-20 md:px-16 md:py-28">
        <p className="mb-5 text-sm font-bold tracking-[0.3em] text-sky-300">
          MOVIE NOTE
        </p>

        <h2 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
          次に観る、
          <br />
          その一本を。
        </h2>

        <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
          映画との出会いを、もっと特別に。観たい作品も、心に残った感想も、
          ひとつの場所に記録する映画ノート。
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSearch();
          }}
          className="mt-10 flex max-w-xl items-center border border-sky-400/50 bg-slate-950/70 shadow-lg shadow-sky-950/40 backdrop-blur-md"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder="映画タイトルを検索..."
            className="min-w-0 flex-1 bg-transparent px-5 py-4 text-sm text-white outline-none placeholder:text-slate-500"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer disabled:cursor-not-allowed border-l border-slate-700 px-5 py-4 text-xl text-white transition hover:bg-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="映画を検索"
          >
            <Search size={22} strokeWidth={2.2} />
          </button>
        </form>
      </div>
    </section>
  );
}