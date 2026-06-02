'use server';

import { revalidatePath } from 'next/cache';
import { getDb } from '@/app/lib/db';
import { requireAdmin } from '@/app/lib/auth';

async function readBannerImage(formData: FormData): Promise<{ image_blob: Buffer | null; image_type: string | null; image_url: string }> {
  const file = formData.get('image_file') as File | null;
  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    return { image_blob: buffer, image_type: file.type, image_url: '' };
  }
  const url = formData.get('image_url') as string | null;
  return { image_blob: null, image_type: null, image_url: url || '' };
}

export async function getBanners() {
  const db = getDb();
  return db.prepare(
    'SELECT id, title, subtitle, image_url, link_url, active, sort_order FROM banners WHERE active = 1 ORDER BY sort_order'
  ).all() as { id: number; title: string; subtitle: string | null; image_url: string; link_url: string; active: number; sort_order: number }[];
}

export async function getAllBanners() {
  await requireAdmin();
  const db = getDb();
  return db.prepare(
    'SELECT id, title, subtitle, image_url, link_url, active, sort_order FROM banners ORDER BY sort_order'
  ).all() as { id: number; title: string; subtitle: string | null; image_url: string; link_url: string; active: number; sort_order: number }[];
}

export async function createBanner(formData: FormData) {
  await requireAdmin();
  const img = await readBannerImage(formData);
  const db = getDb();
  db.prepare(
    'INSERT INTO banners (title, subtitle, image_url, image_blob, image_type, link_url, active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(
    formData.get('title') as string,
    formData.get('subtitle') as string || null,
    img.image_url || '',
    img.image_blob,
    img.image_type,
    formData.get('link_url') as string || '/',
    formData.get('active') ? 1 : 0,
    parseInt(formData.get('sort_order') as string) || 0
  );
  revalidatePath('/');
  revalidatePath('/admin/banners');
}

export async function updateBanner(id: number, _prevState: unknown, formData: FormData) {
  await requireAdmin();
  const img = await readBannerImage(formData);
  const db = getDb();

  if (img.image_blob) {
    db.prepare(
      'UPDATE banners SET title = ?, subtitle = ?, image_url = ?, image_blob = ?, image_type = ?, link_url = ?, active = ?, sort_order = ? WHERE id = ?'
    ).run(
      formData.get('title') as string,
      formData.get('subtitle') as string || null,
      img.image_url || '',
      img.image_blob,
      img.image_type,
      formData.get('link_url') as string || '/',
      formData.get('active') ? 1 : 0,
      parseInt(formData.get('sort_order') as string) || 0,
      id
    );
  } else {
    db.prepare(
      'UPDATE banners SET title = ?, subtitle = ?, image_url = ?, link_url = ?, active = ?, sort_order = ? WHERE id = ?'
    ).run(
      formData.get('title') as string,
      formData.get('subtitle') as string || null,
      img.image_url || '',
      formData.get('link_url') as string || '/',
      formData.get('active') ? 1 : 0,
      parseInt(formData.get('sort_order') as string) || 0,
      id
    );
  }
  revalidatePath('/');
  revalidatePath('/admin/banners');
}

export async function deleteBanner(id: number) {
  await requireAdmin();
  const db = getDb();
  db.prepare('DELETE FROM banners WHERE id = ?').run(id);
  revalidatePath('/');
  revalidatePath('/admin/banners');
}
