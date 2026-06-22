"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import Link from "next/link";
import { Bebas_Neue } from "next/font/google";
import { Moon } from "lucide-react";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
});

const navLinkClass =
  "relative py-1.5 transition hover:text-sky-300 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-sky-400 after:transition-all after:duration-300 after:content-[''] hover:after:w-full";

const mobileNavLinkClass =
  "block rounded-lg border border-white/10 bg-slate-900/70 px-4 py-3 text-sm tracking-[0.18em] text-slate-200 transition hover:border-sky-400/40 hover:bg-sky-500/10 hover:text-sky-300";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleSearchClick(event: MouseEvent<HTMLAnchorElement>) {
    setIsMenuOpen(false);

    if (window.location.pathname !== "/") {
      return;
    }

    event.preventDefault();

    window.setTimeout(() => {
      document.getElementById("search")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.history.replaceState(null, "", "#search");
    }, 120);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-slate-950/80 backdrop-blur-xl antialiased">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        <Link href="/" className="group block min-w-0 pr-4">
          <span
            className={`${bebasNeue.className} block text-2xl tracking-widest text-white drop-shadow-md transition group-hover:text-sky-200 sm:text-3xl md:text-4xl`}
          >
            KOGE CINEMA NOTE
          </span>

          <span className="mt-1 block max-w-[13rem] text-[10px] font-medium tracking-wide text-slate-400 sm:max-w-none md:text-xs">
            物語をめくる、私だけの映画館。
          </span>
        </Link>

        <nav
          className={`${bebasNeue.className} hidden items-center gap-5 text-sm tracking-[0.18em] text-slate-300 md:flex md:gap-8 md:text-base`}
        >
          <Link className={navLinkClass} href="/">
            HOME
          </Link>

          <Link className={navLinkClass} href="/#search" onClick={handleSearchClick}>
            SEARCH
          </Link>

          <Link className={navLinkClass} href="/favorites">
            MY LIST
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-slate-900/70 text-sky-300 shadow-lg shadow-black/40 transition hover:border-sky-400/50 hover:bg-sky-500/10 hover:text-sky-200 md:hidden"
          aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={isMenuOpen}
        >
          <Moon
            size={19}
            strokeWidth={2.1}
            className={`transition duration-300 ${
              isMenuOpen ? "rotate-[-90deg] fill-sky-300/20" : ""
            }`}
          />
        </button>
      </div>

      <div
        className={`grid overflow-hidden bg-slate-950/95 shadow-2xl shadow-black/50 transition-all duration-300 ease-out md:hidden ${
          isMenuOpen
            ? "grid-rows-[1fr] border-t border-white/10 opacity-100 translate-y-0"
            : "grid-rows-[0fr] border-t border-transparent opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <nav
            className={`${bebasNeue.className} mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4`}
          >
            <Link
              className={mobileNavLinkClass}
              href="/"
              onClick={() => setIsMenuOpen(false)}
            >
              HOME
            </Link>

            <Link
              className={mobileNavLinkClass}
              href="/#search"
              onClick={handleSearchClick}
            >
              SEARCH
            </Link>

            <Link
              className={mobileNavLinkClass}
              href="/favorites"
              onClick={() => setIsMenuOpen(false)}
            >
              MY LIST
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}