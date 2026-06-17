import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <h1 className="text-sm font-bold tracking-[0.35em] text-white md:text-base">
          KOGE CINEMA NOTE
        </h1>

        <nav className="hidden gap-8 text-xs font-medium tracking-[0.2em] text-slate-400 md:flex">
          <a className="transition hover:text-sky-300" href="#">
            HOME
          </a>
          <a className="transition hover:text-sky-300" href="#">
            SEARCH
          </a>
          <Link className="transition hover:text-sky-300" href="/favorites">
            MY LIST
          </Link>
          <a className="transition hover:text-sky-300" href="#">
            REVIEW
          </a>
        </nav>
      </div>
    </header>
  );
}