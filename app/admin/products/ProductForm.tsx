'use client';

import { useActionState, useState } from 'react';
import { createProduct } from '../../actions/products';
import { Plus, Minus } from 'lucide-react';

export function ProductForm() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createProduct, undefined);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-sm bg-[#282828] px-5 py-2.5 text-sm font-medium text-[#f5f3f0] transition hover:bg-[#be1622]"
      >
        {open ? <Minus className="h-3.5 w-3.5" strokeWidth={1.5} /> : <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />}
        {open ? 'CANCEL' : 'ADD PRODUCT'}
      </button>

      {open && (
        <form action={action} className="mt-6 space-y-5 rounded-sm border border-[#ddd] bg-[#faf9f7] p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Name</label>
              <input id="name" name="name" required className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#f5f3f0] px-3 py-2 text-sm text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828]" />
              {state?.errors?.name && <p className="mt-1 text-xs text-[#be1622]">{state.errors.name}</p>}
            </div>
            <div>
              <label htmlFor="category" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Category</label>
              <input id="category" name="category" defaultValue="t-shirt" required className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#f5f3f0] px-3 py-2 text-sm text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828]" />
            </div>
            <div>
              <label htmlFor="price" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Price ($)</label>
              <input id="price" name="price" type="number" step="0.01" min="0" required className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#f5f3f0] px-3 py-2 text-sm text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828]" />
              {state?.errors?.price && <p className="mt-1 text-xs text-[#be1622]">{state.errors.price}</p>}
            </div>
            <div>
              <label htmlFor="stock" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Stock</label>
              <input id="stock" name="stock" type="number" min="0" defaultValue={0} required className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#f5f3f0] px-3 py-2 text-sm text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828]" />
            </div>
          </div>
          <div>
            <label htmlFor="sizes" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Sizes (comma separated)</label>
            <input id="sizes" name="sizes" defaultValue="S,M,L,XL" required className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#f5f3f0] px-3 py-2 text-sm text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828]" />
          </div>
          <div>
            <label htmlFor="description" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Description</label>
            <textarea id="description" name="description" rows={3} className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#f5f3f0] px-3 py-2 text-sm text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828]" />
          </div>
          <div>
            <label htmlFor="image_file" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Upload Image</label>
            <input id="image_file" name="image_file" type="file" accept="image/*" className="mt-2 w-full text-sm text-[#282828] file:mr-4 file:rounded-sm file:border-0 file:bg-[#282828] file:px-4 file:py-2 file:text-xs file:font-medium file:text-[#f5f3f0]" />
          </div>
          <div>
            <label htmlFor="image" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Or Image URL</label>
            <input id="image" name="image" placeholder="https://... or /products/photo.jpg" className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#f5f3f0] px-3 py-2 text-sm text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828] placeholder:text-[#282828]/40" />
          </div>
          <div className="flex items-center gap-2">
            <input id="active" name="active" type="checkbox" defaultChecked value="1" className="h-4 w-4 accent-[#282828]" />
            <label htmlFor="active" className="text-sm font-semibold text-[#282828]">Active</label>
          </div>

          {state?.message && <p className="text-sm text-[#355444]">{state.message}</p>}

          <button
            type="submit"
            disabled={pending}
            className="rounded-sm bg-[#282828] px-6 py-2.5 text-sm font-semibold text-[#f5f3f0] transition hover:bg-[#be1622] disabled:opacity-50"
          >
            {pending ? 'Creating...' : 'Create Product'}
          </button>
        </form>
      )}
    </div>
  );
}
