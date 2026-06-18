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
      className="relative h-[48vh] w-full overflow-hidden bg-slate-950 md:h-[52vh] antialiased select-none"
    >
      {/* 背景画像レイヤー */}
      {backdropUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-25 scale-100 pointer-events-none filter blur-[0.5px]"
          style={{
            backgroundImage: `url('${backdropUrl}')`,
          }}
        />
      )}

      {/* 薄いシネマティックグラデーション */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/10" />

      {/* Headerの開始位置と完全に一直線に揃うコンテナー */}
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-6 md:px-8">
        
        {/* サブタイトル */}
        <p className="mb-3 text-[11px] font-semibold tracking-[0.25em] text-sky-400 uppercase">
          CINEMA DISCOVERY
        </p>

        {/* メインコピー */}
        <h2 className="max-w-xl text-3xl font-medium leading-[1.2] tracking-tight text-white md:text-4xl lg:text-5xl">
          Track, discover, and
          <br />
          remember your cinema.
        </h2>

        {/* 説明文 */}
        <p className="mt-4 max-w-md text-xs md:text-sm tracking-wide text-slate-400 font-normal opacity-90">
          お気に入りの映画をストックし、次に観る一本をシネマティックに管理する。
        </p>

        {/* 検索フォーム */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            // 🌟 確実にイベントを発火させる
            if (!isLoading) {
              onSearch();
            }
          }}
          className="mt-8 flex max-w-sm items-center rounded-xl border border-white/10 bg-slate-950/50 p-1 shadow-2xl shadow-black/60 backdrop-blur-md transition-all duration-300 focus-within:border-sky-500/40 focus-within:bg-slate-950/80"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder="Search movies by title..."
            className="min-w-0 flex-1 bg-transparent px-4 py-2 text-xs md:text-sm text-white outline-none placeholder:text-slate-500 font-medium"
          />

          <button
            type="submit"
            disabled={isLoading}
            // 🌟 クリック領域（h-9 w-9）を少しだけ広げ、確実にボタンとして機能するように修正
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Search"
          >
            <Search size={16} strokeWidth={2.2} />
          </button>
        </form>
      </div>
    </section>
  );
}