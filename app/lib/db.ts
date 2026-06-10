import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const DB_PATH = path.join(process.cwd(), 'data', 'store.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  return db;
}

export function initDb() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price INTEGER NOT NULL,
      image TEXT,
      image_blob BLOB,
      image_type TEXT,
      category TEXT NOT NULL DEFAULT 't-shirt',
      sizes TEXT NOT NULL DEFAULT 'S,M,L,XL',
      size_stock TEXT,
      stock INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      shipping_address TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      size TEXT NOT NULL,
      price INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS banners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT,
      image_url TEXT,
      image_blob BLOB,
      image_type TEXT,
      link_url TEXT NOT NULL DEFAULT '/',
      show_title INTEGER NOT NULL DEFAULT 1,
      show_button INTEGER NOT NULL DEFAULT 1,
      active INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migrate: add image_blob/image_type/size_stock columns if missing
  try { db.exec("ALTER TABLE products ADD COLUMN image_blob BLOB"); } catch { /* already exists */ }
  try { db.exec("ALTER TABLE products ADD COLUMN image_type TEXT"); } catch { /* already exists */ }
  try { db.exec("ALTER TABLE products ADD COLUMN size_stock TEXT"); } catch { /* already exists */ }
  try { db.exec("ALTER TABLE banners ADD COLUMN image_blob BLOB"); } catch { /* already exists */ }
  try { db.exec("ALTER TABLE banners ADD COLUMN image_type TEXT"); } catch { /* already exists */ }
  try { db.exec("ALTER TABLE banners ADD COLUMN show_title INTEGER NOT NULL DEFAULT 1"); } catch { /* already exists */ }
  try { db.exec("ALTER TABLE banners ADD COLUMN show_button INTEGER NOT NULL DEFAULT 1"); } catch { /* already exists */ }

  // Seed products from JSON if none exist
  const count = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if (count.count === 0) {
    // Check multiple possible locations for seed file
    const possiblePaths = [
      path.join(process.cwd(), 'data', 'products-seed.json'),
      path.join(process.cwd(), 'products-seed.json'),
      'C:\\Users\\Gokai\\Downloads\\products-2026-06-10.json',
    ];
    const jsonPath = possiblePaths.find(p => fs.existsSync(p));
    if (jsonPath) {
      const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
      const products: any[] = JSON.parse(jsonContent);

      const insert = db.prepare(`
        INSERT INTO products (name, description, price, image, category, sizes, size_stock, stock, active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      let inserted = 0;
      for (const product of products) {
        // Get ALL sizes (not just those with stock)
        const allSizes = product.sizes
          ?.map((s: any) => s.size)
          .join(',') || 'TU';

        // Build size_stock JSON object
        const sizeStock: Record<string, number> = {};
        product.sizes?.forEach((s: any) => {
          sizeStock[s.size] = s.stock || 0;
        });

        // Convert price to cents
        const priceCents = Math.round((product.salePrice || 0) * 100);

        // Keep original category (will be translated in UI via i18n)
        const category = product.category || 'Outros';

        // Use image URL if available, otherwise use placeholder
        const image = product.image || `https://picsum.photos/seed/${product.id}/400/400`;

        insert.run(
          product.name,
          null, // description not in JSON
          priceCents,
          image,
          category,
          allSizes,
          JSON.stringify(sizeStock),
          product.stock || 0,
          1 // active
        );

        inserted++;
      }
      console.log(`Seeded ${inserted} products from JSON`);
    } else {
      // Fallback to hardcoded products if JSON not found
      const insert = db.prepare(`
        INSERT INTO products (name, description, price, image, category, sizes, stock)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      const products = [
        ['Classic White Tee', 'Premium cotton white t-shirt. Clean, minimal, timeless.', 2990, '/products/white.jpg', 't-shirt', 'S,M,L,XL', 50],
        ['Vintage Black Tee', 'Soft-wash black t-shirt with a lived-in feel.', 3490, '/products/black.jpg', 't-shirt', 'S,M,L,XL', 40],
        ['Navy Blue Tee', 'Deep navy cotton t-shirt for everyday wear.', 2990, '/products/navy.jpg', 't-shirt', 'S,M,L,XL', 35],
        ['Heather Grey Tee', 'Comfortable heather grey blend t-shirt.', 2790, '/products/grey.jpg', 't-shirt', 'S,M,L,XL', 45],
        ['Forest Green Tee', 'Earthy forest green t-shirt. Nature inspired.', 3490, '/products/green.jpg', 't-shirt', 'S,M,L,XL', 30],
        ['Oversized Boxy Tee', 'Relaxed oversized fit. Streetwear essential.', 3990, '/products/boxy.jpg', 't-shirt', 'S,M,L,XL', 25],
        ['Striped Tee', 'Classic horizontal stripes. Never goes out of style.', 3290, '/products/striped.jpg', 't-shirt', 'S,M,L,XL', 20],
        ['Graphic Logo Tee', 'Minimal brand logo on chest. Subtle statement.', 3990, '/products/logo.jpg', 't-shirt', 'S,M,L,XL', 40],
      ];
      for (const p of products) {
        insert.run(...p);
      }
      console.log('Seeded fallback products');
    }
  }

  // Seed admin user if none exists
  const adminCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin'").get() as { count: number };
  if (adminCount.count === 0) {
    const hashed = bcrypt.hashSync('admin123', 10);
    db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
      'Admin',
      'admin@bene.com',
      hashed,
      'admin'
    );
    console.log('Seeded admin user: admin@bene.com / admin123');
  }

  // Seed demo banners if none exist
  const bannerCount = db.prepare('SELECT COUNT(*) as count FROM banners').get() as { count: number };
  if (bannerCount.count === 0) {
    const bannerInsert = db.prepare(`
      INSERT INTO banners (title, subtitle, image_url, link_url, active, sort_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    bannerInsert.run('Summer Collection', 'New arrivals for the season', '/banner1.jpg', '/#shop', 1, 0);
    bannerInsert.run('Limited Edition', 'Exclusive drops you cannot miss', '/banner2.jpg', '/#shop', 1, 1);
    bannerInsert.run('Premium Quality', 'Crafted for everyday comfort', '/banner3.jpg', '/#shop', 1, 2);
  }

  return db;
}
