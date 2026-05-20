# PQ-JWT Debugger

Browser-based developer tool for the **PQ-JWT ecosystem** — decode, sign, and verify post-quantum JWTs, composite hybrid tokens, PQ-JOSE (JWK / JWE), and RS256 size comparison.

Runs entirely client-side (no backend). Uses [**@pq-jwt/core**](https://www.npmjs.com/package/@pq-jwt/core), [**@pq-jwt/hybrid**](https://www.npmjs.com/package/@pq-jwt/hybrid), and [**@pq-jose/jose**](https://www.npmjs.com/package/@pq-jose/jose) in the browser, plus [jose](https://github.com/panva/jose) for the RS256 baseline.

## PQ-JWT ecosystem (this repo)

| Package | In this app |
| --- | --- |
| **@pq-jwt/core** | Decode, Keys, Sign, Verify, Size compare |
| **@pq-jwt/hybrid** | **Hybrid** tab — `generateCompositeKeyPair`, `signComposite`, `verifyComposite`, `decode` |
| **@pq-jose/jose** | **PQ-JOSE** tab — `SignJWT`, `jwtVerify`, `decodeJwt`, ML-KEM JWE (`EncryptJWT` / `jwtDecrypt`) |
| **@pq-jwt/express** | **Express** tab — Node-only; sample `pqAuth()` snippet (not bundled) |

## Features

- **Decode** — PQ-JWT header/payload
- **Keys / Sign / Verify** — `@pq-jwt/core`
- **Size compare** — RS256 vs ML-DSA-65 (`jose` + core)
- **Hybrid** — Composite ML-DSA + classical (`@pq-jwt/hybrid` v0.0.2 API)
- **PQ-JOSE** — jose-style JWT + JWE + JWK (`@pq-jose/jose`)
- **Express** — copy-paste server pattern for `@pq-jwt/express`

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
npm run preview
```

## Browser notes

- **`Buffer`:** `@pq-jwt/core` (and related packages) use Node’s `Buffer`. `src/buffer-polyfill.ts` runs first.
- **`crypto`:** `@pq-jose/jose` JWE uses Node `crypto` (AES-GCM). [vite-plugin-node-polyfills](https://www.npmjs.com/package/vite-plugin-node-polyfills) supplies a browser `crypto` implementation for the PQ-JOSE tab only (lazy-loaded chunk).

## Security

Private keys never leave the browser. For development and education only.

## License

MIT
