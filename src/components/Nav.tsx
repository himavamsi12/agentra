"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { GitHubIcon, LogoMark } from "./icons";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${
        scrolled
          ? "border-ash bg-parchment/75 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-[1432px] items-center justify-between px-5 sm:h-20 sm:px-10"
      >
        <a
          href="#top"
          className="flex items-center gap-2 rounded-full font-mono text-label font-medium lowercase text-off-black"
        >
          <LogoMark className="size-5" />
          agentra
          <span className="sr-only"> — home</span>
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="hairline-hover inline-flex size-10 items-center justify-center rounded-full border border-ash text-off-black sm:h-11 sm:w-auto sm:gap-2 sm:px-5"
          >
            <GitHubIcon className="size-[18px]" />
            <span className="hidden text-body-sm uppercase sm:inline">GitHub</span>
            <span className="sr-only">Agentra on GitHub (opens in a new tab)</span>
          </a>
          <a
            href="#early-access"
            className="inline-flex h-10 items-center rounded-full bg-off-black px-4 text-caption uppercase text-parchment transition-colors hover:bg-ink sm:h-11 sm:px-6 sm:text-body-sm"
          >
            Get early access
          </a>
        </div>
      </nav>
    </header>
  );
}
