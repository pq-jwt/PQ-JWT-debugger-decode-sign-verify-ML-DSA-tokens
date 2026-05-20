import { SignJWT, generateKeyPair, exportSPKI } from "jose";
import { byteLength } from "./jwt-utils";

export interface SizeComparison {
  rs256Jwt: string;
  rs256Bytes: number;
  pqJwt: string;
  pqBytes: number;
  ratio: number;
  headerBytes: { rs256: number; pq: number };
  payloadBytes: { rs256: number; pq: number };
  signatureBytes: { rs256: number; pq: number };
}

function segmentBytes(jwt: string, index: 0 | 1 | 2): number {
  const part = jwt.split(".")[index];
  return part ? byteLength(part) : 0;
}

export async function buildRs256Jwt(
  issuer: string,
  subject: string,
  customClaims: Record<string, unknown>
): Promise<string> {
  const { privateKey } = await generateKeyPair("RS256", { modulusLength: 2048 });
  const now = Math.floor(Date.now() / 1000);

  return new SignJWT({ ...customClaims })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(issuer)
    .setSubject(subject)
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(privateKey);
}

export function compareSizes(rs256Jwt: string, pqJwt: string): SizeComparison {
  const rs256Bytes = byteLength(rs256Jwt);
  const pqBytes = byteLength(pqJwt);
  return {
    rs256Jwt,
    rs256Bytes,
    pqJwt,
    pqBytes,
    ratio: pqBytes / rs256Bytes,
    headerBytes: {
      rs256: segmentBytes(rs256Jwt, 0),
      pq: segmentBytes(pqJwt, 0),
    },
    payloadBytes: {
      rs256: segmentBytes(rs256Jwt, 1),
      pq: segmentBytes(pqJwt, 1),
    },
    signatureBytes: {
      rs256: segmentBytes(rs256Jwt, 2),
      pq: segmentBytes(pqJwt, 2),
    },
  };
}

/** Approximate RS256 public key size for display */
export async function rs256KeySizeHint(): Promise<number> {
  const { publicKey } = await generateKeyPair("RS256", { modulusLength: 2048 });
  const spki = await exportSPKI(publicKey);
  return byteLength(spki);
}
