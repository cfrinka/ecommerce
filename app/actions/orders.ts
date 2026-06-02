'use server';

import { revalidatePath } from 'next/cache';
import { CheckoutSchema } from '@/app/lib/definitions';
import { getDb } from '@/app/lib/db';
import { requireAuth, requireAdmin } from '@/app/lib/auth';

export async function placeOrder(cart: { productId: number; quantity: number; size: string }[], formData: FormData) {
  const user = await requireAuth();
  const db = getDb();

  const shippingAddress = formData.get('shippingAddress') as string;
  if (!shippingAddress || shippingAddress.length < 5) {
    return { message: 'Please enter a valid shipping address.' };
  }

  if (cart.length === 0) {
    return { message: 'Your cart is empty.' };
  }

  // Calculate total and validate stock
  let total = 0;
  const items: { productId: number; quantity: number; size: string; price: number }[] = [];

  for (const item of cart) {
    const product = db.prepare('SELECT id, price, stock FROM products WHERE id = ? AND active = 1').get(item.productId) as
      | { id: number; price: number; stock: number }
      | undefined;
    if (!product) {
      return { message: 'One or more products are no longer available.' };
    }
    if (product.stock < item.quantity) {
      return { message: 'Not enough stock for one or more items.' };
    }
    total += product.price * item.quantity;
    items.push({ productId: item.productId, quantity: item.quantity, size: item.size, price: product.price });
  }

  // Insert order
  const orderResult = db.prepare('INSERT INTO orders (user_id, total, status, shipping_address) VALUES (?, ?, ?, ?)').run(
    user.id,
    total,
    'pending',
    shippingAddress
  );
  const orderId = Number(orderResult.lastInsertRowid);

  // Insert items and update stock
  const insertItem = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, size, price) VALUES (?, ?, ?, ?, ?)');
  const updateStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');

  for (const item of items) {
    insertItem.run(orderId, item.productId, item.quantity, item.size, item.price);
    updateStock.run(item.quantity, item.productId);
  }

  revalidatePath('/orders');
  revalidatePath('/admin/orders');
  return { success: true };
}

export async function updateOrderStatus(orderId: number, status: string) {
  await requireAdmin();
  const db = getDb();
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, orderId);
  revalidatePath('/admin/orders');
  revalidatePath('/orders');
}

export async function updateOrderStatusAction(orderId: number, formData: FormData) {
  const status = formData.get('status') as string;
  await updateOrderStatus(orderId, status);
}

export async function getOrders() {
  const user = await requireAuth();
  const db = getDb();
  const orders = db.prepare(`
    SELECT o.*, u.name as user_name, u.email as user_email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `).all(user.id) as OrderRow[];

  for (const order of orders) {
    order.items = db.prepare(`
      SELECT oi.*, p.name as product_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(order.id) as OrderItemRow[];
  }

  return orders;
}

export async function getAllOrders() {
  await requireAdmin();
  const db = getDb();
  const orders = db.prepare(`
    SELECT o.*, u.name as user_name, u.email as user_email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `).all() as OrderRow[];

  for (const order of orders) {
    order.items = db.prepare(`
      SELECT oi.*, p.name as product_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(order.id) as OrderItemRow[];
  }

  return orders;
}

type OrderRow = {
  id: number;
  user_id: number;
  total: number;
  status: string;
  shipping_address: string;
  created_at: string;
  user_name: string;
  user_email: string;
  items: OrderItemRow[];
};

type OrderItemRow = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  size: string;
  price: number;
  product_name: string;
};
