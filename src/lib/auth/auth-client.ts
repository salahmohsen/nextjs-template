import { createAuthClient } from 'better-auth/client';
import { inferAdditionalFields } from 'better-auth/client/plugins';

import { env } from '@/env';

import type { auth } from './auth-server';

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  plugins: [inferAdditionalFields<typeof auth>()]
});

export const { signIn, signOut, signUp, useSession } = authClient;
