"use client";

import { useId, useState, type FormEvent } from "react";
import { CheckIcon } from "./icons";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Status = "idle" | "error" | "success";

export function EmailCapture({ source }: { source: "hero" | "footer-cta" }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const inputId = `${id}-email`;
  const msgId = `${id}-msg`;

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setStatus("error");
      return;
    }
    // No backend yet — the form is intentionally inert.
    console.log("[agentra] early-access signup", { email: value, source });
    setStatus("success");
  }

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
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              aria-invalid={status === "error"}
              aria-describedby={msgId}
              className="min-w-0 flex-1 bg-transparent text-body text-off-black placeholder:text-smoke focus:outline-none"
            />
            <button
              type="submit"
              className="group inline-flex h-full shrink-0 items-center gap-2 rounded-full bg-lake-blue px-4 text-caption uppercase text-white transition-colors hover:bg-lake-blue-deep focus-visible:outline-offset-2 sm:px-6 sm:text-body-sm"
            >
              <span className="hidden min-[380px]:inline">Get early access</span>
              <span className="min-[380px]:hidden">Join</span>
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                ▸
              </span>
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
          ? "Enter a valid email address"
          : status === "success"
            ? ""
            : "No spam · one email when the beta opens"}
      </p>
    </div>
  );
}
