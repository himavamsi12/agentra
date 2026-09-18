"use client";

import { useEffect, useRef, useState } from "react";

type Decision = "allowed" | "warning" | "blocked";

type EventLine = {
  kind: "event";
  time: string;
  decision: Decision;
  action: string;
  detail: string;
  note?: string;
};

type AlertLine = {
  kind: "alert";
  time: string;
  title: string;
  chain: string[];
};

type Line = EventLine | AlertLine;

const LINES: Line[] = [
  { kind: "event", time: "09:41:02", decision: "allowed", action: "file.read", detail: "src/checkout/handler.ts" },
  { kind: "event", time: "09:41:02", decision: "allowed", action: "file.read", detail: "src/lib/payments.ts" },
  { kind: "event", time: "09:41:05", decision: "allowed", action: "shell.exec", detail: "npm run test -- checkout" },
  { kind: "event", time: "09:41:09", decision: "allowed", action: "mcp.call", detail: "github.get_issue #482" },
  {
    kind: "event",
    time: "09:41:12",
    decision: "warning",
    action: "file.read",
    detail: ".env",
    note: "secrets in scope: STRIPE_SECRET_KEY, DATABASE_URL",
  },
  { kind: "event", time: "09:41:13", decision: "allowed", action: "file.write", detail: "scripts/debug-upload.js" },
  {
    kind: "event",
    time: "09:41:14",
    decision: "blocked",
    action: "net.connect",
    detail: "POST https://45.33.12.9:8443/upload",
    note: "host not in allowlist · rule net/unknown-egress",
  },
  {
    kind: "alert",
    time: "09:41:14",
    title: "Potential credential exfiltration detected.",
    chain: [".env read", "script written", "outbound POST blocked", "session paused"],
  },
];

const CHAR_MS = 14;
const PAUSE: Record<Line["kind"] | Decision, number> = {
  event: 260,
  allowed: 260,
  warning: 700,
  blocked: 950,
  alert: 1100,
};

const STYLE: Record<Decision, { label: string; badge: string; text: string }> = {
  allowed: { label: "ALLOWED", badge: "border-term-allow/40 bg-term-allow/10 text-term-allow", text: "text-term-fg" },
  warning: { label: "WARNING", badge: "border-term-warn/50 bg-term-warn/10 text-term-warn", text: "text-term-warn" },
  blocked: { label: "BLOCKED", badge: "border-term-block/50 bg-term-block/10 text-term-block", text: "text-term-block" },
};

function typedLength(line: Line) {
  return line.kind === "event"
    ? line.action.length + line.detail.length + (line.note?.length ?? 0)
    : line.title.length;
}

/** Start time + duration for every line, in ms. */
function buildTimeline() {
  let t = 400;
  return LINES.map((line) => {
    const pause = line.kind === "event" ? PAUSE[line.decision] : PAUSE.alert;
    const start = t;
    const duration = typedLength(line) * CHAR_MS;
    t = start + duration + pause;
    return { start, duration, end: start + duration };
  });
}

const TIMELINE = buildTimeline();

function Typed({ text, from, count }: { text: string; from: number; count: number }) {
  const shown = Math.max(0, Math.min(text.length, count - from));
  return (
    <>
      <span>{text.slice(0, shown)}</span>
      {/* Untyped text stays in the layout (no shift) and in the accessibility tree. */}
      <span className="opacity-0">{text.slice(shown)}</span>
    </>
  );
}

function Cursor() {
  return (
    <span
      aria-hidden="true"
      className="terminal-cursor ml-0.5 inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em] bg-term-fg/80"
    />
  );
}

export function AgentTerminal() {
  const timeline = TIMELINE;
  const total = timeline[timeline.length - 1].end;

  const rootRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(-1); // -1 = not started
  const [runId, setRunId] = useState(0); // 0 = waiting for scroll; increments on each (re)play

  // Start when scrolled into view (jump straight to the end for reduced motion).
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setT(total);
        else setRunId(1);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [total]);

  useEffect(() => {
    if (runId === 0) return;
    let raf = 0;
    const origin = performance.now();
    const tick = (now: number) => {
      const next = Math.min(total, now - origin);
      setT(next);
      if (next < total) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [runId, total]);

  const replay = () => setRunId((n) => n + 1);

  const started = timeline.map((s) => t >= s.start);
  const chars = timeline.map((s) => (t < s.start ? 0 : Math.floor((t - s.start) / CHAR_MS)));
  const activeIndex = started.lastIndexOf(true);
  const done = t >= total;

  const counts = LINES.reduce(
    (acc, line, i) => {
      if (!started[i] || line.kind !== "event") return acc;
      acc.events += 1;
      if (line.decision === "warning") acc.warnings += 1;
      if (line.decision === "blocked") acc.blocked += 1;
      return acc;
    },
    { events: 0, warnings: 0, blocked: 0 },
  );

  return (
    <div
      ref={rootRef}
      className="overflow-hidden rounded-[28px] border border-term-line bg-term-bg font-mono text-[12.5px] leading-[1.55] tracking-normal text-term-fg sm:text-[14px]"
    >
      {/* window chrome */}
      <div className="flex items-center gap-3 border-b border-term-line bg-term-chrome px-4 py-3 sm:px-5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#4a4745]" />
          <span className="size-2.5 rounded-full bg-[#4a4745]" />
          <span className="size-2.5 rounded-full bg-[#4a4745]" />
        </div>
        <p className="min-w-0 flex-1 truncate text-center text-[11.5px] text-term-muted sm:text-[12.5px]">
          agentra — claude-code<span className="hidden sm:inline"> · ~/work/checkout-api</span>
        </p>
        <div className="flex items-center gap-2">
          {done ? (
            <button
              type="button"
              onClick={replay}
              className="rounded-full border border-term-line px-2.5 py-0.5 text-[11px] uppercase text-term-muted transition-colors hover:border-term-muted hover:text-term-fg"
            >
              Replay
            </button>
          ) : (
            <span className="flex items-center gap-1.5 text-[11px] uppercase text-term-muted">
              <span className="relative flex size-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-term-block/70 motion-reduce:hidden" />
                <span className="relative size-1.5 rounded-full bg-term-block" />
              </span>
              Live
            </span>
          )}
        </div>
      </div>

      <figure className="m-0">
        <figcaption className="sr-only">
          Simulated Agentra activity timeline for a Claude Code session: routine file reads, a test run and an MCP
          call are allowed; reading .env raises a warning; an outbound POST to an unknown host is blocked; Agentra
          flags potential credential exfiltration.
        </figcaption>

        <ol className="space-y-2.5 px-4 py-5 sm:space-y-2 sm:px-6 sm:py-6">
          {LINES.map((line, i) => {
            const visible = started[i];
            const typing = i === activeIndex && (!done || i === LINES.length - 1);

            if (line.kind === "alert") {
              return (
                <li
                  key={i}
                  className={`mt-5 rounded-2xl border border-term-block/40 bg-term-block/10 px-4 py-3.5 transition-opacity duration-300 sm:mt-6 sm:px-5 ${
                    visible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-term-muted">{line.time}</span>
                    <span className="rounded-full border border-term-block/60 bg-term-block px-2 text-[11px] font-medium text-term-bg">
                      ALERT
                    </span>
                    <span className="basis-full font-medium text-term-block sm:basis-auto">
                      <Typed text={line.title} from={0} count={chars[i]} />
                      {typing && <Cursor />}
                    </span>
                  </div>
                  <ol
                    aria-label="Attack chain"
                    className={`mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[11.5px] text-term-muted transition-opacity duration-500 sm:text-[12.5px] ${
                      t >= timeline[i].end ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {line.chain.map((step, k) => (
                      <li key={step} className="flex items-center gap-2">
                        {k > 0 && <span aria-hidden="true">→</span>}
                        <span className={k === line.chain.length - 1 ? "text-term-fg" : undefined}>{step}</span>
                      </li>
                    ))}
                  </ol>
                </li>
              );
            }

            const s = STYLE[line.decision];
            const n = chars[i];
            return (
              <li
                key={i}
                className={`flex flex-wrap items-baseline gap-x-3 gap-y-0.5 sm:grid sm:grid-cols-[5.25rem_6rem_7.5rem_1fr] sm:gap-x-4 ${
                  visible ? "opacity-100" : "opacity-0"
                }`}
              >
                <span className="text-term-muted">{line.time}</span>
                <span className={`w-fit rounded-full border px-2 text-[11px] leading-[1.6] ${s.badge}`}>{s.label}</span>
                <span className="text-term-muted">
                  <Typed text={line.action} from={0} count={n} />
                </span>
                <span className={`min-w-0 basis-full break-words sm:basis-auto ${s.text}`}>
                  <Typed text={line.detail} from={line.action.length} count={n} />
                  {typing && !line.note && <Cursor />}
                  {line.note && (
                    <span className="block text-[11.5px] text-term-muted sm:text-[12.5px]">
                      <span aria-hidden="true">└ </span>
                      <Typed text={line.note} from={line.action.length + line.detail.length} count={n} />
                      {typing && <Cursor />}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ol>
      </figure>

      {/* status bar */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-term-line px-4 py-2.5 text-[11px] uppercase text-term-muted sm:px-6 sm:text-[12px]">
        <span aria-live="off">
          {counts.events} events · <span className="text-term-warn">{counts.warnings} warning</span> ·{" "}
          <span className="text-term-block">{counts.blocked} blocked</span>
        </span>
        <span>policy: strict-local · 0 bytes sent upstream</span>
      </div>
    </div>
  );
}
