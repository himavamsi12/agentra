"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  DECISION_COLORS,
  DECISIONS,
  EVENTS,
  LAYOUTS,
  MODULE_LABEL,
  MODULES,
  SOURCES,
  type Module,
  type SourceId,
} from "./layouts";

/*
 * One event at a time, told in three beats:
 *   1. ACTION: the source pill turns black, its action tag appears, a line traces into the hub
 *   2. CHECK: the modules doing the work light up
 *   3. DECISION: a line in the decision colour traces out; the decision pill pulses
 */
const T_SOURCE = 600;
const T_IN = 1400;
const T_HUB = 1300;
const T_OUT = 1300;
const T_HOLD = 1900;
const T_FADE = 650;
const STEP = T_SOURCE + T_IN + T_HUB + T_OUT + T_HOLD + T_FADE;

const P_IN = T_SOURCE;
const P_HUB = P_IN + T_IN;
const P_OUT = P_HUB + T_HUB;
const P_HOLD = P_OUT + T_OUT;
const P_FADE = P_HOLD + T_HOLD;

type Stage = 0 | 1 | 2 | 3; // 0 idle, 1 action, 2 check, 3 decision

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const SOURCE_INDEX = Object.fromEntries(SOURCES.map((s, i) => [s.id, i])) as Record<SourceId, number>;
const DECISION_INDEX = Object.fromEntries(DECISIONS.map((d, i) => [d.id, i])) as Record<string, number>;

export function FlowDiagram({ variant }: { variant: "wide" | "tall" }) {
  const L = LAYOUTS[variant];
  const svgRef = useRef<SVGSVGElement>(null);
  const [readout, setReadout] = useState<{ event: number; stage: Stage }>({ event: 0, stage: 0 });

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const q = <T extends Element>(sel: string) => Array.from(svg.querySelectorAll<T>(sel));
    const inTraces = q<SVGPathElement>("[data-in-trace]");
    const outTraces = q<SVGPathElement>("[data-out-trace]");
    const inLen = inTraces.map((p) => p.getTotalLength());
    const outLen = outTraces.map((p) => p.getTotalLength());
    const sources = q<SVGGElement>("[data-source]");
    const decisions = q<SVGGElement>("[data-decision]");
    const petals = Object.fromEntries(
      q<SVGGElement>("[data-petal]").map((el) => [el.dataset.petal, el.querySelector<SVGGElement>(".flow-petal")!])
    ) as Record<Module, SVGGElement>;
    const tags = q<SVGGElement>("[data-tag]");
    const dot = svg.querySelector<SVGGElement>("[data-dot]")!;
    const dotCore = svg.querySelector<SVGCircleElement>("[data-dot-core]")!;
    const dotGlow = svg.querySelector<SVGCircleElement>("[data-dot-glow]")!;
    const hubRing = svg.querySelector<SVGCircleElement>("[data-hub-ring]")!;
    const ripples = q<SVGCircleElement>("[data-ripple]");
    const checkLabel = svg.querySelector<SVGTextElement>("[data-check-label]")!;
    const idleDotsIn = q<SVGCircleElement>("[data-idle-dots-in] circle");
    const idleDotsOut = q<SVGCircleElement>("[data-idle-dots-out] circle");

    inTraces.forEach((p, i) => (p.style.strokeDasharray = `${inLen[i]} ${inLen[i]}`));
    outTraces.forEach((p, i) => (p.style.strokeDasharray = `${outLen[i]} ${outLen[i]}`));

    // every idle rail gets small, soft-coloured dots that travel and fade along it,
    // driven directly here (not CSS) so it never silently stalls. Reuses the same path
    // geometry as the active trace lines, just travelling continuously either way.
    const DOTS_PER_PATH = 2;

    let lastKey = "";

    function frame(t: number) {
      const ei = Math.floor(t / STEP) % EVENTS.length;
      const local = t % STEP;
      const e = EVENTS[ei];
      const si = SOURCE_INDEX[e.source];
      const di = DECISION_INDEX[e.decision];
      const color = DECISION_COLORS[e.decision].ink;
      const fade = local >= P_FADE ? 1 - clamp01((local - P_FADE) / T_FADE) : 1;

      // 1: source + action tag
      sources.forEach((g, i) => g.classList.toggle("is-on", i === si && local < P_FADE));
      tags.forEach((g, i) => (g.style.opacity = String(i === ei ? clamp01(local / 250) * fade : 0)));

      // idle rails: small soft-coloured dots travel and fade along every path, always,
      // independent of which event is active, driven by wall-clock time so it never pauses
      const DOT_SPEED = 6000; // ms for one full pass along a path: a calm, ambient pace
      const FADE_SPAN = 0.18; // fraction of the path spent fading in / out at each end
      idleDotsIn.forEach((c, idx) => {
        const pathIdx = Math.floor(idx / DOTS_PER_PATH);
        const phase = idx % DOTS_PER_PATH;
        const prog = ((t / DOT_SPEED + phase / DOTS_PER_PATH) % 1 + 1) % 1;
        const pt = inTraces[pathIdx].getPointAtLength(inLen[pathIdx] * prog);
        c.setAttribute("cx", String(pt.x));
        c.setAttribute("cy", String(pt.y));
        c.style.opacity = String(Math.min(clamp01(prog / FADE_SPAN), clamp01((1 - prog) / FADE_SPAN)) * 0.32);
      });
      idleDotsOut.forEach((c, idx) => {
        const pathIdx = Math.floor(idx / DOTS_PER_PATH);
        const phase = idx % DOTS_PER_PATH;
        const prog = ((t / DOT_SPEED + phase / DOTS_PER_PATH) % 1 + 1) % 1;
        const pt = outTraces[pathIdx].getPointAtLength(outLen[pathIdx] * prog);
        c.setAttribute("cx", String(pt.x));
        c.setAttribute("cy", String(pt.y));
        c.style.opacity = String(Math.min(clamp01(prog / FADE_SPAN), clamp01((1 - prog) / FADE_SPAN)) * 0.32);
      });

      // traces: draw progressively, then hold, then fade together: one colour for the
      // whole journey (source → hub → decision) so the outcome reads at a glance
      const inP = ease(clamp01((local - P_IN) / T_IN));
      const outP = ease(clamp01((local - P_OUT) / T_OUT));
      inTraces.forEach((p, i) => {
        p.style.strokeDashoffset = String(i === si ? inLen[i] * (1 - inP) : inLen[i]);
        p.style.opacity = String(i === si ? fade : 0);
        p.style.stroke = color;
      });
      outTraces.forEach((p, i) => {
        p.style.strokeDashoffset = String(i === di ? outLen[i] * (1 - outP) : outLen[i]);
        p.style.opacity = String(i === di ? fade : 0);
        p.style.stroke = color;
      });

      // the single moving dot rides the tip of whichever line is drawing, always in the
      // decision's colour so it's obvious from the first frame what this action leads to
      if (local >= P_IN && local < P_HUB) {
        const pt = inTraces[si].getPointAtLength(inLen[si] * inP);
        dot.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
        dot.style.opacity = "1";
        dotCore.style.fill = color;
        dotGlow.style.fill = color;
      } else if (local >= P_OUT && local < P_HOLD) {
        const pt = outTraces[di].getPointAtLength(outLen[di] * outP);
        dot.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
        dot.style.opacity = "1";
        dotCore.style.fill = color;
        dotGlow.style.fill = color;
      } else {
        dot.style.opacity = "0";
      }

      // 2: hub check: light the modules doing the work, and spell it out in plain words
      // above the hub so the diagram narrates itself without needing the readout below
      const checking = local >= P_HUB - 100 && local < P_FADE;
      MODULES.forEach((m) => petals[m.id].classList.toggle("is-on", checking && e.modules.includes(m.id)));
      const hubP = clamp01((local - P_HUB) / T_HUB);
      hubRing.style.opacity = String(local >= P_HUB && local < P_OUT ? Math.sin(hubP * Math.PI) : 0);
      hubRing.setAttribute("r", String(L.hub.side * (1.1 + hubP * 0.8)));
      checkLabel.style.opacity = String(checking ? clamp01((local - (P_HUB - 100)) / 250) * fade : 0);
      checkLabel.textContent = `AGENTRA CHECKS · ${e.modules.map((m) => MODULE_LABEL[m].toUpperCase()).join(" + ")}`;

      // 3: decision pill, with a ring that ripples outward the instant it fires
      decisions.forEach((g, i) => g.classList.toggle("is-on", i === di && local >= P_HOLD - 120 && local < P_FADE + T_FADE * 0.5));
      const rippleP = clamp01((local - (P_HOLD - 120)) / 700);
      ripples.forEach((r, i) => {
        if (i === di && local >= P_HOLD - 120 && rippleP < 1) {
          r.style.opacity = String((1 - rippleP) * 0.8);
          r.setAttribute("r", String(4 + rippleP * 15));
          r.style.stroke = color;
        } else {
          r.style.opacity = "0";
        }
      });

      // readout (React state, only when the stage changes)
      const stage: Stage = local >= P_FADE ? 0 : local >= P_HOLD - 120 ? 3 : local >= P_HUB - 100 ? 2 : 1;
      const key = `${ei}:${stage}`;
      if (key !== lastKey) {
        lastKey = key;
        setReadout({ event: ei, stage });
      }
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Still frame: the blocked network call, fully resolved.
      frame(3 * STEP + P_HOLD + 400);
      return;
    }

    let raf = 0;
    let t = 0;
    let last = 0;
    const loop = (now: number) => {
      t += Math.min(64, now - (last || now));
      last = now;
      frame(t);
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      last = 0;
      if (entry.isIntersecting) raf = requestAnimationFrame(loop);
    });
    io.observe(svg);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [L]);

  const { x: vx, y: vy, w, h } = L.viewBox;
  const fs = L.fontSize;
  const { hub } = L;
  const centerSide = hub.side * 0.86;

  return (
    <div>
      <div style={{ aspectRatio: `${w} / ${h}` }}>
        <svg
          ref={svgRef}
          viewBox={`${vx} ${vy} ${w} ${h}`}
          role="img"
          aria-labelledby={`flow-title-${variant}`}
          className="h-full w-full overflow-visible font-mono select-none"
          style={{ letterSpacing: 0 }}
        >
          <title id={`flow-title-${variant}`}>
            Each agent action (file reads, shell commands, network calls, MCP tool calls, memory writes and git operations)
            is checked by Agentra&rsquo;s timeline, policy, MCP scanner and memory firewall, and resolved as allow, ask, block or
            quarantine.
          </title>

          <defs>
            <radialGradient id={`hub-glow-${variant}`}>
              <stop offset="0%" stopColor="#a7fccd" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#a7fccd" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#ecda98" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#f6f3f1" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle className="flow-hub-breath" cx={hub.cx} cy={hub.cy} r={hub.side * 2.9} fill={`url(#hub-glow-${variant})`} />
          <circle
            className="flow-spin flow-orbit-ring"
            cx={hub.cx}
            cy={hub.cy}
            r={hub.side * 1.55}
            fill="none"
            stroke="var(--color-lake-blue)"
            strokeOpacity="0.35"
            strokeWidth="1.25"
          />

          {/* idle rails: a faint guide line on every path, plus small soft-coloured dots
              that travel and fade along it, so the whole circuit reads as live; the
              active path's solid line draws on top of it */}
          <g fill="none" stroke="var(--color-ash)" strokeWidth="1.25" opacity="0.55">
            {L.sources.map((s, i) => <path key={i} d={s.path} />)}
            {L.decisions.map((d, i) => <path key={i} d={d.path} />)}
          </g>
          <g data-idle-dots-in="" fill="var(--color-lake-blue)">
            {L.sources.map((s, i) => (
              <g key={i}>
                <circle r="1.6" style={{ opacity: 0 }} />
                <circle r="1.6" style={{ opacity: 0 }} />
              </g>
            ))}
          </g>
          <g data-idle-dots-out="" fill="var(--color-lake-blue)">
            {L.decisions.map((d, i) => (
              <g key={i}>
                <circle r="1.6" style={{ opacity: 0 }} />
                <circle r="1.6" style={{ opacity: 0 }} />
              </g>
            ))}
          </g>

          {/* active traces */}
          <g fill="none" strokeWidth="2.5" strokeLinecap="round">
            {L.sources.map((s, i) => (
              <path key={i} d={s.path} data-in-trace="" stroke="var(--color-off-black)" style={{ opacity: 0 }} />
            ))}
            {L.decisions.map((d, i) => (
              <path key={i} d={d.path} data-out-trace="" style={{ opacity: 0 }} />
            ))}
          </g>

          {/* source pills */}
          {SOURCES.map((s, i) => {
            const p = L.sources[i];
            return (
              <g key={s.id} data-source="" className="flow-src" transform={`translate(${p.x} ${p.y})`}>
                <rect width={p.w} height={p.h} rx={p.h / 2} className="flow-src-bg" />
                <SourceIcon id={s.id} x={14} y={p.h / 2 - 7} />
                <text x={36} y={p.h / 2} dominantBaseline="central" fontSize={fs} fill="currentColor">
                  {s.label.toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* action tags (wide layout: shown above the active source's line) */}
          {L.tagAnchor &&
            EVENTS.map((e, i) => {
              const a = L.tagAnchor!(SOURCE_INDEX[e.source]);
              const tw = Math.round(e.label.length * 11 * 0.6 + 18);
              return (
                <g key={i} data-tag="" style={{ opacity: 0 }} transform={`translate(${a.x} ${a.y - 10})`}>
                  <rect width={tw} height={20} rx={6} fill="#fdfcfb" stroke="var(--color-off-black)" strokeOpacity="0.5" />
                  <text x={9} y={10} dominantBaseline="central" fontSize={11} fill="var(--color-off-black)">
                    {e.label}
                  </text>
                </g>
              );
            })}

          {/* decision pills */}
          {DECISIONS.map((d, i) => {
            const p = L.decisions[i];
            const c = DECISION_COLORS[d.id];
            return (
              <g key={d.id} data-decision="" className="flow-dec" transform={`translate(${p.x} ${p.y})`}>
                <rect
                  className="flow-dec-ring"
                  x={-5}
                  y={-5}
                  width={p.w + 10}
                  height={p.h + 10}
                  rx={(p.h + 10) / 2}
                  fill="none"
                  stroke={c.ink}
                  strokeOpacity="0.4"
                  strokeWidth="3"
                />
                <rect width={p.w} height={p.h} rx={p.h / 2} fill={c.fill} stroke={c.ink} strokeOpacity="0.45" />
                <circle
                  data-ripple=""
                  className="flow-ripple"
                  cx={17}
                  cy={p.h / 2}
                  r={4}
                  fill="none"
                  strokeWidth="1.5"
                  style={{ opacity: 0 }}
                />
                <circle cx={17} cy={p.h / 2} r={3.5} fill={c.ink} />
                <text x={30} y={p.h / 2} dominantBaseline="central" fontSize={fs} fill={c.ink}>
                  {d.label.toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* hub */}
          {MODULES.map((m) => {
            const pos = L.petals[m.id];
            return (
              <g key={m.id} data-petal={m.id} transform={`translate(${pos.x} ${pos.y})`}>
                <g className="flow-petal">
                  <rect x={-hub.side / 2} y={-hub.side / 2} width={hub.side} height={hub.side} rx={8} transform="rotate(45)" className="flow-petal-bg" />
                  <text
                    x={Math.sign(pos.x - hub.cx) * hub.side * 0.14}
                    y={Math.sign(pos.y - hub.cy) * hub.side * 0.14}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={fs - 2.5}
                    className="flow-petal-label"
                  >
                    {m.label.toUpperCase()}
                  </text>
                </g>
              </g>
            );
          })}
          <text
            data-check-label=""
            x={L.checkAnchor.x}
            y={L.checkAnchor.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={fs - 1}
            fontWeight={700}
            letterSpacing="0.04em"
            fill="var(--color-off-black)"
            style={{ opacity: 0 }}
          />
          <circle data-hub-ring="" cx={hub.cx} cy={hub.cy} r={hub.side / 2} fill="none" stroke="#1f7a4d" strokeWidth="1.5" style={{ opacity: 0 }} />
          <g transform={`translate(${hub.cx} ${hub.cy})`}>
            <rect x={-centerSide / 2} y={-centerSide / 2} width={centerSide} height={centerSide} rx={9} transform="rotate(45)" fill="var(--color-parchment)" stroke="#e6d7a3" />
            <path
              d="M0 -9 l7.2 2.8 v5.5 c0 4.2 -3 7.4 -7.2 8.8 c-4.2 -1.4 -7.2 -4.6 -7.2 -8.8 v-5.5 z"
              fill="none"
              stroke="var(--color-off-black)"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <text
              x={0}
              y={20}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={6}
              fontWeight={700}
              letterSpacing="0.01em"
              fill="var(--color-off-black)"
            >
              AGENTRA
            </text>
          </g>

          {/* the one travelling spark, with a soft glow riding behind it */}
          <g data-dot="" style={{ opacity: 0 }}>
            <circle data-dot-glow="" className="flow-spark-glow" r={9} opacity="0.5" />
            <circle r={7} fill="var(--color-parchment)" opacity="0.9" />
            <circle data-dot-core="" r={4} />
          </g>
        </svg>
      </div>

      <Readout variant={variant} event={readout.event} stage={readout.stage} />
    </div>
  );
}

function Readout({ variant, event, stage }: { variant: "wide" | "tall"; event: number; stage: Stage }) {
  const e = EVENTS[event];
  const c = DECISION_COLORS[e.decision];
  const cells: { n: string; label: string; body: ReactNode }[] = [
    {
      n: "01",
      label: "Agent action",
      body: <span className="truncate text-off-black">{e.label}</span>,
    },
    {
      n: "02",
      label: "Agentra checks",
      body: <span className="truncate text-off-black">{e.modules.map((m) => MODULE_LABEL[m]).join(" + ")}</span>,
    },
    {
      n: "03",
      label: "Decision",
      body: (
        <span className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 rounded-full border px-2 text-[11px] uppercase" style={{ color: c.ink, background: c.fill, borderColor: `${c.ink}55` }}>
            {e.decision}
          </span>
          <span className="truncate text-graphite">{e.reason}</span>
        </span>
      ),
    },
  ];

  return (
    <div aria-hidden="true" className={`mx-auto ${variant === "wide" ? "mt-8 max-w-4xl" : "mt-6"}`}>
      <ol
        className={`grid overflow-hidden rounded-2xl border border-ash bg-parchment/80 font-mono text-[12.5px] backdrop-blur-sm ${
          variant === "wide" ? "grid-cols-3 divide-x divide-ash" : "grid-cols-1 divide-y divide-ash"
        }`}
      >
        {cells.map((cell, i) => {
          const active = stage > i;
          return (
            <li
              key={cell.n}
              className={`flex min-w-0 flex-col gap-1.5 px-4 py-3 text-left transition-opacity duration-300 ${
                variant === "tall" ? "h-[4.25rem]" : "h-[4.5rem]"
              } ${active ? "opacity-100" : "opacity-35"}`}
            >
              <span className="flex items-center gap-2 text-[11px] uppercase text-smoke">
                <span className={`size-1.5 rounded-full transition-colors duration-300 ${active ? "bg-off-black" : "bg-ash"}`} />
                {cell.n} · {cell.label}
              </span>
              <span className="flex min-w-0">{active ? cell.body : <span className="text-smoke">-</span>}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function SourceIcon({ id, x, y }: { id: SourceId; x: number; y: number }) {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<SourceId, ReactNode> = {
    files: <path d="M3.5 1.5h5l3 3v8a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1zM8.5 1.5v3h3" {...s} />,
    shell: (
      <>
        <rect x="1.5" y="2.5" width="11" height="9" rx="1.5" {...s} />
        <path d="M4 5.5l2 1.5-2 1.5M7.5 9h2.5" {...s} />
      </>
    ),
    network: (
      <>
        <circle cx="7" cy="7" r="5.5" {...s} />
        <path d="M1.5 7h11M7 1.5c1.8 2 1.8 9 0 11M7 1.5c-1.8 2-1.8 9 0 11" {...s} />
      </>
    ),
    mcp: <path d="M5 1.5v3M9 1.5v3M3.5 4.5h7v2.5a3.5 3.5 0 0 1-7 0zM7 10.5v2" {...s} />,
    memory: (
      <>
        <ellipse cx="7" cy="3.5" rx="4.5" ry="1.8" {...s} />
        <path d="M2.5 3.5v7c0 1 2 1.8 4.5 1.8s4.5-.8 4.5-1.8v-7M2.5 7c0 1 2 1.8 4.5 1.8s4.5-.8 4.5-1.8" {...s} />
      </>
    ),
    git: (
      <>
        <circle cx="4" cy="3" r="1.5" {...s} />
        <circle cx="4" cy="11" r="1.5" {...s} />
        <circle cx="10.5" cy="5" r="1.5" {...s} />
        <path d="M4 4.5v5M10.5 6.5c0 2-2 2.5-6.5 3" {...s} />
      </>
    ),
  };
  return <g transform={`translate(${x} ${y})`}>{paths[id]}</g>;
}
