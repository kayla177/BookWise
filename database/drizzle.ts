import config from "@/lib/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// connect to Neon database
const sql = neon(config.env.databaseUrl);

// initialize Drizzle ORM with Neon
export const db = drizzle({ client: sql });
