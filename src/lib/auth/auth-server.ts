import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { admin } from 'better-auth/plugins/admin';

import { db } from '@/drizzle';
import { account, session, user, verification } from '@/drizzle/schema';
import { env } from '@/env';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    debugLogs: true,
    provider: 'pg',
    schema: {
      account,
      session,
      user,
      verification
    }
  }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data, request) {
      // Send an email to the user with a link to reset their password
    }
  },
  plugins: [nextCookies(), admin()],
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    }
  }
});
