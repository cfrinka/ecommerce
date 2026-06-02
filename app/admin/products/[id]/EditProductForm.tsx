'use client';

import { useActionState } from 'react';
import { updateProduct, deleteProduct } from '../../../actions/products';
import Link from 'next/link';

export function EditProductForm({
  product,
}: {
  product: {
    id: number;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
    category: string;
    sizes: string;
    stock: number;
    active: number;
  };
}) {
  const boundUpdate = updateProduct.bind(null, product.id);
  const [state, action, pending] = useActionState(boundUpdate, undefined);

  return (
    <form action={action} className="space-y-5 rounded-sm border border-[#ddd] bg-[#faf9f7] p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Name</label>
          <input id="name" name="name" defaultValue={product.name} required className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#f5f3f0] px-3 py-2 text-sm text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828]" />
        </div>
        <div>
          <label htmlFor="category" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Category</label>
          <input id="category" name="category" defaultValue={product.category} required className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#f5f3f0] px-3 py-2 text-sm text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828]" />
        </div>
        <div>
          <label htmlFor="price" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Price ($)</label>
          <input id="price" name="price" type="number" step="0.01" min="0" defaultValue={(product.price / 100).toFixed(2)} required className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#f5f3f0] px-3 py-2 text-sm text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828]" />
        </div>
        <div>
          <label htmlFor="stock" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Stock</label>
          <input id="stock" name="stock" type="number" min="0" defaultValue={product.stock} required className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#f5f3f0] px-3 py-2 text-sm text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828]" />
        </div>
      </div>
      <div>
        <label htmlFor="sizes" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Sizes (comma separated)</label>
        <input id="sizes" name="sizes" defaultValue={product.sizes} required className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#f5f3f0] px-3 py-2 text-sm text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828]" />
      </div>
      <div>
        <label htmlFor="description" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Description</label>
        <textarea id="description" name="description" defaultValue={product.description || ''} rows={3} className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#f5f3f0] px-3 py-2 text-sm text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828]" />
      </div>
      <div>
        <label htmlFor="image_file" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Upload New Image</label>
        <input id="image_file" name="image_file" type="file" accept="image/*" className="mt-2 w-full text-sm text-[#282828] file:mr-4 file:rounded-sm file:border-0 file:bg-[#282828] file:px-4 file:py-2 file:text-xs file:font-medium file:text-[#f5f3f0]" />
      </div>
      <div>
        <label htmlFor="image" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Or Image URL</label>
        <input id="image" name="image" defaultValue={product.image || ''} className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#f5f3f0] px-3 py-2 text-sm text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828]" />
      </div>
      <div className="flex items-center gap-2">
        <input id="active" name="active" type="checkbox" defaultChecked={!!product.active} value="1" className="h-4 w-4 accent-[#282828]" />
        <label htmlFor="active" className="text-sm font-semibold text-[#282828]">Active</label>
      </div>

      {state?.message && <p className="text-sm text-[#355444]">{state.message}</p>}
      {state?.errors && <p className="text-sm text-[#be1622]">Please fix the errors above.</p>}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-sm bg-[#282828] px-6 py-2.5 text-sm font-semibold text-[#f5f3f0] transition hover:bg-[#be1622] disabled:opacity-50"
        >
          {pending ? 'Saving...' : 'Save Changes'}
        </button>
        <Link href="/admin/products" className="text-sm font-semibold text-[#282828]/60 transition hover:text-[#282828]">Cancel</Link>
      </div>
    </form>
  );
}

export function DeleteProductButton({ id }: { id: number }) {
  return (
    <form
      action={() => deleteProduct(id)}
      onSubmit={(e) => {
        if (!confirm('Are you sure you want to delete this product?')) e.preventDefault();
      }}
    >
      <button type="submit" className="text-sm font-semibold text-[#be1622] transition hover:text-[#282828]">
        Delete Product
      </button>
    </form>
  );
}
