import { writeFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);

  const rows = (await sql`
    select email, source, created_at
    from early_access
    order by created_at asc
  `) as { email: string; source: string; created_at: Date }[];

  // Excel reads this straight; quotes are doubled per RFC 4180.
  const csv = [
    "email,source,created_at",
    ...rows.map((r) =>
      [r.email, r.source, new Date(r.created_at).toISOString()]
        .map((v) => `"${String(v).replaceAll('"', '""')}"`)
        .join(","),
    ),
  ].join("\n");

  writeFileSync("early-access.csv", `${csv}\n`);
  console.log(`wrote early-access.csv (${rows.length} signups)`);
}

main();
