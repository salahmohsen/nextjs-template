import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_BASE_URL: z.string().url()
  },
  emptyStringAsUndefined: true,
  runtimeEnv: {
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NODE_ENV: process.env.NODE_ENV
  },
  server: {
    JWT_SECRET_KEY: z.string().min(32), // Use a 256-bit (32-byte) key for encryption
    NODE_ENV: z.enum(['development', 'production'])
  }
});
