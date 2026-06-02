'use server';

import { redirect } from 'next/navigation';
import { LoginSchema, SignupSchema, type LoginFormState, type SignupFormState } from '@/app/lib/definitions';
import { getDb } from '@/app/lib/db';
import { hashPassword, verifyPassword, createSession, deleteSession } from '@/app/lib/auth';

export async function signup(state: SignupFormState, formData: FormData): Promise<SignupFormState> {
  const validated = SignupSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(validated.data.email) as { id: number } | undefined;
  if (existing) {
    return { message: 'An account with this email already exists.' };
  }

  const hashed = await hashPassword(validated.data.password);
  const result = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(
    validated.data.name,
    validated.data.email,
    hashed,
    'customer'
  );

  await createSession(Number(result.lastInsertRowid), 'customer');
  redirect('/');
}

export async function login(state: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const validated = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const db = getDb();
  const user = db.prepare('SELECT id, password, role FROM users WHERE email = ?').get(validated.data.email) as
    | { id: number; password: string; role: string }
    | undefined;

  if (!user) {
    return { message: 'Invalid email or password.' };
  }

  const valid = await verifyPassword(validated.data.password, user.password);
  if (!valid) {
    return { message: 'Invalid email or password.' };
  }

  await createSession(user.id, user.role);
  redirect(user.role === 'admin' ? '/admin' : '/');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
