import { migrate } from 'drizzle-orm/neon-serverless/migrator';

import { db } from './drizzle';

await migrate(db, { migrationsFolder: './migrations' });
