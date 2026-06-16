export function Header() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <h1 className="text-lg font-bold tracking-[0.25em] text-white">
        KOGE CINEMA
      </h1>

      <nav className="hidden gap-8 text-sm text-slate-300 md:flex">
        <a href="#">HOME</a>
        <a href="#">SEARCH</a>
        <a href="#">MY LIST</a>
        <a href="#">REVIEW</a>
      </nav>
    </header>
  );
}