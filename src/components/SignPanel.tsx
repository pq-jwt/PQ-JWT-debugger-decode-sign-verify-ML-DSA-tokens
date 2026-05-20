import { useState } from "react";
import {
  signToken,
  DEFAULT_ALGORITHM,
  ML_DSA_ALGORITHMS,
  algoLabel,
  type Algorithm,
} from "../lib/pq-crypto";
import { isHexKey } from "../lib/jwt-utils";
import FieldLabelRow from "./FieldLabelRow";
import { DEFAULT_ISSUER } from "../lib/ecosystem-links";

interface Props {
  privateKey: string;
  onSigned: (jwt: string) => void;
}

export default function SignPanel({ privateKey, onSigned }: Props) {
  const [algo, setAlgo] = useState<Algorithm>(DEFAULT_ALGORITHM);
  const [issuer, setIssuer] = useState(DEFAULT_ISSUER);
  const [expiresIn, setExpiresIn] = useState("3600");
  const [claimsJson, setClaimsJson] = useState('{\n  "sub": "user@example.com",\n  "name": "Alice"\n}');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function handleSign() {
    setError(null);
    setResult(null);
    if (!privateKey.trim()) {
      setError("Generate or paste a secret key first (Keys tab).");
      return;
    }
    if (!isHexKey(privateKey)) {
      setError(
        "Secret key must be hex from Generate keypair — not the JWT or a base64url signature. Copy the secret key field from the Keys tab."
      );
      return;
    }
    let customClaims: Record<string, unknown> | undefined;
    if (claimsJson.trim()) {
      try {
        customClaims = JSON.parse(claimsJson) as Record<string, unknown>;
      } catch {
        setError("Custom claims must be valid JSON.");
        return;
      }
    }
    const expSec = parseInt(expiresIn, 10);
    if (Number.isNaN(expSec) || expSec <= 0) {
      setError("Expiration must be a positive number of seconds.");
      return;
    }

    setBusy(true);
    try {
      const { jwt } = signToken(algo, privateKey, issuer, expSec, customClaims);
      setResult(jwt);
      onSigned(jwt);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel">
      <h2>Sign a PQ-JWT</h2>
      <p className="hint">
        Same API as classic JWT libraries — <code>sign(payload, secretKey, options)</code> via{" "}
        @pq-jwt/core.
      </p>

      <div className="field-row">
        <div className="field">
          <label htmlFor="sign-algo">Algorithm</label>
          <select
            id="sign-algo"
            value={algo}
            onChange={(e) => setAlgo(e.target.value as Algorithm)}
          >
            {ML_DSA_ALGORITHMS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="issuer">Issuer (iss)</label>
          <input id="issuer" value={issuer} onChange={(e) => setIssuer(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="expires">Expires in (seconds)</label>
          <input id="expires" type="number" value={expiresIn} onChange={(e) => setExpiresIn(e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="claims">Custom claims (JSON)</label>
        <textarea id="claims" value={claimsJson} onChange={(e) => setClaimsJson(e.target.value)} rows={5} />
      </div>

      <div className="btn-row">
        <button type="button" className="btn btn-primary" disabled={busy} onClick={handleSign}>
          {busy ? "Signing…" : `Sign with ${algoLabel(algo)}`}
        </button>
      </div>

      {error && <div className="status err">{error}</div>}
      {result && (
        <div className="field" style={{ marginTop: "1rem" }}>
          <FieldLabelRow copy={{ text: result, label: "signed JWT" }}>
            Signed JWT
          </FieldLabelRow>
          <textarea readOnly value={result} rows={6} spellCheck={false} />
          <div className="status ok">Token signed successfully. See Decode tab or Size Compare.</div>
        </div>
      )}
    </section>
  );
}
