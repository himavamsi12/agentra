import type { ReactNode } from "react";

/* --- shared bits --- */

export function IconCircle({ children }: { children: ReactNode }) {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-ash bg-parchment text-graphite">
      <svg viewBox="0 0 20 20" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
      </svg>
    </span>
  );
}

export function Tag({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "warn" | "block" | "allow" }) {
  const tones = {
    neutral: "border-ash bg-parchment text-graphite",
    allow: "border-[#1f7a4d]/30 bg-[#e2f5e8] text-[#1f7a4d]",
    warn: "border-[#8a5300]/30 bg-[#f7ecc9] text-[#8a5300]",
    block: "border-[#b3261e]/30 bg-[#fbe0da] text-[#b3261e]",
  };
  return <span className={`inline-flex rounded-md border px-1.5 py-px text-[11px] leading-[1.5] ${tones[tone]}`}>{children}</span>;
}

/** Monad-style connector pill (uses the quarantine ink, keeping Lake Blue reserved for the CTA). */
export function Link({ children }: { children: ReactNode }) {
  return (
    <span className="relative z-10 inline-flex items-center gap-1.5 rounded-md border border-[#34427a]/35 bg-[#eef2fc] px-2 py-0.5 font-mono text-[11.5px] text-[#34427a]">
      <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
        <path d="M6.5 5H5a3 3 0 0 0 0 6h1.5M9.5 5H11a3 3 0 0 1 0 6H9.5M5.5 8h5" />
      </svg>
      {children}
    </span>
  );
}

function VLine({ className = "h-5" }: { className?: string }) {
  return <span aria-hidden="true" className={`flow-dash block w-px ${className}`} />;
}

function Knob() {
  return <span aria-hidden="true" className="mx-auto block h-1.5 w-8 rounded-full bg-[#4b5563]" />;
}

function NodeCard({ icon, title, tag, tone, compact, className = "" }: { icon: ReactNode; title: string; tag: string; tone?: "neutral" | "warn" | "block" | "allow"; compact?: boolean; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="-mb-[3px]"><Knob /></div>
      <div className="flex items-center gap-3 rounded-xl border border-ash bg-[#fdfcfb] p-2.5 pr-4 shadow-[0_0_10px_rgba(0,0,0,0.06)]">
        <span className={compact ? "hidden sm:contents" : "contents"}>
          <IconCircle>{icon}</IconCircle>
        </span>
        <div className="min-w-0">
          <p className="truncate font-mono text-[13px] text-off-black">{title}</p>
          <div className="mt-1"><Tag tone={tone}>{tag}</Tag></div>
        </div>
      </div>
      <div className="-mt-[3px]"><Knob /></div>
    </div>
  );
}

/* --- 1. Coding Agent Security: event chain --- */

export function ChainIllustration() {
  return (
    <div aria-hidden="true" className="relative flex flex-col items-center px-4 pt-10 pb-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(closest-side_at_50%_30%,rgb(255_148_115/0.55),transparent),radial-gradient(closest-side_at_50%_80%,rgb(160_181_235/0.7),transparent)] blur-2xl" />

      <NodeCard
        className="w-60"
        title="claude-code"
        tag="session a41f"
        icon={<><rect x="2.5" y="4" width="15" height="12" rx="2" /><path d="M6 8.5l2 1.5-2 1.5M10 12h4" /></>}
      />
      <VLine />
      <Link>file.read</Link>
      <VLine />
      <NodeCard
        className="w-60"
        title=".env"
        tag="3 secrets in scope"
        tone="warn"
        icon={<><path d="M5 2.5h6l4 4v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1z" /><path d="M11 2.5v4h4" /><circle cx="9.5" cy="12" r="1.5" /></>}
      />
      <VLine />
      <Link>then</Link>
      <VLine />
      <NodeCard
        className="w-60"
        title="debug-upload.js"
        tag="file.write"
        icon={<><path d="M5 2.5h6l4 4v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1z" /><path d="M11 2.5v4h4M10 10v5M7.5 12.5h5" /></>}
      />
      <VLine />
      <Link>chain detected</Link>

      {/* fork */}
      <div className="relative -mt-3 h-8 w-[calc(50%+2rem)] max-w-[15rem] rounded-t-lg border-x border-t border-[#4b5563]/50 sm:max-w-[17rem]" />
      <div className="grid w-full max-w-[26rem] grid-cols-2 gap-2.5 sm:gap-3">
        <NodeCard
          compact
          title="45.33.12.9"
          tag="blocked"
          tone="block"
          icon={<><circle cx="10" cy="10" r="7" /><path d="M3 10h14M10 3c2.2 2.4 2.2 11.6 0 14M10 3c-2.2 2.4-2.2 11.6 0 14" /></>}
        />
        <NodeCard
          compact
          title="alert"
          tag="exfiltration"
          tone="block"
          icon={<><path d="M10 3l7.5 13h-15z" /><path d="M10 8.5v3.5M10 14.3v.2" /></>}
        />
      </div>
    </div>
  );
}

/* --- 2. Runtime Security: policy rules --- */

function RuleRow({ n, children, decision, faded }: { n: number; children: ReactNode; decision: "ask" | "block" | "allow"; faded?: boolean }) {
  const tone = decision === "block" ? "block" : decision === "ask" ? "warn" : "allow";
  return (
    <div className={`flex gap-3 ${faded ? "opacity-40" : ""}`}>
      <span className="pt-2 font-mono text-[11px] text-smoke">{n}</span>
      <div className="min-w-0 flex-1 rounded-lg border border-ash bg-[#fdfcfb] px-2.5 py-2 text-[12.5px] leading-[1.9] text-graphite">
        {children}
        <span className="ml-1.5 whitespace-nowrap">
          → <Tag tone={tone}>{decision.toUpperCase()}</Tag>
        </span>
      </div>
    </div>
  );
}

function Code({ children }: { children: ReactNode }) {
  return <code className="whitespace-nowrap rounded border border-ash bg-parchment px-1 py-px font-mono text-[11.5px] text-off-black">{children}</code>;
}

export function RulesIllustration() {
  return (
    <div aria-hidden="true" className="relative w-full max-w-[22rem]">
      <div className="pointer-events-none absolute -inset-10 -z-10 bg-[radial-gradient(closest-side_at_40%_40%,rgb(167_252_205/0.6),transparent),radial-gradient(closest-side_at_75%_65%,rgb(160_181_235/0.55),transparent)] blur-2xl" />

      <div className="flex justify-between">
        <Link>allow</Link>
        <Link>ask</Link>
        <Link>block</Link>
      </div>
      <div className="mx-8 h-4 rounded-b-md border-x border-b border-[#4b5563]/40" />
      <div className="mx-auto h-4 w-px bg-[#4b5563]/40" />

      <div className="relative overflow-hidden rounded-xl border border-ash bg-[#fdfcfb]/95 p-3.5 pb-0 shadow-[0_0_10px_rgba(0,0,0,0.06)] [mask-image:linear-gradient(to_bottom,#000_70%,transparent)]">
        <p className="flex items-center justify-between text-[13px] font-medium text-off-black">
          Policy
          <span className="font-mono text-[11px] font-normal text-smoke">strict-local.yaml</span>
        </p>
        <div className="mt-3 space-y-2 pb-4">
          <RuleRow n={1} decision="ask">
            <Code>path</Code> matches <Code>**/.env*</Code>
          </RuleRow>
          <RuleRow n={2} decision="block">
            <Code>host</Code> not in <Code>github.com</Code> <Code>npmjs.org</Code>
          </RuleRow>
          <RuleRow n={3} decision="ask" faded>
            <Code>cmd</Code> starts with <Code>git push -f</Code>
          </RuleRow>
        </div>
      </div>
    </div>
  );
}

/* --- 3. MCP Scanner: server cards --- */

function ServerCard({
  name,
  tags,
  status,
  className,
  icon,
}: {
  name: string;
  tags: { label: string; tone?: "neutral" | "warn" | "block" | "allow" }[];
  status: "allow" | "warn" | "block";
  className: string;
  icon: ReactNode;
}) {
  const badge = {
    allow: { bg: "bg-[#1f7a4d]", path: "M6 10.5l2.5 2.5L14 7.5" },
    warn: { bg: "bg-[#b07000]", path: "M10 6v5M10 13.8v.2" },
    block: { bg: "bg-[#b3261e]", path: "M7 7l6 6M13 7l-6 6" },
  }[status];
  return (
    <div className={`absolute w-[44%] rounded-xl border border-ash bg-[#fdfcfb] p-3 shadow-[0_0_10px_rgba(0,0,0,0.07)] ${className}`}>
      <span className={`absolute top-2.5 right-2.5 flex size-4 items-center justify-center rounded-full ring-2 ring-[#fdfcfb] ${badge.bg}`}>
        <svg viewBox="0 0 20 20" className="size-3" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <path d={badge.path} />
        </svg>
      </span>
      <IconCircle>{icon}</IconCircle>
      <p className="mt-2.5 font-mono text-[13px] text-off-black">{name}</p>
      <div className="mt-2 flex flex-col items-start gap-1">
        {tags.map((t) => (
          <Tag key={t.label} tone={t.tone}>{t.label}</Tag>
        ))}
      </div>
    </div>
  );
}

export function ScannerIllustration() {
  const plug = <path d="M7.5 3v3.5M12.5 3v3.5M5.5 6.5h9v3a4.5 4.5 0 0 1-9 0zM10 14v3" />;
  return (
    <div aria-hidden="true" className="relative h-[18rem] w-full max-w-[22rem]">
      <div className="pointer-events-none absolute -inset-8 -z-10 bg-[radial-gradient(closest-side_at_35%_60%,rgb(255_148_115/0.5),transparent),radial-gradient(closest-side_at_75%_40%,rgb(236_218_152/0.75),transparent)] blur-2xl" />
      {/* dashed scan path */}
      <div className="absolute top-8 left-[30%] h-44 w-[58%] rounded-xl border border-dashed border-graphite/40" />
      <ServerCard
        name="github"
        status="allow"
        className="top-0 left-0"
        icon={plug}
        tags={[{ label: "12 tools" }, { label: "scopes ok", tone: "allow" }, { label: "unchanged" }]}
      />
      <ServerCard
        name="filesystem"
        status="warn"
        className="top-8 left-[28%] z-10"
        icon={plug}
        tags={[{ label: "read_file" }, { label: "hidden text", tone: "warn" }]}
      />
      <ServerCard
        name="notes-sync"
        status="block"
        className="top-[4.5rem] left-[56%] z-20"
        icon={plug}
        tags={[{ label: "changed since approval", tone: "block" }, { label: "+ network scope", tone: "block" }]}
      />
    </div>
  );
}

/* --- 4. Memory Firewall: shield filter --- */

export function FirewallIllustration() {
  return (
    <div aria-hidden="true" className="relative flex w-full max-w-[22rem] items-center justify-between gap-2 sm:gap-3">
      <div className="pointer-events-none absolute -inset-8 -z-10 bg-[radial-gradient(closest-side_at_50%_50%,rgb(167_252_205/0.7),transparent),radial-gradient(closest-side_at_85%_30%,rgb(207_218_245/0.9),transparent)] blur-2xl" />

      {/* incoming writes */}
      <ul className="flex flex-col gap-2">
        {["prefers pnpm", "tests in /spec", "“skip review”"].map((m, i) => (
          <li
            key={m}
            className={`memory-in rounded-full border bg-[#fdfcfb] px-2.5 py-1 font-mono text-[11px] whitespace-nowrap ${
              i === 2 ? "border-[#b3261e]/40 text-[#b3261e]" : "border-ash text-graphite"
            }`}
            style={{ animationDelay: `${i * 0.6}s` }}
          >
            {m}
          </li>
        ))}
      </ul>

      {/* shield filter with a sweeping scan line */}
      <div className="relative h-28 w-16 shrink-0 sm:h-36 sm:w-24">
        <svg viewBox="0 0 96 144" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="fw-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a0b5eb" />
              <stop offset="100%" stopColor="#ff9473" />
            </linearGradient>
            <clipPath id="fw-clip">
              <path d="M48 3 L92 18 V70 C92 104 74 128 48 141 C22 128 4 104 4 70 V18 Z" />
            </clipPath>
          </defs>
          <path d="M48 3 L92 18 V70 C92 104 74 128 48 141 C22 128 4 104 4 70 V18 Z" fill="url(#fw-fill)" stroke="#242424" strokeOpacity="0.7" strokeWidth="1.2" />
          {/* filter mesh */}
          <g clipPath="url(#fw-clip)" stroke="#fdfcfb" strokeOpacity="0.35" strokeWidth="1">
            {Array.from({ length: 11 }, (_, k) => (
              <line key={`h${k}`} x1="0" x2="96" y1={14 + k * 12} y2={14 + k * 12} />
            ))}
            {Array.from({ length: 7 }, (_, k) => (
              <line key={`v${k}`} y1="0" y2="144" x1={12 + k * 12} x2={12 + k * 12} />
            ))}
          </g>
          <g clipPath="url(#fw-clip)">
            <rect className="fw-scan" x="0" y="0" width="96" height="3" fill="#fdfcfb" opacity="0.9" />
          </g>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-8 items-center justify-center rounded-full border border-off-black/60 bg-[#fdfcfb] sm:size-10">
            <svg viewBox="0 0 20 20" className="size-4 sm:size-5" fill="none" stroke="#242424" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="9" width="10" height="7.5" rx="1.5" />
              <path d="M7.5 9V6.5a2.5 2.5 0 0 1 5 0V9" />
            </svg>
          </span>
        </div>
      </div>

      {/* outcomes */}
      <div className="flex flex-col gap-2.5">
        <div className="rounded-xl border border-ash bg-[#fdfcfb] p-2.5 shadow-[0_0_10px_rgba(0,0,0,0.06)]">
          <p className="text-[12px] font-medium text-off-black">Saved</p>
          <div className="mt-1.5 flex flex-col items-start gap-1">
            <Tag tone="allow">pnpm</Tag>
            <Tag tone="allow">/spec</Tag>
          </div>
        </div>
        <div className="rounded-xl border border-[#b3261e]/35 bg-[#fdfcfb] p-2.5 shadow-[0_0_10px_rgba(0,0,0,0.06)]">
          <p className="text-[12px] font-medium text-[#b3261e]">Quarantined</p>
          <div className="mt-1.5">
            <Tag tone="block">skip review</Tag>
          </div>
        </div>
      </div>
    </div>
  );
}
