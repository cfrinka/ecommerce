'use client';

import { setLocale } from '@/app/actions/locale';
import { useCallback, useState } from 'react';

export function LocaleSwitcher({ defaultLocale }: { defaultLocale: string }) {
  const [current, setCurrent] = useState(defaultLocale);

  const switchLocale = useCallback(async (locale: string) => {
    const formData = new FormData();
    formData.set('locale', locale);
    await setLocale(formData);
    setCurrent(locale);
    window.location.reload();
  }, []);

  return (
    <div className="flex items-center gap-1 rounded-sm border border-[#ddd] bg-[#faf9f7] p-0.5">
      <button
        type="button"
        onClick={() => switchLocale('en')}
        className={`flex items-center justify-center rounded-sm px-2 py-1 text-[11px] font-medium tracking-wider transition ${
          current === 'en'
            ? 'bg-[#282828] text-[#f5f3f0]'
            : 'text-[#282828]/60 hover:bg-[#f5f3f0] hover:text-[#282828]'
        }`}
        title="English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => switchLocale('pt-BR')}
        className={`flex items-center justify-center rounded-sm px-2 py-1 text-[11px] font-medium tracking-wider transition ${
          current === 'pt-BR'
            ? 'bg-[#282828] text-[#f5f3f0]'
            : 'text-[#282828]/60 hover:bg-[#f5f3f0] hover:text-[#282828]'
        }`}
        title="Português"
      >
        PT
      </button>
    </div>
  );
}
