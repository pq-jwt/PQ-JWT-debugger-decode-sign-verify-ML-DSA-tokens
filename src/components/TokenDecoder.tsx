import { useMemo } from "react";
import { peekToken } from "../lib/pq-crypto";
import { formatJson, byteLength, formatBytes } from "../lib/jwt-utils";
import FieldLabelRow from "./FieldLabelRow";

interface Props {
  token: string;
}

const EMPTY_HEADER = '{\n  "alg": "",\n  "typ": "",\n  "ver": ""\n}';
const EMPTY_PAYLOAD = '{\n  "iss": "",\n  "sub": "",\n  "aud": "",\n  "exp": ""\n}';

export default function TokenDecoder({ token }: Props) {
  const trimmed = token.trim();

  const result = useMemo(() => {
    if (!trimmed) return { kind: "empty" as const };
    try {
      return { kind: "ok" as const, data: peekToken(token) };
    } catch (e) {
      return {
        kind: "err" as const,
        error: e instanceof Error ? e.message : String(e),
      };
    }
  }, [token, trimmed]);

  const headerJson =
    result.kind === "ok" ? formatJson(result.data.header) : EMPTY_HEADER;
  const payloadJson =
    result.kind === "ok" ? formatJson(result.data.payload) : EMPTY_PAYLOAD;
  const canCopy = result.kind === "ok";

  const totalBytes = trimmed ? byteLength(trimmed) : 0;
  const sigBytes =
    result.kind === "ok" && result.data.signature
      ? byteLength(result.data.signature)
      : 0;
  const header = result.kind === "ok" ? result.data.header : null;
  const payload = result.kind === "ok" ? result.data.payload : null;

  return (
    <div className="decode-output" aria-live="polite">
      {result.kind === "ok" && (
        <p className="decode-valid-banner">✓ Valid token — header and payload decoded</p>
      )}
      {result.kind === "err" && <div className="status err decode-output-err">{result.error}</div>}

      <div className="decode-grid decode-grid-persistent">
        <div className="decode-grid-cell">
          <FieldLabelRow
            copy={canCopy ? { text: headerJson, label: "decoded header" } : undefined}
          >
            <span className="decode-section-label">Decoded header</span>
          </FieldLabelRow>
          <pre
            className={`json-block header decode-json-full${result.kind === "empty" ? " decode-json-placeholder" : ""}`}
          >
            {headerJson}
          </pre>
        </div>
        <div className="decode-grid-cell">
          <FieldLabelRow
            copy={canCopy ? { text: payloadJson, label: "decoded payload" } : undefined}
          >
            <span className="decode-section-label">Decoded payload</span>
          </FieldLabelRow>
          <pre
            className={`json-block payload decode-json-full${result.kind === "empty" ? " decode-json-placeholder" : ""}`}
          >
            {payloadJson}
          </pre>
        </div>
      </div>

      <div className="token-meta token-meta-persistent">
        <span>
          Total size:{" "}
          <strong>
            {totalBytes > 0 ? formatBytes(totalBytes) : "—"}
          </strong>
          {totalBytes > 0 && ` (${totalBytes.toLocaleString()} bytes)`}
        </span>
        <span>
          Signature segment: <strong>{sigBytes > 0 ? formatBytes(sigBytes) : "—"}</strong>
        </span>
        <span>
          Algorithm: <strong>{header && typeof header.alg === "string" ? header.alg : "—"}</strong>
        </span>
        <span>
          Type: <strong>{header && typeof header.typ === "string" ? header.typ : "—"}</strong>
        </span>
        <span>
          Issuer: <strong>{payload && typeof payload.iss === "string" ? payload.iss : "—"}</strong>
        </span>
        <span>
          JTI: <strong>{payload && typeof payload.jti === "string" ? payload.jti : "—"}</strong>
        </span>
      </div>
    </div>
  );
}
