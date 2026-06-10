'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string;
  show_title: number;
  show_button: number;
}

export function Carousel({ banners, shopNow }: { banners: Banner[]; shopNow: string }) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [banners.length, next]);

  if (banners.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden bg-[#282828]">
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.link_url}
            className="relative h-[60vh] min-h-[400px] w-full flex-shrink-0"
          >
            <img
              src={`/api/images/banners/${banner.id}`}
              alt={banner.title}
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            {(banner.show_title || banner.show_button) && (
              <>
                <div className="absolute inset-0 bg-[#282828]/40" />
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                  {banner.show_title ? (
                    <>
                      <h2 className="font-display text-5xl tracking-wide text-[#f5f3f0] drop-shadow-lg sm:text-7xl">
                        {banner.title}
                      </h2>
                      {banner.subtitle && (
                        <p className="mt-4 max-w-lg text-lg text-[#f5f3f0]/90 drop-shadow-md">
                          {banner.subtitle}
                        </p>
                      )}
                    </>
                  ) : null}
                  {banner.show_button ? (
                    <span className={`${banner.show_title ? 'mt-8' : ''} inline-block rounded-sm border border-[#f5f3f0]/60 bg-[#282828]/30 px-8 py-3 text-sm font-semibold text-[#f5f3f0] backdrop-blur-sm transition hover:bg-[#f5f3f0] hover:text-[#282828]`}>
                      {shopNow}
                    </span>
                  ) : null}
                </div>
              </>
            )}
          </Link>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg transition hover:bg-white hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6 text-[#282828]" strokeWidth={2} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg transition hover:bg-white hover:scale-110"
          >
            <ChevronRight className="h-6 w-6 text-[#282828]" strokeWidth={2} />
          </button>

          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setCurrent(i); }}
                className={`h-1.5 rounded-full transition-all ${
                  i === current ? 'w-8 bg-[#f5f3f0]' : 'w-4 bg-[#f5f3f0]/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
