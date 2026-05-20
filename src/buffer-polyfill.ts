/**
 * @pq-jwt/core uses Node's Buffer for base64/hex (see package src/index.mjs).
 * Browsers don't define Buffer — install before any @pq-jwt/core import chain.
 */
import { Buffer } from "buffer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).Buffer = Buffer;
