import Link from "next/link";
import { getDb } from "./lib/db";
import { getBanners } from "./actions/banners";
import { getLocale } from "./lib/server-locale";
import { getDictionary } from "./lib/i18n";
import { Carousel } from "./components/Carousel";

export const dynamic = 'force-dynamic';

const PRODUCTS_PER_PAGE = 12;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const db = getDb();
  const sp = await searchParams;
  const category = sp.category || 'all';
  const page = parseInt(sp.page || '1', 10);
  const offset = (page - 1) * PRODUCTS_PER_PAGE;

  // Get all unique categories, sorted alphabetically with 'Outros' at the end
  const rawCategories = db.prepare(
    "SELECT DISTINCT category FROM products WHERE active = 1 ORDER BY category"
  ).all() as { category: string }[];
  
  const categories = rawCategories.sort((a, b) => {
    if (a.category === 'Outros') return 1;
    if (b.category === 'Outros') return -1;
    return a.category.localeCompare(b.category, 'pt-BR');
  });

  // Build query with category filter
  let query = "SELECT id, name, description, price, image, category FROM products WHERE active = 1";
  const params: any[] = [];

  if (category !== 'all') {
    query += " AND category = ?";
    params.push(category);
  }

  query += " ORDER BY id LIMIT ? OFFSET ?";
  params.push(PRODUCTS_PER_PAGE, offset);

  const products = db.prepare(query).all(...params) as {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
  }[];

  // Get total count for pagination
  let countQuery = "SELECT COUNT(*) as count FROM products WHERE active = 1";
  const countParams: any[] = [];

  if (category !== 'all') {
    countQuery += " AND category = ?";
    countParams.push(category);
  }

  const { count } = db.prepare(countQuery).get(...countParams) as { count: number };
  const totalPages = Math.ceil(count / PRODUCTS_PER_PAGE);

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

        {/* Category Filter Buttons */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/"
            className={`rounded-sm px-4 py-2 text-sm font-semibold transition ${
              category === 'all'
                ? 'bg-[#282828] text-[#f5f3f0]'
                : 'border border-[#ddd] bg-[#faf9f7] text-[#282828] hover:bg-[#282828] hover:text-[#f5f3f0]'
            }`}
          >
            {(t.categories as Record<string, string>)['all'] || 'All'}
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.category}
              href={`?category=${encodeURIComponent(cat.category)}&page=1`}
              className={`rounded-sm px-4 py-2 text-sm font-semibold transition ${
                category === cat.category
                  ? 'bg-[#282828] text-[#f5f3f0]'
                  : 'border border-[#ddd] bg-[#faf9f7] text-[#282828] hover:bg-[#282828] hover:text-[#f5f3f0]'
              }`}
            >
              {(t.categories as Record<string, string>)[cat.category] || cat.category}
            </Link>
          ))}
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
                <p className="text-xs font-semibold tracking-wider text-[#be1622] uppercase">{(t.categories as Record<string, string>)[product.category] || product.category}</p>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {page > 1 && (
              <Link
                href={category === 'all' ? `?page=${page - 1}` : `?category=${encodeURIComponent(category)}&page=${page - 1}`}
                className="rounded-sm border border-[#ddd] bg-[#faf9f7] px-4 py-2 text-sm font-semibold text-[#282828] transition hover:bg-[#282828] hover:text-[#f5f3f0]"
              >
                Previous
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Link
                key={pageNum}
                href={category === 'all' ? `?page=${pageNum}` : `?category=${encodeURIComponent(category)}&page=${pageNum}`}
                className={`rounded-sm px-4 py-2 text-sm font-semibold transition ${
                  pageNum === page
                    ? 'bg-[#282828] text-[#f5f3f0]'
                    : 'border border-[#ddd] bg-[#faf9f7] text-[#282828] hover:bg-[#282828] hover:text-[#f5f3f0]'
                }`}
              >
                {pageNum}
              </Link>
            ))}
            {page < totalPages && (
              <Link
                href={category === 'all' ? `?page=${page + 1}` : `?category=${encodeURIComponent(category)}&page=${page + 1}`}
                className="rounded-sm border border-[#ddd] bg-[#faf9f7] px-4 py-2 text-sm font-semibold text-[#282828] transition hover:bg-[#282828] hover:text-[#f5f3f0]"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
