import { useMemo } from "react";
import { peekToken } from "../lib/pq-crypto";
import { formatJson, byteLength, formatBytes } from "../lib/jwt-utils";

interface Props {
  token: string;
}

export default function TokenDecoder({ token }: Props) {
  const result = useMemo(() => {
    if (!token.trim()) return null;
    try {
      return { ok: true as const, data: peekToken(token) };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : String(e) };
    }
  }, [token]);

  if (!token.trim()) {
    return (
      <p className="hint">Paste a PQ-JWT above to decode its header and payload (no verification).</p>
    );
  }

  if (!result) return null;

  if (!result.ok) {
    return <div className="status err">{result.error}</div>;
  }

  const { header, payload, signature } = result.data;
  const totalBytes = byteLength(token.trim());
  const sigBytes = signature ? byteLength(signature) : 0;

  return (
    <>
      <div className="decode-grid">
        <div>
          <label>Header</label>
          <pre className="json-block header">{formatJson(header)}</pre>
        </div>
        <div>
          <label>Payload</label>
          <pre className="json-block payload">{formatJson(payload)}</pre>
        </div>
      </div>
      <div className="token-meta">
        <span>
          Total size: <strong>{formatBytes(totalBytes)}</strong> ({totalBytes.toLocaleString()} bytes)
        </span>
        {sigBytes > 0 && (
          <span>
            Signature segment: <strong>{formatBytes(sigBytes)}</strong>
          </span>
        )}
        {typeof header.alg === "string" && (
          <span>
            Algorithm: <strong>{header.alg}</strong>
          </span>
        )}
        {typeof header.typ === "string" && (
          <span>
            Type: <strong>{header.typ}</strong>
          </span>
        )}
        {typeof payload.iss === "string" && (
          <span>
            Issuer: <strong>{payload.iss}</strong>
          </span>
        )}
        {typeof payload.jti === "string" && (
          <span>
            JTI: <strong>{payload.jti}</strong>
          </span>
        )}
      </div>
    </>
  );
}
