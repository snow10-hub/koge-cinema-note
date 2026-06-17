export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80 px-6 py-8 text-center text-xs text-slate-500">
      <p>
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
      <p className="mt-2">
        Movie data and images provided by{" "}
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noreferrer"
          className="text-sky-400 transition hover:text-sky-300"
        >
          TMDB
        </a>
        .
      </p>
    </footer>
  );
}