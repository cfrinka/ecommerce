'use client';

import { useState } from 'react';
import { useCart } from '@/app/components/CartContext';
import { getDictionary, type Locale } from '@/app/lib/i18n';
import { ShoppingCart, Check, Minus, Plus } from 'lucide-react';

export function AddToCartButton({
  productId,
  name,
  price,
  image,
  sizes,
  sizeStock,
  locale,
}: {
  productId: number;
  name: string;
  price: number;
  image: string;
  sizes: string[];
  sizeStock: Record<string, number>;
  locale: Locale;
}) {
  const t = getDictionary(locale);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  // Find first size with stock, or fallback to first size
  const firstAvailableSize = sizes.find((s) => (sizeStock[s] ?? 0) > 0) || sizes[0] || 'M';
  const [size, setSize] = useState(firstAvailableSize);

  function handleAdd() {
    addItem({ productId, name, price, image, size, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="mt-8 space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">{t.product.size}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {sizes.map((s) => {
            const inStock = (sizeStock[s] ?? 0) > 0;
            return (
              <button
                key={s}
                type="button"
                onClick={() => inStock && setSize(s)}
                disabled={!inStock}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-sm border text-sm font-medium tracking-wider transition ${
                  !inStock
                    ? 'border-[#ddd] bg-[#f5f3f0] text-[#282828]/30 cursor-not-allowed line-through'
                    : size === s
                    ? 'border-[#282828] bg-[#282828] text-[#f5f3f0]'
                    : 'border-[#ddd] text-[#282828] hover:border-[#282828]'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-sm border border-[#ddd]">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-11 w-11 flex items-center justify-center text-[#282828] transition hover:bg-[#faf9f7]"
          >
            <Minus className="h-3 w-3" strokeWidth={1.5} />
          </button>
          <span className="h-11 w-11 flex items-center justify-center text-sm font-medium tracking-wider text-[#282828]">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="h-11 w-11 flex items-center justify-center text-[#282828] transition hover:bg-[#faf9f7]"
          >
            <Plus className="h-3 w-3" strokeWidth={1.5} />
          </button>
        </div>

        <button
          onClick={handleAdd}
          disabled={(sizeStock[size] ?? 0) === 0}
          className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-sm px-8 text-sm font-medium tracking-widest transition ${
            (sizeStock[size] ?? 0) === 0
              ? 'bg-[#ddd] text-[#282828]/40 cursor-not-allowed'
              : 'bg-[#282828] text-[#f5f3f0] hover:bg-[#be1622]'
          }`}
        >
          {added ? <Check className="h-4 w-4" strokeWidth={1.5} /> : <ShoppingCart className="h-4 w-4" strokeWidth={1.5} />}
          {added ? t.product.added : t.product.addToCart}
        </button>
      </div>
    </div>
  );
}
