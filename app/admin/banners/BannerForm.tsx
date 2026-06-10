'use client';

import { useActionState, useState } from 'react';
import { createBanner } from '../../actions/banners';
import { Plus, Minus } from 'lucide-react';

export function BannerForm() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(async (_: unknown, formData: FormData) => {
    await createBanner(formData);
    setOpen(false);
    return undefined;
  }, undefined);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-sm bg-[#282828] px-5 py-2.5 text-sm font-medium text-[#f5f3f0] transition hover:bg-[#be1622]"
      >
        {open ? <Minus className="h-3.5 w-3.5" strokeWidth={1.5} /> : <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />}
        {open ? 'CANCEL' : 'ADD BANNER'}
      </button>

      {open && (
        <form action={action} className="mt-6 space-y-5 rounded-sm border border-[#ddd] bg-[#faf9f7] p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="title" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Title</label>
              <input id="title" name="title" required className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#f5f3f0] px-3 py-2 text-sm text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828]" />
            </div>
            <div>
              <label htmlFor="subtitle" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Subtitle</label>
              <input id="subtitle" name="subtitle" className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#f5f3f0] px-3 py-2 text-sm text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828]" />
            </div>
            <div>
              <label htmlFor="image_file" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Upload Image</label>
              <input id="image_file" name="image_file" type="file" accept="image/*" className="mt-2 w-full text-sm text-[#282828] file:mr-4 file:rounded-sm file:border-0 file:bg-[#282828] file:px-4 file:py-2 file:text-xs file:font-medium file:text-[#f5f3f0]" />
            </div>
            <div>
              <label htmlFor="image_url" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Or Image URL</label>
              <input id="image_url" name="image_url" placeholder="/banner.jpg or https://..." className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#f5f3f0] px-3 py-2 text-sm text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828] placeholder:text-[#282828]/40" />
            </div>
            <div>
              <label htmlFor="link_url" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Link URL</label>
              <input id="link_url" name="link_url" defaultValue="/#shop" className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#f5f3f0] px-3 py-2 text-sm text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828]" />
            </div>
            <div>
              <label htmlFor="sort_order" className="block text-xs font-semibold tracking-wider text-[#282828]/70 uppercase">Sort Order</label>
              <input id="sort_order" name="sort_order" type="number" defaultValue={0} className="mt-2 w-full rounded-sm border border-[#ddd] bg-[#f5f3f0] px-3 py-2 text-sm text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#282828]" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <input id="show_title" name="show_title" type="checkbox" defaultChecked value="1" className="h-4 w-4 accent-[#282828]" />
              <label htmlFor="show_title" className="text-sm font-semibold text-[#282828]">Show Title</label>
            </div>
            <div className="flex items-center gap-2">
              <input id="show_button" name="show_button" type="checkbox" defaultChecked value="1" className="h-4 w-4 accent-[#282828]" />
              <label htmlFor="show_button" className="text-sm font-semibold text-[#282828]">Show Button</label>
            </div>
            <div className="flex items-center gap-2">
              <input id="active" name="active" type="checkbox" defaultChecked value="1" className="h-4 w-4 accent-[#282828]" />
              <label htmlFor="active" className="text-sm font-semibold text-[#282828]">Active</label>
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="rounded-sm bg-[#282828] px-6 py-2.5 text-sm font-semibold text-[#f5f3f0] transition hover:bg-[#be1622] disabled:opacity-50"
          >
            {pending ? 'Creating...' : 'Create Banner'}
          </button>
        </form>
      )}
    </div>
  );
}
