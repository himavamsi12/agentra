import { AgentTerminal } from "./AgentTerminal";

const NOTES = [
  { title: "Every event, in order", body: "File reads, commands, MCP calls and network requests on one timeline." },
  { title: "Rules decide", body: "Deterministic allow / ask / block policies. No LLM in the loop." },
  { title: "Chains, not just events", body: "A secret read followed by an upload is flagged as one attack." },
];

export function TerminalSection() {
  return (
    <section aria-labelledby="terminal-heading" className="px-5 pb-24 sm:px-10 sm:pb-36">
      <div className="mx-auto max-w-[1432px]">
        <div className="reveal mx-auto max-w-3xl text-center">
          <p className="font-mono text-body-sm uppercase text-graphite">What Agentra sees</p>
          <h2 id="terminal-heading" className="mt-5 text-balance text-heading-sm text-off-black sm:text-heading-lg">
            Twelve seconds of a normal session.{" "}
            <span className="text-graphite">One of them wasn&rsquo;t.</span>
          </h2>
        </div>

        <div className="relative mx-auto mt-12 max-w-[1080px] sm:mt-16">
          {/* soft wash behind the terminal */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[8%] -inset-y-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(255_148_115/0.35),transparent),radial-gradient(closest-side_at_70%_60%,rgb(160_181_235/0.45),transparent)] blur-3xl"
          />
          <AgentTerminal />
        </div>

        <ul className="mx-auto mt-12 grid max-w-[1080px] gap-8 sm:mt-16 md:grid-cols-3 md:gap-10">
          {NOTES.map((n, i) => (
            <li key={n.title} className="reveal border-t border-ash pt-5">
              <span className="font-mono text-caption uppercase text-smoke">0{i + 1}</span>
              <h3 className="mt-3 text-subheading text-off-black">{n.title}</h3>
              <p className="mt-2 text-body text-graphite">{n.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
