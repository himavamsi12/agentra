import { getSql } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SOURCES = new Set(["hero", "footer-cta"]);

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Malformed request" }, { status: 400 });
  }

  const { email, source } = (body ?? {}) as { email?: unknown; source?: unknown };

  if (typeof email !== "string" || email.length > 254 || !EMAIL_RE.test(email.trim())) {
    return Response.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  try {
    const sql = getSql();
    await sql`
      insert into early_access (email, source, user_agent)
      values (
        ${email.trim()},
        ${typeof source === "string" && SOURCES.has(source) ? source : "unknown"},
        ${request.headers.get("user-agent")?.slice(0, 512) ?? null}
      )
      on conflict do nothing
    `;
  } catch (error) {
    console.error("[agentra] early-access insert failed", error);
    return Response.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }

  // A repeat address is a no-op insert, but the visitor still sees success.
  return Response.json({ ok: true }, { status: 201 });
}
