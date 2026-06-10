import { notFound } from 'next/navigation';
import { getDb } from '../../../lib/db';
import { EditBannerForm, DeleteBannerButton } from './EditBannerForm';

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const raw = db.prepare('SELECT id, title, subtitle, image_url, link_url, show_title, show_button, active, sort_order FROM banners WHERE id = ?').get(id) as
    | { id: number; title: string; subtitle: string | null; image_url: string; link_url: string; show_title: number; show_button: number; active: number; sort_order: number }
    | undefined;

  if (!raw) notFound();

  // Explicitly construct a plain serializable object to avoid Buffer/Uint8Array leaks
  const banner = {
    id: raw.id,
    title: raw.title,
    subtitle: raw.subtitle,
    image_url: raw.image_url,
    link_url: raw.link_url,
    show_title: raw.show_title ?? 1,
    show_button: raw.show_button ?? 1,
    active: raw.active,
    sort_order: raw.sort_order,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#ddd] pb-4">
        <h2 className="font-display text-2xl tracking-wide text-[#282828]">Edit Banner</h2>
        <DeleteBannerButton id={banner.id} title={banner.title} />
      </div>
      <EditBannerForm banner={banner} />
    </div>
  );
}
