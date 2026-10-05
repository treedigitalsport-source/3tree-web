export const ADMIN_SESSION_COOKIE = "3tree_admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 Horas de TTL exactas

function getSecret(): string | null {
  const secret = process.env.ADMIN_SECRET_KEY?.trim();
  if (!secret) return null;
  if ((secret.startsWith('"') && secret.endsWith('"')) || (secret.startsWith("'") && secret.endsWith("'"))) {
    return secret.slice(1, -1).trim();
  }
  return secret;
}

function textToBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBytes(hex: string): Uint8Array | null {
  if (!/^[0-9a-fA-F]+$/.test(hex) || hex.length % 2 !== 0) return null;
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
}

async function getHmacKey(secretStr: string): Promise<CryptoKey> {
  const secretBytes = textToBytes(secretStr);
  return await crypto.subtle.importKey(
    "raw",
    secretBytes as unknown as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export function isAuthorizedAdminKey(key: string | null | undefined): boolean {
  const secret = getSecret();
  if (!secret || !key) return false;
  const keyBytes = textToBytes(key.trim());
  const secretBytes = textToBytes(secret);
  return timingSafeEqualBytes(keyBytes, secretBytes);
}

export async function createAdminSessionToken(): Promise<string | null> {
  const secret = getSecret();
  if (!secret) return null;

  const now = Date.now();
  const exp = now + SESSION_TTL_MS;
  const payload = `admin:${now}:${exp}`;

  const hmacKey = await getHmacKey(secret);
  const signatureBuffer = await crypto.subtle.sign("HMAC", hmacKey, textToBytes(payload) as unknown as BufferSource);
  const signatureHex = bytesToHex(new Uint8Array(signatureBuffer));

  return `${payload}.${signatureHex}`;
}

export async function verifyAdminSessionToken(token: string | null | undefined): Promise<boolean> {
  const secret = getSecret();
  if (!secret || !token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payload, signatureHex] = parts;
  const payloadParts = payload.split(":");
  if (payloadParts.length !== 3 || payloadParts[0] !== "admin") return false;

  const iatStr = payloadParts[1];
  const expStr = payloadParts[2];

  // Endurecimiento Pericial: Validación estricta de formato decimal para iat y exp
  if (!/^\d+$/.test(iatStr) || !/^\d+$/.test(expStr)) return false;

  const iat = Number(iatStr);
  const exp = Number(expStr);
  const now = Date.now();

  // Validaciones temporales strictly (iat <= now + 5s skew, exp > now, exp - iat == 8h TTL)
  if (isNaN(iat) || isNaN(exp)) return false;
  if (iat > now + 5000) return false; // Emitido en el futuro
  if (exp <= now) return false; // Token expirado
  if (exp - iat !== SESSION_TTL_MS) return false; // Ventana TTL alterada

  const sigBytes = hexToBytes(signatureHex);
  if (!sigBytes) return false;

  try {
    const hmacKey = await getHmacKey(secret);
    const expectedSigBuffer = await crypto.subtle.sign("HMAC", hmacKey, textToBytes(payload) as unknown as BufferSource);
    const expectedSigBytes = new Uint8Array(expectedSigBuffer);

    return timingSafeEqualBytes(sigBytes, expectedSigBytes);
  } catch {
    return false;
  }
}
