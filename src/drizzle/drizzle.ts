import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

import { env } from '@/env';

const pool = new Pool({ connectionString: env.NEON_DATABASE_URL });
export const db = drizzle(pool);

export type DB = typeof db;
