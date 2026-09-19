import type { ReactNode } from "react";
import { IconCircle, Link, Tag } from "./modules/illustrations";

function ModuleIcon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className="size-7 text-off-black" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

type Tone = "neutral" | "warn" | "block" | "allow";

type Feature = {
  title: string;
  body: string;
  icon: ReactNode;
  tags: { label: string; tone?: Tone }[];
};

const FEATURES: Feature[] = [
  {
    title: "Sessions & timeline",
    body: "Every agent session, every action, in order, grouped by the prompt that caused it.",
    icon: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.2 2" /></>,
    tags: [{ label: "session a41f" }, { label: "42 actions" }],
  },
  {
    title: "Attack tests",
    body: "12 simulated attacks mapped to the OWASP LLM Top 10, replayed against your live policy. Nothing executes.",
    icon: <><path d="M12 3.5 4.5 7v5.5c0 4.4 3.1 7.6 7.5 9 4.4-1.4 7.5-4.6 7.5-9V7Z" /><path d="M9 12l2.2 2.2L15.5 9.5" /></>,
    tags: [{ label: "12 / 12 passed", tone: "allow" }, { label: "OWASP LLM Top 10" }],
  },
  {
    title: "Compliance mapping",
    body: "What Agentra enforces, mapped to what auditors ask about: evidence is a click away, not a scramble.",
    icon: <><path d="M6 4h9l3 3v13H6z" /><path d="M9.5 12.5 11 14l3.5-4" /></>,
    tags: [{ label: "NIST" }, { label: "ISO 27001" }, { label: "SOC 2" }],
  },
  {
    title: "Inventory",
    body: "A full map of every AI app, CLI, editor extension, local model, skill, and rules file on the machine.",
    icon: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
    tags: [{ label: "7 agents" }, { label: "3 MCP servers" }, { label: "1 rules-file backdoor", tone: "warn" }],
  },
  {
    title: "Reviewable fixes",
    body: "Diff-based fixes you approve. Nothing is ever auto-applied, and every fix can be undone.",
    icon: <><path d="M4 12h16" /><path d="M13 6l6 6-6 6" /></>,
    tags: [{ label: "deterministic", tone: "allow" }, { label: "agent-written" }, { label: "Agentra AI · Pro" }],
  },
  {
    title: "CI/CD integration",
    body: "`agentra ci` runs the same checks on every pull request via native SARIF output, with per-finding attribution.",
    icon: <><path d="M8 6a3 3 0 1 0 0 6M8 12v0a3 3 0 0 0 3 3h2a3 3 0 0 1 3 3v0M16 18a3 3 0 1 0 0-6" /><path d="M8 6v12" /></>,
    tags: [{ label: "PR #482" }, { label: "hardcoded secret", tone: "block" }],
  },
  {
    title: "Zero cloud, zero telemetry",
    body: "Every scan and detection runs on your machine. No account, no server round-trip, nothing ever phoned home.",
    icon: <><path d="M12 3.5 4.5 7v5.5c0 4.4 3.1 7.6 7.5 9 4.4-1.4 7.5-4.6 7.5-9V7Z" /><path d="M9.5 12h5M12 9.5v5" /></>,
    tags: [{ label: "offline", tone: "allow" }, { label: "0 requests sent" }],
  },
];

function ChainLink() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 shrink-0 text-off-black/35" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M6.5 5H5a3 3 0 0 0 0 6h1.5M9.5 5H11a3 3 0 0 1 0 6H9.5M5.5 8h5" />
    </svg>
  );
}

function ChainStamp() {
  return (
    <div aria-hidden="true" className="relative flex items-center gap-1.5">
      {["b41a", "c02f", "9e17"].map((hash, i) => (
        <div key={hash} className="flex items-center gap-1.5">
          <span className="flex flex-col items-center gap-1 rounded-lg border border-ash bg-[#fdfcfb] px-2.5 py-2 shadow-[0_0_10px_rgba(0,0,0,0.06)]">
            <span className="font-mono text-[10px] text-smoke">block</span>
            <span className="font-mono text-[11.5px] text-off-black">{hash}</span>
          </span>
          {i < 2 && <ChainLink />}
        </div>
      ))}
    </div>
  );
}

export function Capabilities() {
  return (
    <section aria-labelledby="capabilities-heading" className="px-5 pb-24 sm:px-10 sm:pb-32">
      <div className="mx-auto max-w-[1432px]">
        <p className="reveal font-mono text-caption uppercase text-smoke">Also built in</p>
        <h2 id="capabilities-heading" className="reveal mt-2 text-heading-sm text-off-black sm:text-heading-lg">
          Everything else you&rsquo;d expect from a security tool
        </h2>

        <div className="mt-10 grid gap-4 sm:mt-12 lg:grid-cols-12">
          {/* featured: tamper-evident log */}
          <article className="reveal relative flex flex-col overflow-hidden rounded-[28px] border border-ash p-6 sm:p-8 sm:col-span-2 lg:col-span-4 lg:row-span-2">
            <div className="pointer-events-none absolute -inset-10 -z-10 bg-[radial-gradient(closest-side_at_30%_20%,rgb(167_252_205/0.55),transparent),radial-gradient(closest-side_at_80%_60%,rgb(207_218_245/0.85),transparent)] blur-2xl" />
            <IconCircle>
              <rect x="5" y="9" width="10" height="7.5" rx="1.5" />
              <path d="M7.5 9V6.5a2.5 2.5 0 0 1 5 0V9" />
            </IconCircle>
            <p className="mt-6 font-mono text-caption uppercase text-smoke">Chain of custody</p>
            <h3 className="mt-2 text-subheading text-off-black sm:text-[1.75rem]">Tamper-evident log</h3>
            <p className="mt-3 max-w-sm text-body text-graphite">
              A cryptographic hash chain proves the security log hasn&rsquo;t been altered. <code className="rounded border border-ash bg-parchment px-1 py-px font-mono text-[13px] text-off-black">agentra verify</code> gives you proof, not just a claim.
            </p>
            <div className="mt-8 flex flex-1 items-end">
              <div className="flex flex-col items-start gap-3">
                <ChainStamp />
                <Link>chain intact</Link>
              </div>
            </div>
          </article>

          {/* the rest */}
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="hairline-hover reveal rounded-2xl border border-ash p-6 sm:p-7 lg:col-span-4"
            >
              <ModuleIcon>{f.icon}</ModuleIcon>
              <h3 className="mt-5 text-body-lg text-off-black">{f.title}</h3>
              <p className="mt-2 max-w-md text-body-sm text-graphite">{f.body}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {f.tags.map((t) => (
                  <Tag key={t.label} tone={t.tone}>{t.label}</Tag>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
