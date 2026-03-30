import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// Previne a criação de múltiplas conexões em hot-reloads do Next.js
const pool = postgres(connectionString, { max: 1 });

export const db = drizzle(pool, { schema });
