import { scrypt as scryptCallback, timingSafeEqual, randomBytes } from 'node:crypto';

const N = 131072;
const R = 8;
const P = 1;
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;
const MAXMEM = 256 * 1024 * 1024;
const KEY_ENCODING_LENGTH = Math.ceil((KEY_LENGTH * 4) / 3);
const SALT_ENCODING_LENGTH = Math.ceil((SALT_LENGTH * 4) / 3);

type ParsedHash = { salt: Buffer; key: Buffer };

function decodeCanonicalBase64Url(value: string, expectedLength: number, encodedLength: number): Buffer | null {
  if (value.length !== encodedLength || !/^[A-Za-z0-9_-]+$/.test(value)) return null;
  const decoded = Buffer.from(value, 'base64url');
  if (decoded.length !== expectedLength || decoded.toString('base64url') !== value) return null;
  return decoded;
}

function parsePasswordHash(stored: string): ParsedHash | null {
  if (stored.length > 160) return null;
  const parts = stored.split('$');
  let n: string | undefined;
  let r: string | undefined;
  let p: string | undefined;
  let saltEncoded: string | undefined;
  let keyEncoded: string | undefined;

  if (parts.length === 6 && parts[0] === 'scrypt') {
    // Legacy format: scrypt$N$r$p$salt$key
    [, n, r, p, saltEncoded, keyEncoded] = parts;
  } else if (parts.length === 7 && parts[0] === 'scrypt' && parts[1] === 'v1') {
    // Versioned format: scrypt$v1$N$r$p$salt$key
    [, , n, r, p, saltEncoded, keyEncoded] = parts;
  } else {
    return null;
  }

  if (n !== String(N) || r !== String(R) || p !== String(P) || !saltEncoded || !keyEncoded) return null;
  const salt = decodeCanonicalBase64Url(saltEncoded, SALT_LENGTH, SALT_ENCODING_LENGTH);
  const key = decodeCanonicalBase64Url(keyEncoded, KEY_LENGTH, KEY_ENCODING_LENGTH);
  return salt && key ? { salt, key } : null;
}

function deriveKey(password: string, salt: Buffer, length: number, options: { N: number; r: number; p: number }): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, length, { ...options, maxmem: MAXMEM }, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt, KEY_LENGTH, { N, r: R, p: P });
  return `scrypt$v1$${N}$${R}$${P}$${salt.toString('base64url')}$${key.toString('base64url')}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parsed = parsePasswordHash(stored);
  if (!parsed) return false;
  try {
    const actual = await deriveKey(password, parsed.salt, KEY_LENGTH, { N, r: R, p: P });
    return timingSafeEqual(actual, parsed.key);
  } catch { return false; }
}
