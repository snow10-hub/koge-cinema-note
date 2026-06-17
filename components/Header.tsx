import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <h1 className="text-sm font-bold tracking-[0.35em] text-white md:text-base">
          KOGE CINEMA NOTE
        </h1>

        <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
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