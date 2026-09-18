const POINTS = [
  {
    phrase: "Every file.",
    body: "Agents read the whole repository to build context — including the .env you forgot was in it.",
  },
  {
    phrase: "Any command.",
    body: "Shell access turns one confident suggestion into curl | sh, a force-push, or an rm -rf.",
  },
  {
    phrase: "No record.",
    body: "Ask what your agent touched in the last hour. Most developers can’t answer.",
  },
];

export function Problem() {
  return (
    <section aria-labelledby="problem-heading" className="px-5 py-24 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-[1432px]">
        <div className="reveal max-w-3xl">
          <p className="font-mono text-body-sm uppercase text-graphite">The problem</p>
          <h2 id="problem-heading" className="mt-5 text-balance text-heading-sm text-off-black sm:text-heading">
            Coding agents got autonomy.{" "}
            <span className="text-graphite">You didn&rsquo;t get a view into what they do with it.</span>
          </h2>
        </div>

        <ol className="mt-14 grid border-t border-ash sm:mt-16 md:grid-cols-3">
          {POINTS.map((p, i) => (
            <li
              key={p.phrase}
              className="reveal border-b border-ash py-8 md:border-b-0 md:border-l md:px-8 md:py-10 md:first:border-l-0 md:first:pl-0 lg:px-10"
            >
              <span className="font-mono text-caption uppercase text-smoke">0{i + 1}</span>
              <p className="mt-4 font-display text-[2.25rem] leading-none tracking-[-0.025em] whitespace-nowrap text-off-black lg:text-[2.75rem]">
                {p.phrase}
              </p>
              <p className="mt-4 max-w-sm text-body text-graphite">{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
