import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Max 50MB
const MAX_SIZE = 50 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 413 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 415 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ── Thumbnail generation via Sharp ────────────────────────────────────
    let thumbnailBuffer: Buffer | null = null;
    let width: number | null = null;
    let height: number | null = null;

    try {
      const sharp = (await import('sharp')).default;
      const image = sharp(buffer);
      const meta = await image.metadata();
      width = meta.width ?? null;
      height = meta.height ?? null;

      thumbnailBuffer = await image
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
    } catch (sharpErr) {
      console.warn('Sharp unavailable:', sharpErr);
    }

    // ── Storage: Vercel Blob (optional) ───────────────────────────────────
    let url: string | null = null;
    let thumbnailUrl: string | null = null;

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (blobToken) {
      try {
        const { put } = await import('@vercel/blob');
        const slug = file.name.replace(/[^a-z0-9.]/gi, '-').toLowerCase();

        const blob = await put(`uploads/${Date.now()}-${slug}`, buffer, {
          access: 'public',
          token: blobToken,
          contentType: file.type,
        });
        url = blob.url;

        if (thumbnailBuffer) {
          const thumbBlob = await put(
            `uploads/thumbs/${Date.now()}-${slug}.webp`,
            thumbnailBuffer,
            { access: 'public', token: blobToken, contentType: 'image/webp' }
          );
          thumbnailUrl = thumbBlob.url;
        }
      } catch (blobErr) {
        console.error('Blob upload failed:', blobErr);
        // Fall through — return metadata without URL
      }
    }

    return NextResponse.json({
      success: true,
      filename: file.name,
      size: file.size,
      type: file.type,
      width,
      height,
      url,
      thumbnailUrl,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
