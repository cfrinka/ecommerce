'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../components/CartContext';
import { placeOrder } from '../actions/orders';
import { useTranslation } from '../hooks/useTranslation';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useActionState, useState } from 'react';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const [address, setAddress] = useState('');
  const { t } = useTranslation();

  async function handleCheckout(prevState: unknown, formData: FormData) {
    const cartData = items.map((i) => ({ productId: i.productId, quantity: i.quantity, size: i.size }));
    const result = await placeOrder(cartData, formData);
    if (result && 'message' in result) {
      return result;
    }
    clearCart();
    router.push('/orders');
    return undefined;
  }

  const [state, action, pending] = useActionState(handleCheckout, undefined);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-[#ddd]" strokeWidth={1} />
        <h1 className="mt-6 font-display text-3xl tracking-wide text-[#282828]">{t.cart.emptyTitle}</h1>
        <p className="mt-3 text-[#282828]/70">{t.cart.emptyDesc}</p>
        <Link href="/" className="mt-8 inline-block rounded-sm bg-[#282828] px-8 py-3 text-sm font-medium tracking-widest text-[#f5f3f0] transition hover:bg-[#be1622]">
          {t.cart.continueShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl tracking-wide text-[#282828]">{t.cart.title}</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={`${item.productId}-${item.size}`} className="flex items-center gap-4 rounded-sm border border-[#ddd] bg-[#faf9f7] p-4">
              <div className="h-20 w-20 rounded-sm bg-gradient-to-br from-[#ddd] to-[#f5f3f0] overflow-hidden flex-shrink-0">
                <img src={`/api/images/products/${item.productId}`} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#282828] truncate">{item.name}</p>
                <p className="text-xs text-[#282828]/60 uppercase">{t.cart.size} {item.size}</p>
                <p className="mt-1 text-sm font-semibold text-[#be1622]">${(item.price / 100).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                  className="h-8 w-8 rounded-sm border border-[#ddd] flex items-center justify-center transition hover:bg-[#f5f3f0]"
                >
                  <Minus className="h-3 w-3 text-[#282828]" strokeWidth={1.5} />
                </button>
                <span className="w-6 text-center text-sm font-medium tracking-wider text-[#282828]">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                  className="h-8 w-8 rounded-sm border border-[#ddd] flex items-center justify-center transition hover:bg-[#f5f3f0]"
                >
                  <Plus className="h-3 w-3 text-[#282828]" strokeWidth={1.5} />
                </button>
              </div>
              <button
                onClick={() => removeItem(item.productId, item.size)}
                className="text-[#ddd] transition hover:text-[#be1622]"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-sm border border-[#ddd] bg-[#faf9f7] p-6 h-fit">
          <h2 className="text-xs font-semibold tracking-wider text-[#be1622] uppercase">Order Summary</h2>
          <div className="mt-6 flex justify-between text-sm">
            <span className="text-[#282828]/70">{t.cart.subtotal}</span>
            <span className="font-semibold text-[#282828]">${(totalPrice / 100).toFixed(2)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-[#282828]/70">{t.cart.shipping}</span>
            <span className="font-semibold text-[#282828]">{t.cart.free}</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-[#ddd] pt-4">
            <span className="text-lg font-semibold text-[#282828]">{t.cart.total}</span>
            <span className="text-lg font-semibold text-[#282828]">${(totalPrice / 100).toFixed(2)}</span>
          </div>

          <form action={action} className="mt-6 space-y-4">
            <div>
              <label htmlFor="shippingAddress" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">{t.cart.shippingAddress}</label>
              <textarea
                id="shippingAddress"
                name="shippingAddress"
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#f5f3f0] px-3 py-2 text-sm tracking-wide text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828] placeholder:text-[#282828]/30"
                placeholder={t.cart.addressPlaceholder}
              />
            </div>
            {state?.message && <p className="text-sm text-[#be1622]">{state.message}</p>}
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-sm bg-[#282828] py-3 text-sm font-medium tracking-widest text-[#f5f3f0] transition hover:bg-[#be1622] disabled:opacity-50"
            >
              {pending ? t.cart.placingOrder : t.cart.placeOrder}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
