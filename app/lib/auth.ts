import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { getDb } from './db';

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || 'bene-tshirt-secret-key-change-me');

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: number, role: string) {
  const token = await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET, { clockTolerance: 60 });
    return payload as { userId: number; role: string };
  } catch {
    return null;
  }
}

export async function getUser() {
  const session = await getSession();
  if (!session) return null;

  const db = getDb();
  const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(session.userId) as
    | { id: number; name: string; email: string; role: string }
    | undefined;

  return user || null;
}

export async function requireAuth() {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');
  return user;
}

export async function requireAdmin() {
  const user = await getUser();
  if (!user || user.role !== 'admin') throw new Error('Forbidden');
  return user;
}
