import { site } from "@/lib/site";
import { LogoMark, PixelHeart } from "./icons";

const LINKS = [
  { label: "X", href: site.x, external: true },
  { label: "Early access", href: "#early-access", external: false },
];

export function Footer() {
  return (
    <footer className="border-t border-ash px-5 py-12 sm:px-10 sm:py-16">
      <div className="mx-auto flex max-w-[1432px] flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-sm">
          <a
            href="#top"
            className="inline-flex items-center gap-2 rounded-full font-mono text-label font-medium lowercase text-off-black"
          >
            <LogoMark className="size-8" />
            {site.name}
            <span className="sr-only"> - back to top</span>
          </a>
          <p className="mt-4 text-body text-graphite">{site.tagline}</p>
        </div>

        <div className="flex flex-col gap-6 md:items-end">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="font-mono text-body-sm uppercase text-off-black transition-colors hover:text-graphite"
                >
                  {l.label}
                  {l.external && <span className="sr-only"> (opens in a new tab)</span>}
                </a>
              </li>
            ))}
          </ul>
          <p className="font-mono text-caption uppercase text-smoke">
            Open source · Local-first
          </p>
          <p className="inline-flex items-center gap-1.5 font-mono text-caption uppercase text-graphite">
            Made with
            <PixelHeart className="size-3.5" />
            <span className="sr-only">love</span>
            by vamsi
          </p>
        </div>
      </div>
    </footer>
  );
}
