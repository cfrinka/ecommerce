import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUser } from '../lib/auth';
import { LayoutDashboard, Package, ShoppingBag, ImageIcon } from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-10">
        <h1 className="font-display text-3xl tracking-wide text-[#282828]">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-[#282828]/70">Welcome back, {user.name}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-4">
        <aside className="space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium tracking-wider text-[#282828] transition hover:bg-[#faf9f7]"
          >
            <LayoutDashboard className="h-4 w-4" strokeWidth={1.5} />
            OVERVIEW
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium tracking-wider text-[#282828] transition hover:bg-[#faf9f7]"
          >
            <Package className="h-4 w-4" strokeWidth={1.5} />
            PRODUCTS
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium tracking-wider text-[#282828] transition hover:bg-[#faf9f7]"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
            ORDERS
          </Link>
          <Link
            href="/admin/banners"
            className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium tracking-wider text-[#282828] transition hover:bg-[#faf9f7]"
          >
            <ImageIcon className="h-4 w-4" strokeWidth={1.5} />
            BANNERS
          </Link>
        </aside>

        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  );
}
