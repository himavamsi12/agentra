"use client";

import { useEffect, useState, type AnimationEvent } from "react";

const SEEN_KEY = "agentra:intro-seen";

const HOOD =
  "M 148 500 L 338 125 Q 345 112 362 112 L 461 112 Q 478 112 485 125 L 665 494 C 632 440 587 400 532 398 L 434 362 Q 411 350 388 362 L 290 398 C 235 400 185 440 148 500 Z";
const LEG_L =
  "M 188 420 L 290 390 L 290 455 C 290 479 296.7 502.2 311.6 523.8 L 252 628 Q 249 633 243 633 L 98 633 Q 82 633 88 621 Z";
const LEG_R =
  "M 632 430 L 532 390 L 532 455 C 532 479 525.3 502.2 510.4 523.8 L 570 628 Q 573 633 579 633 L 718 633 Q 732 633 724 621 Z";
const HIGHLIGHT = "M 532 398 C 587 400 632 440 665 494 L 677 520 L 516 520 L 532 455 Z";
const SHIELD =
  "M 290 398 L 388 362 Q 411 350 434 362 L 532 398 L 532 455 C 532 515 490 570 411 608 C 332 570 290 515 290 455 Z";
const STAR = "M 411 398 Q 418 468 476 475 Q 418 482 411 550 Q 404 482 346 475 Q 404 468 411 398 Z";

const WORD = "agentra";

// Runs before hydration so a returning visitor never sees a flash of the curtain.
const skipScript = `try{if(sessionStorage.getItem("${SEEN_KEY}"))document.documentElement.dataset.introSeen=""}catch(e){}`;

/**
 * Once-per-session brand intro: the hooded "A" assembles piece by piece (outline trace, legs,
 * hood, shield, then the star ignites), the wordmark slides out beside it, and the curtain lifts.
 * Click or press any key to skip. Hidden entirely under prefers-reduced-motion.
 */
export function LogoIntro() {
  const [done, setDone] = useState(false);

  // Returning visitors are hidden by CSS ([data-intro-seen]); any key skips for everyone else.
  useEffect(() => {
    const skip = () => finish();
    window.addEventListener("keydown", skip, { once: true });
    return () => window.removeEventListener("keydown", skip);
  }, []);

  function finish() {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    setDone(true);
  }

  function onAnimationEnd(e: AnimationEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget && e.animationName === "intro-curtain") finish();
  }

  if (done) return null;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: skipScript }} />
      <div className="logo-intro" aria-hidden="true" onClick={finish} onAnimationEnd={onAnimationEnd}>
        <div className="logo-intro-lockup">
          <svg className="logo-intro-mark" viewBox="60 80 690 580">
            <defs>
              <linearGradient id="intro-hood" gradientUnits="userSpaceOnUse" x1="330" y1="190" x2="560" y2="358">
                <stop offset="0" stopColor="#CFDAF5" />
                <stop offset="0.18" stopColor="#A0B5EB" />
                <stop offset="0.4" stopColor="#2B59D1" />
                <stop offset="0.62" stopColor="#2249B0" />
                <stop offset="0.82" stopColor="#A0B5EB" />
                <stop offset="1" stopColor="#CFDAF5" />
              </linearGradient>
              <linearGradient id="intro-legl" gradientUnits="userSpaceOnUse" x1="170" y1="470" x2="290" y2="630">
                <stop offset="0" stopColor="#2249B0" />
                <stop offset="0.5" stopColor="#2B59D1" />
                <stop offset="0.85" stopColor="#A0B5EB" />
                <stop offset="1" stopColor="#CFDAF5" />
              </linearGradient>
              <linearGradient id="intro-legr" gradientUnits="userSpaceOnUse" x1="545" y1="615" x2="700" y2="545">
                <stop offset="0" stopColor="#A0B5EB" />
                <stop offset="0.5" stopColor="#2B59D1" />
                <stop offset="1" stopColor="#2249B0" />
              </linearGradient>
              <linearGradient id="intro-hl" gradientUnits="userSpaceOnUse" x1="650" y1="462" x2="640" y2="515">
                <stop offset="0" stopColor="#2B59D1" stopOpacity="0.9" />
                <stop offset="1" stopColor="#2B59D1" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="intro-star" x1="0.75" y1="0" x2="0.25" y2="1">
                <stop offset="0" stopColor="#F6F3F1" />
                <stop offset="0.45" stopColor="#A7FCCD" />
                <stop offset="1" stopColor="#2B59D1" />
              </linearGradient>
              <linearGradient id="intro-sheen" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="intro-flare">
                <stop offset="0" stopColor="#F6F3F1" stopOpacity="0.95" />
                <stop offset="0.25" stopColor="#A7FCCD" stopOpacity="0.55" />
                <stop offset="1" stopColor="#2B59D1" stopOpacity="0" />
              </radialGradient>
              <clipPath id="intro-hood-clip">
                <path d={HOOD} />
              </clipPath>
              <filter id="intro-blur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="7" />
              </filter>
            </defs>

            <path className="intro-leg intro-leg-l" d={LEG_L} fill="url(#intro-legl)" />
            <path className="intro-leg intro-leg-r" d={LEG_R} fill="url(#intro-legr)" />
            <path className="intro-hl" d={HIGHLIGHT} fill="url(#intro-hl)" />

            <g className="intro-hood">
              <path d={HOOD} fill="#2249B0" opacity="0.6" transform="translate(0 5)" />
              <path d={HOOD} fill="url(#intro-hood)" />
              <g clipPath="url(#intro-hood-clip)">
                <rect className="intro-sheen" x="60" y="60" width="160" height="520" fill="url(#intro-sheen)" />
              </g>
            </g>
            <path className="intro-trace" d={HOOD} pathLength={1} fill="none" stroke="#CFDAF5" strokeWidth="3" />

            <g className="intro-shield">
              <path d={SHIELD} fill="none" stroke="#2B59D1" strokeWidth="12" opacity="0.7" filter="url(#intro-blur)" />
              <path d={SHIELD} fill="#242424" stroke="#A0B5EB" strokeWidth="2.5" strokeOpacity="0.85" />
            </g>

            <circle className="intro-flare" cx="411" cy="475" r="150" fill="url(#intro-flare)" />
            <ellipse className="intro-streak" cx="411" cy="475" rx="300" ry="2.5" fill="#E6F8EE" />
            <g className="intro-star">
              <path d={STAR} fill="#A7FCCD" opacity="0.7" filter="url(#intro-blur)" />
              <path d={STAR} fill="url(#intro-star)" />
            </g>
          </svg>

          <div className="logo-intro-word">
            <span className="logo-intro-word-inner">
              {WORD.split("").map((ch, i) => (
                <span key={i} style={{ animationDelay: `${2150 + i * 45}ms` }}>
                  {ch}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
