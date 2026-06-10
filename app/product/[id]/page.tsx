import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "@/app/lib/db";
import { getLocale } from "@/app/lib/server-locale";
import { getDictionary } from "@/app/lib/i18n";
import { AddToCartButton } from "./AddToCartButton";
import { ArrowLeft } from "lucide-react";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const product = db.prepare("SELECT id, name, description, price, image, category, sizes, size_stock, stock FROM products WHERE id = ? AND active = 1").get(id) as
    | { id: number; name: string; description: string; price: number; image: string; category: string; sizes: string; size_stock: string | null; stock: number }
    | undefined;

  if (!product) notFound();

  const locale = await getLocale();
  const t = getDictionary(locale);
  const sizes = product.sizes.split(",").map((s) => s.trim());
  const sizeStock: Record<string, number> = product.size_stock ? JSON.parse(product.size_stock) : {};

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#282828]/70 transition hover:text-[#be1622]">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        {t.product.backToShop}
      </Link>

      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div className="aspect-square rounded-sm bg-gradient-to-br from-[#ddd] to-[#f5f3f0] flex items-center justify-center overflow-hidden">
          <img
            src={`/api/images/products/${product.id}`}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-xs font-semibold tracking-wider text-[#be1622] uppercase">{(t.categories as Record<string, string>)[product.category] || product.category}</p>
          <h1 className="mt-3 font-display text-4xl tracking-wide text-[#282828] sm:text-5xl">{product.name}</h1>
          <p className="mt-6 text-2xl font-semibold text-[#282828]">${(product.price / 100).toFixed(2)}</p>
          <p className="mt-6 leading-relaxed text-[#282828]/80">{product.description}</p>

          <div className="mt-6 flex items-center gap-2 text-sm text-[#282828]/70">
            <span className="h-1.5 w-1.5 rounded-full bg-[#355444]" />
            {product.stock} {t.product.inStock}
          </div>

          <AddToCartButton
            productId={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
            sizes={sizes}
            sizeStock={sizeStock}
            locale={locale}
          />
        </div>
      </div>
    </div>
  );
}
