import { useState } from "react";
import { signToken } from "../lib/pq-crypto";
import { buildRs256Jwt, compareSizes, type SizeComparison } from "../lib/rs256-compare";
import { formatBytes } from "../lib/jwt-utils";
import { DEFAULT_ISSUER } from "../lib/ecosystem-links";

interface Props {
  privateKey: string;
}

const SAMPLE_CLAIMS = {
  sub: "user@example.com",
  name: "Alice",
  role: "admin",
};

export default function SizeComparePanel({ privateKey }: Props) {
  const [comparison, setComparison] = useState<SizeComparison | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runComparison() {
    setError(null);
    setComparison(null);
    if (!privateKey.trim()) {
      setError("Generate a keypair first (Keys tab) to sign an ML-DSA-65 sample token.");
      return;
    }

    setBusy(true);
    try {
      const [{ jwt: pqJwt }, rs256Jwt] = await Promise.all([
        signToken("ML-DSA-65", privateKey, DEFAULT_ISSUER, 3600, SAMPLE_CLAIMS),
        buildRs256Jwt(DEFAULT_ISSUER, SAMPLE_CLAIMS.sub, {
          name: SAMPLE_CLAIMS.name,
          role: SAMPLE_CLAIMS.role,
        }),
      ]);
      setComparison(compareSizes(rs256Jwt, pqJwt));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  const maxBar = comparison
    ? Math.max(comparison.rs256Bytes, comparison.pqBytes)
    : 1;

  return (
    <section className="panel">
      <h2>RS256 vs ML-DSA-65 size</h2>
      <p className="hint">
        Signs the same sample claims with RS256 (2048-bit RSA) and ML-DSA-65 so you can see why PQ-JWT
        needs different transport (cookies, headers) than classical JWTs.
      </p>

      <div className="btn-row">
        <button type="button" className="btn btn-primary" disabled={busy} onClick={runComparison}>
          {busy ? "Comparing…" : "Run size comparison"}
        </button>
      </div>

      {error && <div className="status err">{error}</div>}

      {comparison && (
        <div className="size-chart" style={{ marginTop: "1.25rem" }}>
          <div className="bar-group">
            <label>RS256 — {formatBytes(comparison.rs256Bytes)} total</label>
            <div className="bar-track">
              <div
                className="bar-fill rs256"
                style={{ width: `${(comparison.rs256Bytes / maxBar) * 100}%` }}
              >
                {comparison.rs256Bytes} B
              </div>
            </div>
          </div>

          <div className="bar-group">
            <label>ML-DSA-65 — {formatBytes(comparison.pqBytes)} total</label>
            <div className="bar-track">
              <div
                className="bar-fill pq"
                style={{ width: `${(comparison.pqBytes / maxBar) * 100}%` }}
              >
                {comparison.pqBytes} B
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="value">{comparison.ratio.toFixed(1)}×</div>
              <div className="label">PQ larger than RS256</div>
            </div>
            <div className="stat-card warn">
              <div className="value">{formatBytes(comparison.signatureBytes.pq)}</div>
              <div className="label">PQ signature segment</div>
            </div>
            <div className="stat-card">
              <div className="value">{formatBytes(comparison.signatureBytes.rs256)}</div>
              <div className="label">RS256 signature segment</div>
            </div>
            <div className="stat-card">
              <div className="value">{formatBytes(comparison.pqBytes - comparison.rs256Bytes)}</div>
              <div className="label">Extra bytes (PQ)</div>
            </div>
          </div>

          <p className="hint" style={{ marginTop: "1rem" }}>
            Segment breakdown — header: RS256 {comparison.headerBytes.rs256} B vs PQ{" "}
            {comparison.headerBytes.pq} B · payload: RS256 {comparison.payloadBytes.rs256} B vs PQ{" "}
            {comparison.payloadBytes.pq} B · signature: RS256 {comparison.signatureBytes.rs256} B vs
            PQ {comparison.signatureBytes.pq} B
          </p>
        </div>
      )}
    </section>
  );
}
