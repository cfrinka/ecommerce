import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'store.db');
const JSON_PATH = 'C:\\Users\\Gokai\\Downloads\\products-2026-06-10.json';

interface Size {
  size: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  salePrice: number;
  image: string;
  category: string;
  sizes: Size[];
  stock: number;
  plusSized?: boolean;
}

function main() {
  if (!fs.existsSync(JSON_PATH)) {
    console.error(`JSON file not found: ${JSON_PATH}`);
    process.exit(1);
  }

  const jsonContent = fs.readFileSync(JSON_PATH, 'utf-8');
  const products: Product[] = JSON.parse(jsonContent);

  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');

  // Clear existing products
  const deleteStmt = db.prepare('DELETE FROM products');
  deleteStmt.run();
  console.log('Cleared existing products');

  const insert = db.prepare(`
    INSERT INTO products (name, description, price, image, category, sizes, stock, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const categoryMap: Record<string, string> = {
    'Regatas': 'Tank Tops',
    'Shorts': 'Shorts',
    'Blusas': 'Blouses',
    'Camisetas': 'T-Shirts',
    'Calças': 'Pants',
  };

  let inserted = 0;
  for (const product of products) {
    // Filter sizes that have stock
    const availableSizes = product.sizes
      .filter((s) => s.stock > 0)
      .map((s) => s.size)
      .join(',');

    // Skip if no sizes available
    if (!availableSizes) continue;

    // Convert price to cents
    const priceCents = Math.round(product.salePrice * 100);

    // Map category
    const category = categoryMap[product.category] || product.category;

    // Use image URL if available, otherwise use placeholder
    const image = product.image || `https://picsum.photos/seed/${product.id}/400/400`;

    insert.run(
      product.name,
      null, // description not in JSON
      priceCents,
      image,
      category,
      availableSizes,
      product.stock,
      1 // active
    );

    inserted++;
  }

  console.log(`Inserted ${inserted} products`);
  db.close();
}

main();
