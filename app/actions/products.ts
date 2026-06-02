'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ProductSchema, type ProductFormState } from '@/app/lib/definitions';
import { getDb } from '@/app/lib/db';
import { requireAdmin } from '@/app/lib/auth';

async function readImageFile(formData: FormData): Promise<{ image_blob: Buffer | null; image_type: string | null; image_url: string }> {
  const file = formData.get('image_file') as File | null;
  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    return { image_blob: buffer, image_type: file.type, image_url: '' };
  }
  const url = formData.get('image') as string | null;
  return { image_blob: null, image_type: null, image_url: url || '' };
}

export async function createProduct(state: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await requireAdmin();

  const validated = ProductSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    image: formData.get('image'),
    category: formData.get('category'),
    sizes: formData.get('sizes'),
    stock: formData.get('stock'),
    active: formData.get('active') ? 1 : 0,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const img = await readImageFile(formData);
  const db = getDb();
  db.prepare(
    'INSERT INTO products (name, description, price, image, image_blob, image_type, category, sizes, stock, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(
    validated.data.name,
    validated.data.description || null,
    Math.round(validated.data.price * 100),
    img.image_url || '',
    img.image_blob,
    img.image_type,
    validated.data.category,
    validated.data.sizes,
    validated.data.stock,
    validated.data.active
  );

  revalidatePath('/admin/products');
  revalidatePath('/');
  return { message: 'Product created successfully.' };
}

export async function updateProduct(id: number, state: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await requireAdmin();

  const validated = ProductSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    image: formData.get('image'),
    category: formData.get('category'),
    sizes: formData.get('sizes'),
    stock: formData.get('stock'),
    active: formData.get('active') ? 1 : 0,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const img = await readImageFile(formData);
  const db = getDb();

  if (img.image_blob) {
    db.prepare(
      'UPDATE products SET name = ?, description = ?, price = ?, image = ?, image_blob = ?, image_type = ?, category = ?, sizes = ?, stock = ?, active = ? WHERE id = ?'
    ).run(
      validated.data.name,
      validated.data.description || null,
      Math.round(validated.data.price * 100),
      img.image_url || '',
      img.image_blob,
      img.image_type,
      validated.data.category,
      validated.data.sizes,
      validated.data.stock,
      validated.data.active,
      id
    );
  } else {
    db.prepare(
      'UPDATE products SET name = ?, description = ?, price = ?, image = ?, category = ?, sizes = ?, stock = ?, active = ? WHERE id = ?'
    ).run(
      validated.data.name,
      validated.data.description || null,
      Math.round(validated.data.price * 100),
      img.image_url || '',
      validated.data.category,
      validated.data.sizes,
      validated.data.stock,
      validated.data.active,
      id
    );
  }

  revalidatePath('/admin/products');
  revalidatePath('/');
  revalidatePath(`/product/${id}`);
  return { message: 'Product updated successfully.' };
}

export async function deleteProduct(id: number) {
  await requireAdmin();
  const db = getDb();
  db.prepare('DELETE FROM products WHERE id = ?').run(id);
  revalidatePath('/admin/products');
  revalidatePath('/');
  redirect('/admin/products');
}
