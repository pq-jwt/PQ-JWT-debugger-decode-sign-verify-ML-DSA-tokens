import { useState } from "react";
import {
  generateCompositeKeyPair,
  exportCompositeKey,
  signComposite,
  verifyComposite,
  decode as decodeHybrid,
  SUPPORTED_ALGORITHMS,
} from "@pq-jwt/hybrid";
import { formatJson, normalizeHexKey } from "../lib/jwt-utils";
import { DEFAULT_ISSUER } from "../lib/ecosystem-links";
import FieldLabelRow from "./FieldLabelRow";

const DEFAULT_ALG = "ML-DSA-65-ES256";

export default function HybridPanel() {
  const [algorithm, setAlgorithm] = useState(DEFAULT_ALG);
  const [pubHex, setPubHex] = useState("");
  const [privHex, setPrivHex] = useState("");
  const [issuer, setIssuer] = useState(DEFAULT_ISSUER);
  const [expiresIn, setExpiresIn] = useState("3600");
  const [claimsJson, setClaimsJson] = useState('{\n  "sub": "user@example.com",\n  "role": "admin"\n}');
  const [token, setToken] = useState("");
  const [verifyTokenInput, setVerifyTokenInput] = useState("");
  const [verifyPubHex, setVerifyPubHex] = useState("");
  const [decodeInput, setDecodeInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function handleGenerateKeys() {
    setError(null);
    setResult(null);
    setBusy(true);
    try {
      const kp = generateCompositeKeyPair(algorithm);
      setPubHex(exportCompositeKey(kp.compositePublicKey));
      setPrivHex(exportCompositeKey(kp.compositePrivateKey));
      setResult(`Generated composite keypair for ${kp.algorithm}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  function handleSign() {
    setError(null);
    setResult(null);
    if (!privHex.trim()) {
      setError("Generate or paste a composite secret key (hex).");
      return;
    }
    let claims: Record<string, unknown>;
    try {
      claims = JSON.parse(claimsJson) as Record<string, unknown>;
    } catch {
      setError("Claims must be valid JSON.");
      return;
    }
    setBusy(true);
    try {
      const expNum = parseInt(expiresIn, 10);
      const jwt = signComposite(claims, normalizeHexKey(privHex), {
        algorithm,
        issuer,
        expiresIn: Number.isFinite(expNum) && expNum > 0 ? expNum : expiresIn,
      });
      setToken(jwt);
      setVerifyTokenInput(jwt);
      setVerifyPubHex(pubHex);
      setDecodeInput(jwt);
      setResult("Signed composite HYBRID-JWT (ML-DSA + classical).");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  function handleVerify() {
    setError(null);
    setResult(null);
    if (!verifyTokenInput.trim() || !verifyPubHex.trim()) {
      setError("Token and composite public key (hex) are required.");
      return;
    }
    setBusy(true);
    try {
      const { payload, header } = verifyComposite(
        verifyTokenInput.trim(),
        normalizeHexKey(verifyPubHex),
        { issuer: issuer.trim() || undefined }
      );
      setResult(formatJson({ header, payload }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  function handleDecode() {
    setError(null);
    setResult(null);
    if (!decodeInput.trim()) {
      setError("Paste a composite token to decode (no verification).");
      return;
    }
    try {
      const { header, payload } = decodeHybrid(decodeInput.trim());
      setResult(formatJson({ header, payload }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <section className="panel">
      <h2>Hybrid — @pq-jwt/hybrid</h2>
      <p className="hint">
        Composite signatures (ML-DSA + ECDSA P-256 or Ed25519) per the PQ-JWT Hybrid package. Uses the same{" "}
        <code>Buffer</code> polyfill as core. Algorithm names like <code>ML-DSA-65-ES256</code>.
      </p>

      <div className="field">
        <label htmlFor="hybrid-alg">Composite algorithm</label>
        <select id="hybrid-alg" value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
          {SUPPORTED_ALGORITHMS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="btn-row">
        <button type="button" className="btn btn-primary" disabled={busy} onClick={handleGenerateKeys}>
          Generate composite keypair
        </button>
      </div>

      {pubHex && (
        <div className="field" style={{ marginTop: "1rem" }}>
          <FieldLabelRow copy={{ text: pubHex, label: "composite public key" }}>
            Composite public key (hex)
          </FieldLabelRow>
          <div className="key-display">{pubHex}</div>
        </div>
      )}
      {privHex && (
        <div className="field">
          <FieldLabelRow copy={{ text: privHex, label: "composite secret key" }}>
            Composite secret key (hex)
          </FieldLabelRow>
          <div className="key-display">{privHex}</div>
        </div>
      )}

      <h3 style={{ marginTop: "1.5rem", fontSize: "1rem" }}>Sign</h3>
      <div className="field-row">
        <div className="field">
          <label htmlFor="hybrid-iss">Issuer</label>
          <input id="hybrid-iss" value={issuer} onChange={(e) => setIssuer(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="hybrid-exp">Expires in (seconds)</label>
          <input
            id="hybrid-exp"
            type="number"
            value={expiresIn}
            onChange={(e) => setExpiresIn(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="hybrid-claims">Claims (JSON)</label>
        <textarea id="hybrid-claims" value={claimsJson} onChange={(e) => setClaimsJson(e.target.value)} rows={4} />
      </div>
      <div className="btn-row">
        <button type="button" className="btn btn-primary" disabled={busy} onClick={handleSign}>
          Sign composite JWT
        </button>
      </div>
      {token && (
        <div className="field" style={{ marginTop: "1rem" }}>
          <FieldLabelRow copy={{ text: token, label: "composite JWT" }}>
            Token
          </FieldLabelRow>
          <textarea readOnly value={token} rows={4} spellCheck={false} />
        </div>
      )}

      <h3 style={{ marginTop: "1.5rem", fontSize: "1rem" }}>Verify</h3>
      <div className="field">
        <FieldLabelRow htmlFor="hybrid-verify-jwt" copy={{ text: verifyTokenInput, label: "JWT" }}>
          JWT
        </FieldLabelRow>
        <textarea
          id="hybrid-verify-jwt"
          value={verifyTokenInput}
          onChange={(e) => setVerifyTokenInput(e.target.value)}
          rows={3}
          spellCheck={false}
        />
      </div>
      <div className="field">
        <FieldLabelRow htmlFor="hybrid-verify-pk" copy={{ text: verifyPubHex, label: "public key" }}>
          Composite public key (hex)
        </FieldLabelRow>
        <textarea
          id="hybrid-verify-pk"
          value={verifyPubHex}
          onChange={(e) => setVerifyPubHex(e.target.value)}
          rows={2}
          spellCheck={false}
        />
      </div>
      <div className="btn-row">
        <button type="button" className="btn btn-primary" disabled={busy} onClick={handleVerify}>
          Verify composite
        </button>
      </div>

      <h3 style={{ marginTop: "1.5rem", fontSize: "1rem" }}>Decode (no verify)</h3>
      <div className="field">
        <FieldLabelRow htmlFor="hybrid-decode" copy={{ text: decodeInput, label: "JWT" }}>
          JWT
        </FieldLabelRow>
        <textarea
          id="hybrid-decode"
          value={decodeInput}
          onChange={(e) => setDecodeInput(e.target.value)}
          rows={2}
          spellCheck={false}
        />
      </div>
      <div className="btn-row">
        <button type="button" className="btn btn-secondary" onClick={handleDecode}>
          Decode header + payload
        </button>
      </div>

      {error && <div className="status err" style={{ marginTop: "1rem" }}>{error}</div>}
      {result && !error && (
        <div className="field" style={{ marginTop: "1rem" }}>
          <FieldLabelRow copy={{ text: result, label: "decode result" }}>
            Decode result
          </FieldLabelRow>
          <pre className="json-block payload">{result}</pre>
        </div>
      )}
    </section>
  );
}
