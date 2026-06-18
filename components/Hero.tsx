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
    <section
      id="search"
      className="relative h-[50vh] w-full overflow-hidden bg-slate-950 md:h-[60vh] antialiased"
    >
      {/* 背景画像レイヤー */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: backdropUrl ? `url('${backdropUrl}')` : undefined,
        }}
      />

      {/* プロのグラデーションベール（横と縦をシンプルに統合・最適化） */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

      {/* 左右のパディングを px-6 md:px-8 に統一。ヘッダーやMovieListと完全に一直線に揃う */}
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-6 md:px-8">
        
        <p className="mb-4 text-sm font-bold tracking-[0.16em] text-sky-300">
          MOVIE NOTE
        </p>

        <h2 className="max-w-xl text-4xl font-bold leading-[1.15] tracking-tight text-white drop-shadow-xl md:text-6xl">
          次に観る、
          <br />
          その一本を。
        </h2>

        <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
          映画との出会いを、もっと特別に。
        </p>

        {/* 検索フォーム */}
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
            className="cursor-pointer border-l border-slate-700 px-5 py-4 text-xl text-white transition hover:bg-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="映画を検索"
          >
            <Search size={22} strokeWidth={2.2} />
          </button>
        </form>
      </div>
    </section>
  );
}