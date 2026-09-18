import { EmailCapture } from "./EmailCapture";
import { FlowDiagram } from "./flow/FlowDiagram";

export function Hero() {
  return (
    <section
      id="early-access"
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden px-5 pt-24 pb-8 sm:px-10 sm:pt-32 sm:pb-12"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <p className="animate-rise inline-flex items-center gap-2.5 rounded-full border border-ash bg-parchment px-4 py-2 font-mono text-caption uppercase text-off-black">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-coral motion-reduce:hidden" />
            <span className="relative size-2 rounded-full bg-off-black" />
          </span>
          Coming soon · Open source
        </p>

        <div className="relative mt-8">
          <div
            aria-hidden="true"
            className="hero-wash pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[120%] w-[90%] -translate-x-1/2 -translate-y-1/2 opacity-70"
          />
          <h1
            id="hero-heading"
            className="animate-rise text-balance text-[2.75rem] leading-[1.02] tracking-[-0.025em] text-off-black [animation-delay:80ms] sm:text-[4rem] md:text-display"
          >
            Give AI agents autonomy.
            <span className="block text-graphite">Not unrestricted access.</span>
          </h1>
        </div>

        <p className="animate-rise mt-7 max-w-[40rem] text-pretty text-body text-graphite [animation-delay:160ms] sm:text-body-lg">
          A local-first security layer that shows you every file, command, and network call
          your coding agent makes&nbsp;&mdash; and stops the ones it shouldn&rsquo;t.
        </p>

        <div className="animate-rise mt-10 flex w-full justify-center [animation-delay:240ms]">
          <EmailCapture source="hero" />
        </div>
      </div>

      <div className="animate-rise mx-auto mt-10 max-w-[1320px] [animation-delay:400ms] sm:mt-14">
        {/* The diagram reserves its own aspect-ratio box and fixed-height readout — no layout shift. */}
        <div className="hidden w-full md:block">
          <FlowDiagram variant="wide" />
        </div>
        <div className="mx-auto w-full max-w-[400px] md:hidden">
          <FlowDiagram variant="tall" />
        </div>
      </div>
    </section>
  );
}
