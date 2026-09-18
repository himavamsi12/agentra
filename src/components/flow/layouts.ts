// Geometry for the hero "interception" diagram.
// Two layouts share the same data: a wide horizontal one (md+) and a tall vertical one (mobile).

export type SourceId = "files" | "shell" | "network" | "mcp" | "memory" | "git";
export type Decision = "allow" | "ask" | "block" | "quarantine";
export type Module = "timeline" | "policy" | "mcp" | "memory";

export const SOURCES: { id: SourceId; label: string }[] = [
  { id: "files", label: "File reads" },
  { id: "shell", label: "Shell commands" },
  { id: "network", label: "Network calls" },
  { id: "mcp", label: "MCP tool calls" },
  { id: "memory", label: "Memory writes" },
  { id: "git", label: "Git operations" },
];

export const DECISIONS: { id: Decision; label: string }[] = [
  { id: "allow", label: "Allow" },
  { id: "ask", label: "Ask" },
  { id: "block", label: "Block" },
  { id: "quarantine", label: "Quarantine" },
];

export const MODULES: { id: Module; label: string }[] = [
  { id: "timeline", label: "Timeline" },
  { id: "policy", label: "Policy" },
  { id: "mcp", label: "MCP scan" },
  { id: "memory", label: "Memory" },
];

export const DECISION_COLORS: Record<Decision, { ink: string; fill: string }> = {
  allow: { ink: "#1f7a4d", fill: "#e2f5e8" },
  ask: { ink: "#8a5300", fill: "#f7ecc9" },
  block: { ink: "#b3261e", fill: "#fbe0da" },
  quarantine: { ink: "#34427a", fill: "#dde5f8" },
};

/** Scripted agent activity — played one event at a time, forever. */
export const EVENTS: {
  source: SourceId;
  label: string;
  decision: Decision;
  modules: Module[];
  reason: string;
}[] = [
  { source: "files", label: "read src/auth.ts", decision: "allow", modules: ["timeline", "policy"], reason: "inside workspace scope" },
  { source: "shell", label: "npm run test", decision: "allow", modules: ["timeline", "policy"], reason: "allowlisted command" },
  { source: "files", label: "read .env", decision: "ask", modules: ["timeline", "policy"], reason: "secrets file needs approval" },
  { source: "network", label: "POST 45.33.12.9", decision: "block", modules: ["timeline", "policy"], reason: "host not in allowlist" },
  { source: "mcp", label: "notes.sync_all", decision: "block", modules: ["mcp", "policy"], reason: "tool changed after approval" },
  { source: "memory", label: "“skip code review”", decision: "quarantine", modules: ["memory"], reason: "instruction hidden in memory" },
  { source: "git", label: "git push --force", decision: "ask", modules: ["timeline", "policy"], reason: "destructive git operation" },
];

export const MODULE_LABEL: Record<Module, string> = {
  timeline: "Timeline",
  policy: "Policy",
  mcp: "MCP scan",
  memory: "Memory firewall",
};

type Pt = { x: number; y: number };

export type Pill = { x: number; y: number; w: number; h: number };

export type FlowLayout = {
  name: "wide" | "tall";
  viewBox: { x: number; y: number; w: number; h: number };
  fontSize: number;
  hub: { cx: number; cy: number; side: number; offset: number };
  /** module placement around the hub */
  petals: Record<Module, Pt>;
  /** where the "CHECKING · ..." caption sits, clear of the hub cluster */
  checkAnchor: Pt;
  sources: (Pill & { path: string })[];
  decisions: (Pill & { path: string })[];
  /** where the action tag sits for each source row (wide layout only) */
  tagAnchor?: (sourceIndex: number) => Pt;
};

const CHAR = 0.6; // JetBrains Mono advance width in em

function pillWidth(label: string, fontSize: number, extra: number) {
  return Math.round(label.length * fontSize * CHAR + extra);
}

function wide(): FlowLayout {
  const fontSize = 12;
  const hub = { cx: 600, cy: 195, side: 64, offset: 52 };
  const half = (hub.side * Math.SQRT2) / 2;
  const leftTip = hub.cx - hub.offset - half;
  const rightTip = hub.cx + hub.offset + half;

  const sources = SOURCES.map((s, i) => {
    const w = pillWidth(s.label, fontSize, 56);
    const cy = 48 + i * 58;
    const endY = hub.cy + (i - 2.5) * 9;
    const sx = 330;
    return {
      x: sx - w,
      y: cy - 16,
      w,
      h: 32,
      path: `M${sx} ${cy} H370 C460 ${cy} 410 ${endY} ${leftTip - 4} ${endY}`,
    };
  });

  const decisions = DECISIONS.map((d, j) => {
    const w = pillWidth(d.label, fontSize, 52);
    const cy = 78 + j * 76;
    const sy = hub.cy + (j - 1.5) * 6;
    const ex = 870;
    return {
      x: ex,
      y: cy - 16,
      w,
      h: 32,
      path: `M${rightTip + 4} ${sy} C790 ${sy} 780 ${cy} 830 ${cy} H${ex}`,
    };
  });

  return {
    name: "wide",
    viewBox: { x: 150, y: 10, w: 900, h: 370 },
    fontSize,
    hub,
    petals: {
      timeline: { x: hub.cx - hub.offset, y: hub.cy },
      policy: { x: hub.cx + hub.offset, y: hub.cy },
      mcp: { x: hub.cx, y: hub.cy - hub.offset },
      memory: { x: hub.cx, y: hub.cy + hub.offset },
    },
    checkAnchor: { x: hub.cx, y: hub.cy - hub.offset - half - 26 },
    sources,
    decisions,
    tagAnchor: (i) => ({ x: 342, y: 48 + i * 58 - 25 }),
  };
}

function tall(): FlowLayout {
  const fontSize = 11;
  const hub = { cx: 180, cy: 330, side: 58, offset: 48 };
  const half = (hub.side * Math.SQRT2) / 2;
  const topTip = hub.cy - hub.offset - half;
  const bottomTip = hub.cy + hub.offset + half;

  const sources = SOURCES.map((s, i) => {
    const w = pillWidth(s.label, fontSize, 50);
    const col = i % 2;
    const cy = 40 + Math.floor(i / 2) * 50;
    const gx = hub.cx + (i - 2.5) * 5;
    const sx = col === 0 ? 166 : 194; // inner edges, facing the center gutter
    return {
      x: col === 0 ? sx - w : sx,
      y: cy - 15,
      w,
      h: 30,
      path: `M${sx} ${cy} C${gx} ${cy} ${gx} ${cy} ${gx} ${cy + 20} V${topTip + 6}`,
    };
  });

  const decisions = DECISIONS.map((d, j) => {
    const w = pillWidth(d.label, fontSize, 46);
    const col = j % 2;
    const cy = 525 + Math.floor(j / 2) * 50;
    const gx = hub.cx + (j - 1.5) * 6;
    const ex = col === 0 ? 166 : 194;
    return {
      x: col === 0 ? ex - w : ex,
      y: cy - 15,
      w,
      h: 30,
      path: `M${gx} ${bottomTip - 6} V${cy - 20} C${gx} ${cy} ${gx} ${cy} ${ex} ${cy}`,
    };
  });

  return {
    name: "tall",
    viewBox: { x: 0, y: 0, w: 360, h: 610 },
    fontSize,
    hub,
    petals: {
      timeline: { x: hub.cx, y: hub.cy - hub.offset },
      policy: { x: hub.cx, y: hub.cy + hub.offset },
      mcp: { x: hub.cx - hub.offset, y: hub.cy },
      memory: { x: hub.cx + hub.offset, y: hub.cy },
    },
    checkAnchor: { x: hub.cx, y: hub.cy - hub.offset - half - 22 },
    sources,
    decisions,
  };
}

export function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export const LAYOUTS = { wide: wide(), tall: tall() };
