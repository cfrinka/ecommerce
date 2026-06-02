import Link from "next/link";
import { getDb } from "./lib/db";
import { getBanners } from "./actions/banners";
import { getLocale } from "./lib/server-locale";
import { getDictionary } from "./lib/i18n";
import { Carousel } from "./components/Carousel";

export default async function Home() {
  const db = getDb();
  const products = db.prepare(
    "SELECT id, name, description, price, image, category FROM products WHERE active = 1 ORDER BY id"
  ).all() as { id: number; name: string; description: string; price: number; image: string; category: string }[];

  const banners = await getBanners();
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <div>
      <Carousel banners={banners} shopNow={t.carousel.shopNow} />

      <section id="shop" className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wider text-[#be1622] uppercase">{t.home.collection}</p>
            <h2 className="mt-2 font-display text-3xl tracking-wide text-[#282828]">{t.home.allProducts}</h2>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group block overflow-hidden rounded-sm bg-[#faf9f7] transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-square bg-gradient-to-br from-[#ddd] to-[#f5f3f0] flex items-center justify-center overflow-hidden">
                <img
                  src={`/api/images/products/${product.id}`}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold tracking-wider text-[#be1622] uppercase">{product.category}</p>
                <h3 className="mt-1 text-lg font-semibold text-[#282828] group-hover:text-[#be1622] transition">
                  {product.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[#282828]/70">
                  {product.description}
                </p>
                <p className="mt-3 text-lg font-medium tracking-wide text-[#282828]">
                  ${(product.price / 100).toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
