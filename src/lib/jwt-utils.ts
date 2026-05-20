export interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  headerB64: string;
  payloadB64: string;
}

function base64UrlDecode(segment: string): string {
  const padded = segment + "=".repeat((4 - (segment.length % 4)) % 4);
  const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export function normalizeHexKey(value: string): string {
  return value.trim().replace(/^0x/i, "").replace(/\s+/g, "");
}

export function isLikelyJwt(token: string): boolean {
  const parts = token.trim().split(".");
  return parts.length === 3 && parts[0].startsWith("eyJ");
}

export function isHexKey(value: string): boolean {
  const trimmed = normalizeHexKey(value);
  return /^[0-9a-f]+$/i.test(trimmed) && trimmed.length >= 64;
}

export function decodeJwt(token: string): DecodedJwt {
  const trimmed = token.trim();
  const parts = trimmed.split(".");
  if (parts.length !== 3) {
    throw new Error("JWT must have exactly 3 segments (header.payload.signature)");
  }
  const [headerB64, payloadB64, signature] = parts;
  if (!headerB64 || !payloadB64 || !signature) {
    throw new Error("JWT segments cannot be empty");
  }
  if (!headerB64.startsWith("eyJ")) {
    throw new Error(
      "This does not look like a PQ-JWT — paste the full token starting with eyJ… (not a signature fragment)."
    );
  }

  let header: Record<string, unknown>;
  let payload: Record<string, unknown>;
  try {
    header = JSON.parse(base64UrlDecode(headerB64)) as Record<string, unknown>;
  } catch {
    throw new Error("Invalid PQ-JWT header (not valid JSON)");
  }
  try {
    payload = JSON.parse(base64UrlDecode(payloadB64)) as Record<string, unknown>;
  } catch {
    throw new Error("Invalid PQ-JWT payload (not valid JSON)");
  }

  return { header, payload, signature, headerB64, payloadB64 };
}

export function formatJson(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}

export function byteLength(str: string): number {
  return new TextEncoder().encode(str).length;
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  return `${(n / 1024).toFixed(2)} KB`;
}
