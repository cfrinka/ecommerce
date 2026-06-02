'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function setLocale(formData: FormData) {
  const locale = formData.get('locale') as string;
  const cookieStore = await cookies();
  cookieStore.set('bene-locale', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
  revalidatePath('/', 'layout');
}
