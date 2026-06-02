import { getDb } from '../lib/db';
import { getAllOrders } from '../actions/orders';
import Link from 'next/link';

export default async function AdminPage() {
  const db = getDb();
  const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'customer'").get() as { count: number };
  const orders = await getAllOrders();
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-sm border border-[#ddd] bg-[#faf9f7] p-5">
          <p className="text-xs font-semibold tracking-wider text-[#282828]/60 uppercase">Total Products</p>
          <p className="mt-2 font-display text-3xl tracking-wide text-[#282828]">{totalProducts.count}</p>
        </div>
        <div className="rounded-sm border border-[#ddd] bg-[#faf9f7] p-5">
          <p className="text-xs font-semibold tracking-wider text-[#282828]/60 uppercase">Total Customers</p>
          <p className="mt-2 font-display text-3xl tracking-wide text-[#282828]">{totalUsers.count}</p>
        </div>
        <div className="rounded-sm border border-[#ddd] bg-[#faf9f7] p-5">
          <p className="text-xs font-semibold tracking-wider text-[#282828]/60 uppercase">Total Revenue</p>
          <p className="mt-2 font-display text-3xl tracking-wide text-[#282828]">${(totalRevenue / 100).toFixed(2)}</p>
        </div>
        <div className="rounded-sm border border-[#ddd] bg-[#faf9f7] p-5">
          <p className="text-xs font-semibold tracking-wider text-[#282828]/60 uppercase">Pending Orders</p>
          <p className="mt-2 font-display text-3xl tracking-wide text-[#be1622]">{pendingOrders}</p>
        </div>
      </div>

      <div className="rounded-sm border border-[#ddd] bg-[#faf9f7] overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#ddd] px-5 py-4">
          <h2 className="text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs font-semibold text-[#282828]/60 transition hover:text-[#be1622]">View All</Link>
        </div>
        <div className="divide-y divide-[#ddd]">
          {orders.slice(0, 5).map((order: any) => (
            <div key={order.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-[#282828]">Order #{order.id}</p>
                <p className="text-xs text-[#282828]/60">{order.user_name} &middot; {new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[#282828]">${(order.total / 100).toFixed(2)}</p>
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold tracking-wider uppercase ${
                    order.status === 'delivered'
                      ? 'bg-[#355444]/10 text-[#355444]'
                      : order.status === 'shipped'
                      ? 'bg-[#2a5473]/10 text-[#2a5473]'
                      : 'bg-[#be1622]/10 text-[#be1622]'
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
