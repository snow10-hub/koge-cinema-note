import { Search } from "lucide-react";
import { useState } from "react";

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
  // 🌟 検索窓に入力している文字とは別に、「実際に検索確定した文字」をローカルで記憶する
  const [activeSearchTerm, setActiveSearchTerm] = useState("");

  // 🌟 判定：「背景画像があり」かつ「確定した検索文字が空ではない」時だけ映画背景にする
  // これにより、文字をチャカチャカ入力している最中は背景が変わりません！
  const showMovieBackdrop = backdropUrl && activeSearchTerm !== "";

  return (
    <section
      id="search"
      className="relative h-[48vh] w-full overflow-hidden bg-slate-950 md:h-[52vh] antialiased select-none"
    >
      {/* 🌟 背景エリア */}
      {showMovieBackdrop ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-50 scale-100 pointer-events-none filter blur-[0.5px]"
          style={{
            backgroundImage: `url('${backdropUrl}')`,
          }}
        />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80 pointer-events-none filter blur-[0.5px]"
          style={{
            backgroundImage: `url('/images/hero-default.webp')`,
          }}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/35 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />

      {/* Headerの開始位置と完全に一直線に揃うコンテナー */}


      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-6 md:px-8">

        {/* サブタイトル */}
        <p className="mb-3 text-[11px] font-semibold tracking-[0.25em] text-sky-400 uppercase">
          CINEMA DISCOVERY
        </p>

        {/* 🌟 メインコピー：文字の後ろに「ぼわっ」と広がる強めの発光シャドウをプラス */}
        <h2 className="max-w-xl text-3xl font-medium leading-[1.2] tracking-tight text-white drop-shadow-[0_0_25px_rgba(14,165,233,0.4)] md:text-4xl lg:text-5xl">
          Track, discover, and
          <br />
          remember your cinema.
        </h2>

        <p className="mt-4 max-w-md text-xs md:text-sm tracking-wide text-slate-200 font-normal drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          お気に入りの映画をストックし、次に観る一本をシネマティックに管理する。
        </p>

        {/* 検索フォーム */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!isLoading) {
              // 🌟 検索ボタンが押された瞬間に、今の入力文字を「確定文字」として保存！
              setActiveSearchTerm(searchTerm);
              onSearch();
            }
          }}
          className="mt-8 flex max-w-sm items-center rounded-xl border border-sky-400/50 bg-slate-950/80 p-1 shadow-2xl shadow-sky-950/40 backdrop-blur-md transition-all duration-300 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-400/20"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => {
              onSearchTermChange(event.target.value);
              // 💡 もし検索窓が完全に空っぽにされたら、背景をデフォルトに戻す
              if (event.target.value === "") {
                setActiveSearchTerm("");
              }
            }}
            placeholder="Search movies by title..."
            className="min-w-0 flex-1 bg-transparent px-4 py-2 text-xs md:text-sm text-white outline-none placeholder:text-slate-500 font-medium"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-sky-400 transition-all hover:bg-sky-500/10 hover:text-sky-300 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Search"
          >
            <Search size={16} strokeWidth={2.2} />
          </button>
        </form>
      </div>
    </section>
  );
}