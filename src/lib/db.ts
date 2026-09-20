import { neon } from "@neondatabase/serverless";

type Sql = ReturnType<typeof neon>;

let cached: Sql | null = null;

/**
 * Lazy so `next build` doesn't crash when DATABASE_URL isn't set yet
 * (neon() throws on an empty connection string at module load).
 */
export function getSql(): Sql {
  if (!cached) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    cached = neon(url);
  }
  return cached;
}
