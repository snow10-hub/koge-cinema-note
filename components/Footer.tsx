import Link from "next/link";
import { Bebas_Neue } from "next/font/google";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
});

export function Footer() {
  return (
    <footer className="border-t border-white/20 bg-slate-950/90 py-8 text-xs text-slate-500">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 md:flex-row md:items-center md:justify-between md:px-8">
        <Link href="/" className="group block">
          <span
            className={`${bebasNeue.className} block text-2xl tracking-widest text-white drop-shadow-md transition group-hover:text-sky-200 md:text-3xl`}
          >
            KOGE CINEMA NOTE
          </span>

          <span className="mt-1 block text-[10px] font-medium tracking-wide text-slate-400 md:text-[11px]">
            映画を探して、あなたの物語を残す場所。
          </span>
        </Link>

        <div className="space-y-1 leading-relaxed md:text-right">
          <p>
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </p>

          <p>
            Movie data and images provided by{" "}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-sky-400 transition hover:text-sky-300"
            >
              TMDB
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}