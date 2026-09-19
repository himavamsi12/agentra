"use client";

import { useEffect, useState } from "react";
import { LogoMark } from "./icons";

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
          <LogoMark className="size-8" />
          agentra
          <span className="sr-only"> - home</span>
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
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
