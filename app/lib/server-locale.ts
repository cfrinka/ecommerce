import { cookies } from 'next/headers';
import type { Locale } from './i18n';

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get('bene-locale')?.value;
  if (value === 'pt-BR') return 'pt-BR';
  return 'en';
}
