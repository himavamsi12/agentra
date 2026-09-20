"use client";

import { useId, useState, type FormEvent } from "react";
import { CheckIcon, RocketIcon } from "./icons";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Status = "idle" | "submitting" | "error" | "success";

export function EmailCapture({ source }: { source: "hero" | "footer-cta" }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("Enter a valid email address");

  const inputId = `${id}-email`;
  const msgId = `${id}-msg`;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setError("Enter a valid email address");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, source }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Something went wrong. Try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setError("Network error. Try again.");
      setStatus("error");
    }
  }

  const pending = status === "submitting";

  return (
    <div className="w-full max-w-lg">
      {status === "success" ? (
        <div
          role="status"
          className="flex h-14 items-center gap-3 rounded-full border border-ash bg-parchment px-5 text-body-sm"
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-off-black text-parchment">
            <CheckIcon className="size-3.5" />
          </span>
          <span className="truncate text-off-black">
            You&rsquo;re on the list.{" "}
            <span className="text-graphite">We&rsquo;ll write when it ships.</span>
          </span>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate>
          <label htmlFor={inputId} className="sr-only">
            Email address
          </label>
          <div
            className={`hairline-hover flex h-14 items-center rounded-full border bg-parchment p-1.5 pl-5 ${
              status === "error" ? "border-danger" : "border-ash"
            }`}
          >
            <input
              id={inputId}
              type="email"
              name="email"
              inputMode="email"
              autoComplete="email"
              spellCheck={false}
              placeholder="you@company.dev"
              value={email}
              disabled={pending}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              aria-invalid={status === "error"}
              aria-describedby={msgId}
              className="min-w-0 flex-1 bg-transparent text-body text-off-black placeholder:text-smoke focus:outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={pending}
              className="group inline-flex h-full shrink-0 items-center gap-2 rounded-full bg-lake-blue px-4 text-caption uppercase text-white transition-colors hover:bg-lake-blue-deep focus-visible:outline-offset-2 disabled:opacity-70 sm:px-6 sm:text-body-sm"
            >
              <span className="hidden min-[380px]:inline">
                {pending ? "Joining" : "Get early access"}
              </span>
              <span className="min-[380px]:hidden">{pending ? "..." : "Join"}</span>
              <RocketIcon className="size-3.5 shrink-0 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:rotate-12" />
            </button>
          </div>
        </form>
      )}

      {/* Reserved line so validation feedback never shifts layout. */}
      <p
        id={msgId}
        aria-live="polite"
        className={`mt-3 h-4 font-mono text-caption uppercase ${status === "error" ? "text-danger" : "text-smoke"}`}
      >
        {status === "error"
          ? error
          : status === "success"
            ? ""
            : "No spam · one email when the beta opens"}
      </p>
    </div>
  );
}
