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

  const [activeSearchTerm, setActiveSearchTerm] = useState("");

  const showMovieBackdrop = backdropUrl && activeSearchTerm !== "";

  return (
    <section
      id="search"
      className="relative h-[56svh] min-h-[27rem] w-full overflow-hidden bg-slate-950 antialiased select-none md:h-[52vh] md:min-h-0"
    >

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

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-900/40 via-slate-900/5 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-6 md:px-8">
        <div className="relative max-w-md">
          {/* 網掛け用の背景 */}
          <div className="pointer-events-none absolute -inset-x-4 -inset-y-5 rounded-xl bg-slate-950/35" />

          {/* 中身 */}
          <div className="relative z-10">
            <p className="mb-3 text-[11px] font-semibold tracking-[0.25em] text-sky-400 uppercase">
              CINEMA DISCOVERY
            </p>

            <h2 className="max-w-xl text-3xl font-medium leading-[1.2] tracking-tight text-white drop-shadow-[0_0_25px_rgba(14,165,233,0.4)] md:text-4xl lg:text-5xl">
              Beyond the screen;
              <br />
              stay with the story.
            </h2>

            <p className="mt-4 max-w-md text-xs md:text-sm tracking-wide text-slate-200 font-normal drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              記憶のスクリーンに、色褪せない物語を。
            </p>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (!isLoading) {
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
        </div>
      </div>
    </section>
  );
}