import { NextRequest, NextResponse } from 'next/server';
import { scrypt, timingSafeEqual, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

/**
 * Hash a password for storage in ALBUM_PASSWORD_HASH:
 *   node -e "
 *     const { scrypt, randomBytes } = require('crypto');
 *     const { promisify } = require('util');
 *     const s = promisify(scrypt);
 *     const salt = randomBytes(16).toString('hex');
 *     s('your-password', salt, 64).then(h => console.log(salt + ':' + h.toString('hex')));
 *   "
 *
 * Store the output (salt:hash) in ALBUM_PASSWORD_HASH.
 */
async function verifyPassword(candidate: string, stored: string): Promise<boolean> {
  try {
    const [salt, hash] = stored.split(':');
    if (!salt || !hash) return false;
    const derivedBuffer = (await scryptAsync(candidate, salt, 64)) as Buffer;
    const storedBuffer = Buffer.from(hash, 'hex');
    if (derivedBuffer.length !== storedBuffer.length) return false;
    return timingSafeEqual(derivedBuffer, storedBuffer);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ error: 'Missing password' }, { status: 400 });
    }

    const stored = process.env.ALBUM_PASSWORD_HASH;
    if (!stored) {
      // No password configured — open in development
      return NextResponse.json({ success: true });
    }

    const valid = await verifyPassword(password, stored);
    if (!valid) {
      await new Promise(r => setTimeout(r, 400)); // brute-force delay
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
