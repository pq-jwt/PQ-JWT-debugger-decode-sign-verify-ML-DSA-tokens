import {
  generateKeyPair,
  sign,
  verify,
  decode,
  exportKey,
  type Algorithm,
} from "@pq-jwt/core";
import { decodeJwt, normalizeHexKey } from "./jwt-utils";

export type { Algorithm };

export const DEFAULT_ALGORITHM: Algorithm = "ML-DSA-65";

export const ML_DSA_ALGORITHMS = [
  "ML-DSA-44",
  "ML-DSA-65",
  "ML-DSA-87",
] as const satisfies readonly Algorithm[];

export interface Keypair {
  privateKey: string;
  publicKey: string;
  algorithm: Algorithm;
}

export function algoLabel(algo: Algorithm): string {
  return algo;
}

export function generateKeys(algo: Algorithm = DEFAULT_ALGORITHM): Keypair {
  const kp = generateKeyPair(algo);
  return {
    privateKey: exportKey(kp.secretKey),
    publicKey: exportKey(kp.publicKey),
    algorithm: kp.algorithm,
  };
}

export function signToken(
  algo: Algorithm,
  privateKeyHex: string,
  issuer: string,
  expiresInSeconds: number,
  customClaims?: Record<string, unknown>
): { jwt: string; jti?: string } {
  const jwt = sign(customClaims ?? {}, normalizeHexKey(privateKeyHex), {
    algorithm: algo,
    issuer,
    expiresIn: expiresInSeconds,
  });
  const { payload } = decode(jwt);
  const jti = typeof payload.jti === "string" ? payload.jti : undefined;
  return { jwt, jti };
}

export function verifyToken(
  jwt: string,
  publicKeyHex: string,
  options: { issuer?: string; audience?: string; subject?: string }
): Record<string, unknown> {
  const { payload } = verify(jwt.trim(), normalizeHexKey(publicKeyHex), options);
  return payload as Record<string, unknown>;
}

/** Decode with @pq-jwt/core (supports typ: PQ-JWT). */
export function decodeToken(token: string) {
  return decode(token.trim());
}

/** Decode header/payload without crypto verify (for UI hints). */
export function peekToken(token: string) {
  try {
    return decodeJwt(token);
  } catch {
    const { header, payload } = decode(token.trim());
    return {
      header: header as Record<string, unknown>,
      payload: payload as Record<string, unknown>,
      signature: "",
      headerB64: "",
      payloadB64: "",
    };
  }
}
