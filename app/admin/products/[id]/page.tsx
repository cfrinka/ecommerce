import { notFound } from 'next/navigation';
import { getDb } from '../../../lib/db';
import { EditProductForm, DeleteProductButton } from './EditProductForm';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const raw = db.prepare('SELECT id, name, description, price, image, category, sizes, stock, active FROM products WHERE id = ?').get(id) as
    | { id: number; name: string; description: string | null; price: number; image: string | null; category: string; sizes: string; stock: number; active: number }
    | undefined;

  if (!raw) notFound();

  const product = {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    price: raw.price,
    image: raw.image,
    category: raw.category,
    sizes: raw.sizes,
    stock: raw.stock,
    active: raw.active,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#ddd] pb-4">
        <h2 className="font-display text-2xl tracking-wide text-[#282828]">Edit Product</h2>
        <DeleteProductButton id={product.id} />
      </div>
      <EditProductForm product={product} />
    </div>
  );
}
