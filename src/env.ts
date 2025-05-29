import { createEnv } from '@t3-oss/env-nextjs';
import { type } from 'arktype';

export const env = createEnv({
  client: {
    NEXT_PUBLIC_BASE_URL: type('string.url')
  },
  emptyStringAsUndefined: true,
  runtimeEnv: {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEON_DATABASE_URL: process.env.NEON_DATABASE_URL,
    NEW_USER_ROLE: process.env.NEW_USER_ROLE,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NODE_ENV: process.env.NODE_ENV
  },
  server: {
    BETTER_AUTH_SECRET: type('string.alphanumeric'),
    GOOGLE_CLIENT_ID: type('string'),
    GOOGLE_CLIENT_SECRET: type('string'),
    NEON_DATABASE_URL: type('string.url'),
    NEW_USER_ROLE: type("'admin' | 'user'"),
    NODE_ENV: type("'development' | 'production'")
  }
});
