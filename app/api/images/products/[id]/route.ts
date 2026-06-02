import { getDb } from '@/app/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const row = db.prepare('SELECT image_blob, image_type, image FROM products WHERE id = ?').get(id) as
    | { image_blob: Buffer | null; image_type: string | null; image: string | null }
    | undefined;

  if (!row) {
    return new Response('Not found', { status: 404 });
  }

  // If BLOB exists, serve it directly
  if (row.image_blob && row.image_type) {
    const bytes = new Uint8Array(row.image_blob);
    return new Response(bytes, {
      headers: {
        'Content-Type': row.image_type,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  // If URL (external or local path), redirect
  if (row.image) {
    const url = new URL(row.image, request.url);
    return Response.redirect(url.toString(), 302);
  }

  return new Response('Not found', { status: 404 });
}
