'use client';

import { useMemo } from 'react';
import { getDictionary, getClientLocale, type Locale } from '@/app/lib/i18n';

export function useTranslation() {
  const locale: Locale = getClientLocale();
  const t = useMemo(() => getDictionary(locale), [locale]);
  return { t, locale };
}
