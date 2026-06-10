import Link from 'next/link';
import Image from 'next/image';
import { getUser } from '@/app/lib/auth';
import { logout } from '@/app/actions/auth';
import { getLocale } from '@/app/lib/server-locale';
import { getDictionary } from '@/app/lib/i18n';
import { ShoppingCart, User, Package, LayoutDashboard } from 'lucide-react';
import { LocaleSwitcher } from './LocaleSwitcher';

export async function Navbar() {
  const user = await getUser();
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <header className="sticky top-0 z-50 border-b border-[#ddd] bg-[#f5f3f0]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/assets/logo.svg" alt="BENE" width={40} height={40} className="h-20 w-auto" />
        </Link>

        <nav className="flex items-center gap-5">
          <Link href="/cart" className="flex items-center gap-1.5 text-sm font-medium text-[#282828] transition hover:text-[#be1622]">
            <ShoppingCart className="h-4 w-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">{t.nav.cart}</span>
          </Link>

          <LocaleSwitcher defaultLocale={locale} />

          {user ? (
            <>
              <Link href="/orders" className="flex items-center gap-1.5 text-sm font-medium text-[#282828] transition hover:text-[#be1622]">
                <Package className="h-4 w-4" strokeWidth={1.5} />
                <span className="hidden sm:inline">{t.nav.orders}</span>
              </Link>
              {user.role === 'admin' && (
                <Link href="/admin" className="flex items-center gap-1.5 text-sm font-medium text-[#282828] transition hover:text-[#be1622]">
                  <LayoutDashboard className="h-4 w-4" strokeWidth={1.5} />
                  <span className="hidden sm:inline">{t.nav.admin}</span>
                </Link>
              )}
              <form action={logout}>
                <button type="submit" className="flex items-center gap-1.5 text-sm font-medium text-[#282828] transition hover:text-[#be1622]">
                  <User className="h-4 w-4" strokeWidth={1.5} />
                  <span className="hidden sm:inline">{t.nav.logout}</span>
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-[#282828] transition hover:text-[#be1622]">{t.nav.login}</Link>
              <Link
                href="/signup"
                className="rounded-sm bg-[#282828] px-4 py-1.5 text-sm font-medium text-[#f5f3f0] transition hover:bg-[#be1622]"
              >
                {t.nav.signup}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
