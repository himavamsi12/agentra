import { useId, type SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export function RocketIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M8 1.6c1.9 1.1 3 3.1 3 5.7 0 1.6-.5 3-1.3 4.1L8 13.2l-1.7-1.8C5.5 10.3 5 8.9 5 7.3c0-2.6 1.1-4.6 3-5.7Z" />
      <circle cx="8" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      <path d="M5.6 9.4 4 10.4c-.3.5-.4 1.3-.4 1.9.6 0 1.4-.1 1.9-.4l1-1.6" />
      <path d="M10.4 9.4 12 10.4c.3.5.4 1.3.4 1.9-.6 0-1.4-.1-1.9-.4l-1-1.6" />
      <path d="M6.8 13.2 6.4 15M9.2 13.2l.4 1.8" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M3 8.5l3.2 3L13 4.5" />
    </svg>
  );
}

/** Brand mark: a hooded "A" monogram with a shielded, star-lit center. Used in the nav and footer. */
export function LogoMark(props: IconProps) {
  const uid = useId();
  const hood = `logo-hood-${uid}`;
  const legl = `logo-legl-${uid}`;
  const legr = `logo-legr-${uid}`;
  const highlight = `logo-hl-${uid}`;
  const star = `logo-star-${uid}`;
  const blur = `logo-blur-${uid}`;
  return (
    <svg viewBox="60 80 690 580" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id={hood} gradientUnits="userSpaceOnUse" x1="330" y1="190" x2="560" y2="358">
          <stop offset="0" stopColor="#d8eef9" />
          <stop offset="0.18" stopColor="#b8d1f6" />
          <stop offset="0.4" stopColor="#8cadef" />
          <stop offset="0.62" stopColor="#95bbed" />
          <stop offset="0.82" stopColor="#a6d8f1" />
          <stop offset="1" stopColor="#baeff8" />
        </linearGradient>
        <linearGradient id={legl} gradientUnits="userSpaceOnUse" x1="170" y1="470" x2="290" y2="630">
          <stop offset="0" stopColor="#3f5ca8" />
          <stop offset="0.5" stopColor="#4d72c6" />
          <stop offset="0.85" stopColor="#6f97ee" />
          <stop offset="1" stopColor="#93b6f3" />
        </linearGradient>
        <linearGradient id={legr} gradientUnits="userSpaceOnUse" x1="545" y1="615" x2="700" y2="545">
          <stop offset="0" stopColor="#7a8cf0" />
          <stop offset="0.5" stopColor="#5563cf" />
          <stop offset="1" stopColor="#3e47aa" />
        </linearGradient>
        <linearGradient id={highlight} gradientUnits="userSpaceOnUse" x1="650" y1="462" x2="640" y2="515">
          <stop offset="0" stopColor="#9a96f5" stopOpacity="0.9" />
          <stop offset="1" stopColor="#9a96f5" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={star} x1="0.75" y1="0" x2="0.25" y2="1">
          <stop offset="0" stopColor="#e6f8fc" />
          <stop offset="0.45" stopColor="#96d8f5" />
          <stop offset="1" stopColor="#7ba0ec" />
        </linearGradient>
        <filter id={blur} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <path d="M 188 420 L 290 390 L 290 455 C 290 479 296.7 502.2 311.6 523.8 L 252 628 Q 249 633 243 633 L 98 633 Q 82 633 88 621 Z" fill={`url(#${legl})`} />
      <path d="M 632 430 L 532 390 L 532 455 C 532 479 525.3 502.2 510.4 523.8 L 570 628 Q 573 633 579 633 L 718 633 Q 732 633 724 621 Z" fill={`url(#${legr})`} />
      <path d="M 532 398 C 587 400 632 440 665 494 L 677 520 L 516 520 L 532 455 Z" fill={`url(#${highlight})`} />
      <path
        d="M 148 500 L 338 125 Q 345 112 362 112 L 461 112 Q 478 112 485 125 L 665 494 C 632 440 587 400 532 398 L 434 362 Q 411 350 388 362 L 290 398 C 235 400 185 440 148 500 Z"
        fill="#1e2f6e"
        opacity="0.6"
        transform="translate(0 5)"
      />
      <path
        d="M 148 500 L 338 125 Q 345 112 362 112 L 461 112 Q 478 112 485 125 L 665 494 C 632 440 587 400 532 398 L 434 362 Q 411 350 388 362 L 290 398 C 235 400 185 440 148 500 Z"
        fill={`url(#${hood})`}
      />
      <path
        d="M 290 398 L 388 362 Q 411 350 434 362 L 532 398 L 532 455 C 532 515 490 570 411 608 C 332 570 290 515 290 455 Z"
        fill="none"
        stroke="#3f6be8"
        strokeWidth="12"
        opacity="0.7"
        filter={`url(#${blur})`}
      />
      <path
        d="M 290 398 L 388 362 Q 411 350 434 362 L 532 398 L 532 455 C 532 515 490 570 411 608 C 332 570 290 515 290 455 Z"
        fill="#0c111c"
        stroke="#6f8fea"
        strokeWidth="2.5"
        strokeOpacity="0.85"
      />
      <path
        d="M 411 398 Q 418 468 476 475 Q 418 482 411 550 Q 404 482 346 475 Q 404 468 411 398 Z"
        fill="#7fc8ff"
        opacity="0.7"
        filter={`url(#${blur})`}
      />
      <path d="M 411 398 Q 418 468 476 475 Q 418 482 411 550 Q 404 482 346 475 Q 404 468 411 398 Z" fill={`url(#${star})`} />
    </svg>
  );
}

// B = black outline, R = red fill, W = highlight, "." = empty
const HEART_ROWS = [
  "..BBB.....BBB..",
  ".BRRRB...BRRRB.",
  "BRWWRRB.BRRRRRB",
  "BRWRRRRBRRRRRRB",
  "BRRRRRRRRRRRRRB",
  "BRRRRRRRRRRRRRB",
  ".BRRRRRRRRRRRB.",
  ".BRRRRRRRRRRRB.",
  "..BRRRRRRRRRB..",
  "...BRRRRRRRB...",
  "....BRRRRRB....",
  ".....BRRRB.....",
  "......BRB......",
  ".......B.......",
];

const HEART_FILL: Record<string, string> = { B: "#000", R: "#ff3547", W: "#fff" };

/** 8-bit pixel heart. */
export function PixelHeart(props: IconProps) {
  return (
    <svg viewBox="0 0 15 14" shapeRendering="crispEdges" aria-hidden="true" {...props}>
      {HEART_ROWS.flatMap((row, y) =>
        [...row].map((c, x) =>
          c === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={HEART_FILL[c]} />,
        ),
      )}
    </svg>
  );
}
