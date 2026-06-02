import Link from 'next/link';
import { getDb } from '../../lib/db';
import { ProductForm } from './ProductForm';

export default function AdminProductsPage() {
  const db = getDb();
  const products = db.prepare(
    'SELECT id, name, price, stock, active, category FROM products ORDER BY id DESC'
  ).all() as { id: number; name: string; price: number; stock: number; active: number; category: string }[];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl tracking-wide text-[#282828]">Products</h2>
      </div>

      <ProductForm />

      <div className="rounded-sm border border-[#ddd] bg-[#faf9f7] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#f5f3f0]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-[#282828]/60 uppercase">Image</th>
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-[#282828]/60 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-[#282828]/60 uppercase">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-[#282828]/60 uppercase">Price</th>
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-[#282828]/60 uppercase">Stock</th>
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-[#282828]/60 uppercase">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider text-[#282828]/60 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ddd]">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3">
                  <img
                    src={`/api/images/products/${product.id}`}
                    alt={product.name}
                    className="h-10 w-10 rounded-sm object-cover"
                  />
                </td>
                <td className="px-4 py-3 font-semibold text-[#282828]">{product.name}</td>
                <td className="px-4 py-3 text-sm text-[#282828]/60">{product.category}</td>
                <td className="px-4 py-3 text-[#282828]">${(product.price / 100).toFixed(2)}</td>
                <td className="px-4 py-3 text-[#282828]">{product.stock}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold tracking-wider uppercase ${
                      product.active ? 'bg-[#355444]/10 text-[#355444]' : 'bg-[#ddd] text-[#282828]/60'
                    }`}
                  >
                    {product.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-sm font-semibold text-[#282828] transition hover:text-[#be1622]"
                  >
                    EDIT
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
