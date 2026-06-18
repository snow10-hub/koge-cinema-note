import Link from "next/link";
import { Bebas_Neue } from "next/font/google";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
});

// pb-1.5 を追加して、文字と下線の間に美しい「隙間」を確保
const navLinkClass =
  "relative pb-1.5 transition hover:text-sky-300 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-sky-400 after:transition-all after:duration-300 after:content-[''] hover:after:w-full";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl antialiased">
      {/* 左右のパディングを md:px-8 でシンプルに整理。max-w-6xl との一体感を強化 */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        
        {/* ロゴエリア */}
        <Link href="/" className="group block">
          <span
            className={`${bebasNeue.className} block text-3xl tracking-widest text-white drop-shadow-md transition group-hover:text-sky-200 md:text-4xl`}
          >
            KOGE CINEMA NOTE
          </span>
          <span className="mt-1 block text-[11px] font-medium tracking-wide text-slate-400 md:text-xs">
            映画を探して、あなたの物語を残す場所。
          </span>
        </Link>

        {/* ナビゲーション */}
        <nav
          className={`${bebasNeue.className} flex items-center gap-5 text-sm tracking-[0.18em] text-slate-300 md:gap-8 md:text-base`}
        >
          <Link className={navLinkClass} href="/">
            HOME
          </Link>

          <Link className={navLinkClass} href="/#search">
            SEARCH
          </Link>

          <Link className={navLinkClass} href="/favorites">
            MY LIST
          </Link>
        </nav>
      </div>
    </header>
  );
}