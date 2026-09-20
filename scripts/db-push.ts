import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const schema = readFileSync("scripts/schema.sql", "utf8");

  // One command per call: the Neon HTTP driver doesn't take multi-statement strings.
  for (const statement of schema.split(";").map((s) => s.trim()).filter(Boolean)) {
    await sql.query(statement);
  }

  console.log("schema applied");
}

main();
