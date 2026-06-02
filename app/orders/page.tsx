import Link from "next/link";
import { Package } from "lucide-react";
import { getOrders } from "../actions/orders";
import { getLocale } from "../lib/server-locale";
import { getDictionary } from "../lib/i18n";

export default async function OrdersPage() {
  const orders = await getOrders();
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl tracking-wide text-[#282828]">{t.orders.title}</h1>

      {orders.length === 0 ? (
        <div className="mt-16 text-center">
          <Package className="mx-auto h-12 w-12 text-[#ddd]" strokeWidth={1} />
          <p className="mt-4 text-[#282828]/70">{t.orders.noOrders}</p>
          <Link href="/" className="mt-6 inline-block rounded-sm bg-[#282828] px-8 py-3 text-sm font-medium text-[#f5f3f0] transition hover:bg-[#be1622]">
            {t.orders.startShopping}
          </Link>
        </div>
      ) : (
        <div className="mt-10 space-y-6">
          {orders.map((order: any) => (
            <div key={order.id} className="rounded-sm border border-[#ddd] bg-[#faf9f7] p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium tracking-wide text-[#282828]">{t.orders.order} #{order.id}</p>
                  <p className="text-xs text-[#282828]/60">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-medium tracking-wider uppercase ${
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

              <div className="mt-5 space-y-3">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-[#282828]/80">
                      {item.product_name} &middot; Size {item.size} &times; {item.quantity}
                    </span>
                    <span className="font-medium tracking-wide text-[#282828]">${((item.price * item.quantity) / 100).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between border-t border-[#ddd] pt-4 gap-2">
                <span className="text-xs text-[#282828]/60 uppercase">{t.orders.shippingTo}: {order.shipping_address}</span>
                <span className="text-lg font-medium tracking-wide text-[#282828]">${(order.total / 100).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
