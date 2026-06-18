import Link from "next/link";
import { Bebas_Neue } from "next/font/google";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
});

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
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

        <nav className="flex items-center gap-5 text-xs font-bold tracking-[0.16em] text-slate-300 md:gap-7">
          <Link className="transition hover:text-sky-300" href="/">
            HOME
          </Link>

          <Link className="transition hover:text-sky-300" href="/#search">
            SEARCH
          </Link>

          <Link className="transition hover:text-sky-300" href="/favorites">
            MY LIST
          </Link>
        </nav>
      </div>
    </header>
  );
}