import type { ReactNode } from "react";
import { ChainIllustration, FirewallIllustration, RulesIllustration, ScannerIllustration } from "./illustrations";

function ModuleIcon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 32 32" className="size-8 text-off-black" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

function CardText({ icon, title, body, label }: { icon: ReactNode; title: string; body: string; label: string }) {
  return (
    <div>
      <ModuleIcon>{icon}</ModuleIcon>
      <p className="mt-6 font-mono text-caption uppercase text-smoke">{label}</p>
      <h3 className="mt-2 text-subheading text-off-black sm:text-[1.75rem]">{title}</h3>
      <p className="mt-3 max-w-md text-body text-graphite">{body}</p>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="px-5 pt-8 pb-24 sm:px-10 sm:pb-32">
      <div className="mx-auto max-w-[1432px]">
        <h2 id="how-heading" className="reveal text-heading-sm text-off-black sm:text-heading-lg">
          How Agentra works
        </h2>

        <div className="mt-10 grid gap-4 sm:mt-12 lg:grid-cols-12">
          {/* tall: Coding Agent Security */}
          <article className="reveal flex flex-col overflow-hidden rounded-[28px] border border-ash p-6 sm:p-8 lg:col-span-5 lg:row-span-3">
            <CardText
              label="Module 01"
              title="Coding Agent Security"
              body="A live timeline of every file read, command run, and network call, with attack-chain detection that connects events a single log line would miss."
              icon={<><rect x="4" y="7" width="24" height="18" rx="3" /><path d="M9 13l3 3-3 3M15 19h7" /></>}
            />
            <div className="isolate flex flex-1 items-center justify-center pt-6">
              <ChainIllustration />
            </div>
          </article>

          {/* wide: Runtime Security */}
          <article className="reveal grid items-center gap-8 overflow-hidden rounded-[28px] border border-ash p-6 sm:p-8 md:grid-cols-2 lg:col-span-7">
            <CardText
              label="Module 02"
              title="Runtime Security"
              body="Deterministic allow / ask / block policies. Rules decide what’s permitted, not an LLM that can be talked out of it."
              icon={<><path d="M8 5v22M8 11h10a4 4 0 0 1 4 4v0a4 4 0 0 0 4 4" /><circle cx="8" cy="5" r="2" /><circle cx="26" cy="21" r="2" /><circle cx="8" cy="27" r="2" /></>}
            />
            <div className="isolate flex justify-center py-2">
              <RulesIllustration />
            </div>
          </article>

          {/* wide: MCP Scanner */}
          <article className="reveal grid items-center gap-8 overflow-hidden rounded-[28px] border border-ash p-6 sm:p-8 md:grid-cols-2 lg:col-span-7">
            <CardText
              label="Module 03"
              title="MCP Scanner"
              body="Inspects MCP servers for hidden instructions in tool descriptions, excessive permissions, and silent changes to tools you already approved."
              icon={<><path d="M12 4v6M20 4v6M8 10h16v5a8 8 0 0 1-16 0zM16 23v5" /></>}
            />
            <div className="isolate flex justify-center">
              <ScannerIllustration />
            </div>
          </article>

          {/* wide: Memory Firewall */}
          <article className="reveal grid items-center gap-8 overflow-hidden rounded-[28px] border border-ash p-6 sm:p-8 md:grid-cols-2 lg:col-span-7">
            <CardText
              label="Module 04"
              title="Memory Firewall"
              body="Screens everything written into agent memory. Poisoned or untrusted entries are quarantined for review instead of quietly saved."
              icon={<><path d="M4 16h7M21 16h7" /><circle cx="16" cy="16" r="5" /></>}
            />
            <div className="isolate flex justify-center py-4">
              <FirewallIllustration />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
