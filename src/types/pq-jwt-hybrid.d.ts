/**
 * Runtime exports for @pq-jwt/hybrid v0.0.2 (composite ML-DSA + ECDSA / EdDSA).
 * Package .d.ts may lag behind index.mjs — keep in sync when upgrading.
 */
declare module "@pq-jwt/hybrid" {
  export const SUPPORTED_ALGORITHMS: string[];

  export function generateCompositeKeyPair(algorithm?: string): {
    compositePublicKey: Uint8Array;
    compositePrivateKey: Uint8Array;
    algorithm: string;
  };

  export function exportCompositeKey(key: Uint8Array): string;
  export function importCompositeKey(hexString: string): Uint8Array;

  export function signComposite(
    payload: Record<string, unknown>,
    compositePrivateKey: Uint8Array | string,
    options?: {
      algorithm?: string;
      expiresIn?: number | string;
      notBefore?: number | string;
      issuer?: string;
      subject?: string;
      audience?: string;
      jwtId?: string;
    }
  ): string;

  export function verifyComposite(
    token: string,
    compositePublicKey: Uint8Array | string,
    options?: {
      issuer?: string;
      audience?: string;
      subject?: string;
      ignoreExpiry?: boolean;
      clockTolerance?: number;
    }
  ): { header: Record<string, unknown>; payload: Record<string, unknown> };

  export function decode(token: string): {
    header: Record<string, unknown>;
    payload: Record<string, unknown>;
    signature: Uint8Array;
  };
}
