'use client';

import { useActionState } from 'react';
import { updateBanner, deleteBanner } from '../../../actions/banners';
import Link from 'next/link';

export function EditBannerForm({
  banner,
}: {
  banner: {
    id: number;
    title: string;
    subtitle: string | null;
    image_url: string;
    link_url: string;
    active: number;
    sort_order: number;
  };
}) {
  const boundUpdate = updateBanner.bind(null, banner.id);
  const [state, action, pending] = useActionState(boundUpdate, undefined);

  return (
    <form action={action} className="space-y-5 rounded-sm border border-[#ddd] bg-[#faf9f7] p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Title</label>
          <input id="title" name="title" defaultValue={banner.title} required className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#f5f3f0] px-3 py-2 text-sm text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828]" />
        </div>
        <div>
          <label htmlFor="subtitle" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Subtitle</label>
          <input id="subtitle" name="subtitle" defaultValue={banner.subtitle || ''} className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#f5f3f0] px-3 py-2 text-sm text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828]" />
        </div>
        <div>
          <label htmlFor="image_file" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Upload New Image</label>
          <input id="image_file" name="image_file" type="file" accept="image/*" className="mt-2 w-full text-sm text-[#282828] file:mr-4 file:rounded-sm file:border-0 file:bg-[#282828] file:px-4 file:py-2 file:text-xs file:font-medium file:text-[#f5f3f0]" />
        </div>
        <div>
          <label htmlFor="image_url" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Or Image URL</label>
          <input id="image_url" name="image_url" defaultValue={banner.image_url} className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#f5f3f0] px-3 py-2 text-sm text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828]" />
        </div>
        <div>
          <label htmlFor="link_url" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Link URL</label>
          <input id="link_url" name="link_url" defaultValue={banner.link_url} className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#f5f3f0] px-3 py-2 text-sm text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828]" />
        </div>
        <div>
          <label htmlFor="sort_order" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Sort Order</label>
          <input id="sort_order" name="sort_order" type="number" defaultValue={banner.sort_order} className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#f5f3f0] px-3 py-2 text-sm text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828]" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input id="active" name="active" type="checkbox" defaultChecked={!!banner.active} value="1" className="h-4 w-4 accent-[#282828]" />
        <label htmlFor="active" className="text-sm font-semibold text-[#282828]">Active</label>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-sm bg-[#282828] px-6 py-2.5 text-sm font-semibold text-[#f5f3f0] transition hover:bg-[#be1622] disabled:opacity-50"
        >
          {pending ? 'Saving...' : 'Save Changes'}
        </button>
        <Link href="/admin/banners" className="text-sm font-semibold text-[#282828]/60 transition hover:text-[#282828]">CANCEL</Link>
      </div>
    </form>
  );
}

export function DeleteBannerButton({ id }: { id: number }) {
  return (
    <form
      action={() => deleteBanner(id)}
      onSubmit={(e) => {
        if (!confirm('Are you sure you want to delete this banner?')) e.preventDefault();
      }}
    >
      <button type="submit" className="text-sm font-semibold text-[#be1622] transition hover:text-[#282828]">
        Delete Banner
      </button>
    </form>
  );
}
