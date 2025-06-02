'use server';

import { EncryptJWT, jwtDecrypt, JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/env';

import { fetcher } from '../fetcher';
import { LoginResponse, Session, User } from './auth.types';

const key = new TextEncoder().encode(env.JWT_SECRET_KEY);

export async function decryptSession(
  session: string
): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtDecrypt(session, key);
    return payload;
  } catch (error) {
    console.error('Failed to decrypt session:', error);
    return null;
  }
}

export async function destroySession() {
  console.log('destroySession is running!');
  const cookieStore = await cookies();
  cookieStore.set('session', '', { expires: new Date(0) });
}

export async function encryptSession(payload: JWTPayload): Promise<string> {
  const session = await new EncryptJWT(payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .encrypt(key);

  return session;
}

export async function getAuthToken(): Promise<null | string> {
  try {
    const { token } = await getSession();
    return token ?? null;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<null | User> {
  try {
    const { user } = await getSession();
    return user ?? null;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) redirect('/login');
  const decrypted = (await decryptSession(session)) as Session;
  return decrypted;
}

export async function refreshAuthToken(): Promise<null | Session> {
  try {
    const currentToken = await getAuthToken();
    if (!currentToken) throw new Error('No token found');

    const response = await fetcher<LoginResponse>('/v1/auth/refresh-token', {
      bearerToken: currentToken,
      method: 'POST'
    });

    if (!response.error || response.data?.statusCode !== 200) {
      throw new Error(response.data?.message || 'Token refresh failed');
    }

    const cookieStore = await cookies();
    const expires = new Date(
      Date.now() + response.data.data.expires_in_minutes * 60 * 1000
    );
    const encryptedSession = await encryptSession(response.data.data);
    cookieStore.set('session', encryptedSession, {
      expires,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });

    return response.data.data;
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

export async function setSession(session: Session) {
  try {
    const encryptedSession = await encryptSession(session);

    const expires = new Date(
      Date.now() + session.expires_in_minutes * 60 * 1000
    );

    const cookieStore = await cookies();
    cookieStore.set('session', encryptedSession, {
      expires,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
  } catch (error) {
    console.error('Failed to set session:', error);
  }
}

export async function signIn(credentials: FormData) {
  try {
    const email = credentials.get('email');
    const password = credentials.get('password');
    if (!email || !password) throw new Error('Invalid credentials');

    // @ToDo: Validate the credentials against the schema

    const response = await fetcher<LoginResponse>('/v1/auth/signin', {
      body: { email, password },
      method: 'POST'
    });

    if (!response.error || response.data?.statusCode !== 200) {
      throw new Error(
        response.data?.message || 'Email or password is incorrect'
      );
    }

    const session = response.data.data;

    await setSession(session);

    return { success: true, user: session.user };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      errorMessage: error instanceof Error ? error.message : 'Sign in failed',
      success: false
    };
  }
}

export async function signOut() {
  await destroySession();
  redirect('/login');
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) return;

  console.log('Auth:// updateSession is running!');

  const parsed = await decryptSession(session);
  if (!parsed) {
    console.error('Failed to decrypt session');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const currentTime = Date.now();
  const expiresInMinutes = (parsed as Session).expires_in_minutes;
  const expiresInMilliseconds = expiresInMinutes * 60 * 1000;
  const expiry = Date.now() + expiresInMilliseconds;

  if (expiry - currentTime < 30 * 60 * 1000) {
    console.log('Session close to expiring, attempting to refresh token');

    // Try to refresh the token
    const refreshResult = await refreshAuthToken();
    if (!refreshResult) {
      console.error('Token refresh failed');
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    const newExpires = new Date(
      Date.now() + refreshResult.expires_in_minutes * 60 * 1000
    );
    const updatedSession = {
      expires: newExpires,
      token: refreshResult.token,
      user: refreshResult.user || parsed.user
    };

    const res = NextResponse.next();
    res.cookies.set({
      expires: newExpires,
      httpOnly: true,
      name: 'session',
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      value: await encryptSession(updatedSession)
    });

    return res;
  }

  // Session is still valid, just continue
  return NextResponse.next();
}
