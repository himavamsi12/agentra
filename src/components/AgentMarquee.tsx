const AGENTS = ["Claude Code", "Cursor", "Codex", "Gemini CLI", "Cline", "Aider", "Any MCP client"];

function AgentList({ hidden }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-14 pr-14 sm:gap-20 sm:pr-20">
      {AGENTS.map((name) => (
        <li key={name} className="flex items-center gap-3 whitespace-nowrap font-mono text-label uppercase text-off-black">
          <svg viewBox="0 0 20 20" className="size-5 text-graphite" fill="none" aria-hidden="true">
            <rect x="1.5" y="3.5" width="17" height="13" rx="3" stroke="currentColor" strokeWidth="1.3" />
            <path d="M5.5 8l2.5 2-2.5 2M10 12.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {name}
        </li>
      ))}
    </ul>
  );
}

export function AgentMarquee() {
  return (
    <section aria-labelledby="agents-heading" className="px-5 py-16 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-[1432px]">
        <h2 id="agents-heading" className="font-mono text-body-sm uppercase text-graphite">
          Built for the agents already on your machine
        </h2>

        <div className="marquee marquee-mask mt-8 overflow-hidden motion-reduce:[mask-image:none]">
          <div className="marquee-track flex w-max motion-reduce:w-full motion-reduce:animate-none">
            <AgentList />
            <div className="motion-reduce:hidden">
              <AgentList hidden />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
