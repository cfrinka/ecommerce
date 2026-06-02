import Link from 'next/link';
import { getAllBanners, createBanner, updateBanner, deleteBanner } from '../../actions/banners';
import { BannerForm } from './BannerForm';

export default async function AdminBannersPage() {
  const banners = await getAllBanners();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl tracking-wide text-[#282828]">Banners</h2>
      </div>

      <BannerForm />

      <div className="rounded-sm border border-[#ddd] bg-[#faf9f7] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#f5f3f0]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-[#282828]/60 uppercase">Order</th>
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-[#282828]/60 uppercase">Title</th>
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-[#282828]/60 uppercase">Image</th>
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-[#282828]/60 uppercase">Link</th>
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-[#282828]/60 uppercase">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider text-[#282828]/60 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ddd]">
            {banners.map((banner) => (
              <tr key={banner.id}>
                <td className="px-4 py-3 text-[#282828]">{banner.sort_order}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-[#282828]">{banner.title}</p>
                  <p className="text-xs text-[#282828]/60">{banner.subtitle}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={`/api/images/banners/${banner.id}`}
                      alt={banner.title}
                      className="h-10 w-10 rounded-sm object-cover"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-[#282828]/70 truncate max-w-[100px]">{banner.link_url}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold tracking-wider uppercase ${
                      banner.active ? 'bg-[#355444]/10 text-[#355444]' : 'bg-[#ddd] text-[#282828]/60'
                    }`}
                  >
                    {banner.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/banners/${banner.id}`}
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
