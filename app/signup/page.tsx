'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { signup } from '../actions/auth';
import { useTranslation } from '../hooks/useTranslation';

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, undefined);
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <h1 className="text-center font-display text-4xl tracking-wide text-[#282828]">{t.signup.title}</h1>
      <p className="mt-3 text-center text-sm text-[#282828]/70">{t.signup.subtitle}</p>

      <form action={action} className="mt-10 space-y-5">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">{t.signup.name}</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#faf9f7] px-3 py-2.5 text-sm text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828] placeholder:text-[#282828]/40"
          />
          {state?.errors?.name && <p className="mt-1 text-xs text-[#be1622]">{state.errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">{t.signup.email}</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#faf9f7] px-3 py-2.5 text-sm text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828] placeholder:text-[#282828]/40"
          />
          {state?.errors?.email && <p className="mt-1 text-xs text-[#be1622]">{state.errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">{t.signup.password}</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#faf9f7] px-3 py-2.5 text-sm text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828] placeholder:text-[#282828]/40"
          />
          {state?.errors?.password && <p className="mt-1 text-xs text-[#be1622]">{state.errors.password}</p>}
        </div>

        {state?.message && <p className="text-sm text-[#be1622]">{state.message}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-sm bg-[#282828] py-3 text-sm font-medium tracking-widest text-[#f5f3f0] transition hover:bg-[#be1622] disabled:opacity-50"
        >
          {pending ? t.signup.creatingAccount : t.signup.createAccount}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-[#282828]/70">
        {t.signup.haveAccount}{' '}
        <Link href="/login" className="font-medium tracking-wider text-[#282828] transition hover:text-[#be1622]">
          {t.signup.signIn}
        </Link>
      </p>
    </div>
  );
}
