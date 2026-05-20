import { useState } from "react";
import {
  SignJWT,
  jwtVerify,
  decodeJwt,
  decodeProtectedHeader,
  generateKeyPair,
  exportKey,
  EncryptJWT,
  jwtDecrypt,
} from "@pq-jose/jose";
import { formatJson, normalizeHexKey } from "../lib/jwt-utils";
import { DEFAULT_ISSUER } from "../lib/ecosystem-links";
import FieldLabelRow from "./FieldLabelRow";

const SIGNING_ALGS = ["ML-DSA-44", "ML-DSA-65", "ML-DSA-87", "SLH-DSA-SHA2-128s"] as const;
const KEM_ALGS = ["ML-KEM-512", "ML-KEM-768", "ML-KEM-1024"] as const;

export default function PQJosePanel() {
  const [signAlg, setSignAlg] = useState<(typeof SIGNING_ALGS)[number]>("ML-DSA-65");
  const [kemAlg, setKemAlg] = useState<(typeof KEM_ALGS)[number]>("ML-KEM-768");
  const [pubHex, setPubHex] = useState("");
  const [privHex, setPrivHex] = useState("");
  const [kemPubHex, setKemPubHex] = useState("");
  const [jwkJson, setJwkJson] = useState("");
  const [issuer, setIssuer] = useState(DEFAULT_ISSUER);
  const [claimsJson, setClaimsJson] = useState('{\n  "sub": "user@example.com"\n}');
  const [signedJwt, setSignedJwt] = useState("");
  const [verifyInput, setVerifyInput] = useState("");
  const [verifyPub, setVerifyPub] = useState("");
  const [decodeInput, setDecodeInput] = useState("");
  const [jweToken, setJweToken] = useState("");
  const [jweDecryptKey, setJweDecryptKey] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function handleGenerateSigningKeys() {
    setError(null);
    setResult(null);
    setBusy(true);
    try {
      const kp = generateKeyPair(signAlg);
      setPubHex(exportKey(kp.publicKey));
      setPrivHex(exportKey(kp.secretKey));
      setJwkJson(formatJson(kp.jwk));
      setVerifyPub(exportKey(kp.publicKey));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  function handleGenerateKemKeys() {
    setError(null);
    setResult(null);
    setBusy(true);
    try {
      const kp = generateKeyPair(kemAlg);
      setKemPubHex(exportKey(kp.publicKey));
      setJweDecryptKey(exportKey(kp.secretKey));
      setResult(`Generated ${kemAlg} key pair for JWE.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  function handleSignJose() {
    setError(null);
    setResult(null);
    if (!privHex.trim()) {
      setError("Generate signing keys first.");
      return;
    }
    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(claimsJson) as Record<string, unknown>;
    } catch {
      setError("Claims must be valid JSON.");
      return;
    }
    setBusy(true);
    try {
      const jwt = new SignJWT(payload)
        .setAlgorithm(signAlg)
        .setIssuer(issuer)
        .setExpirationTime("1h")
        .sign(normalizeHexKey(privHex));
      setSignedJwt(jwt);
      setVerifyInput(jwt);
      setDecodeInput(jwt);
      setResult("Signed with @pq-jose/jose SignJWT (wraps @pq-jwt/core).");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  function handleVerifyJose() {
    setError(null);
    setResult(null);
    if (!verifyInput.trim() || !verifyPub.trim()) {
      setError("JWT and public key hex required.");
      return;
    }
    setBusy(true);
    try {
      const { payload, protectedHeader } = jwtVerify(verifyInput.trim(), normalizeHexKey(verifyPub), {
        issuer: issuer.trim() || undefined,
      });
      setResult(formatJson({ protectedHeader, payload }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  function handleDecodeJose() {
    setError(null);
    setResult(null);
    if (!decodeInput.trim()) {
      setError("Paste a JWT.");
      return;
    }
    try {
      const header = decodeProtectedHeader(decodeInput.trim());
      const payload = decodeJwt(decodeInput.trim());
      setResult(formatJson({ header, payload }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  function handleEncryptJwe() {
    setError(null);
    setResult(null);
    if (!kemPubHex.trim()) {
      setError("Generate ML-KEM keys first.");
      return;
    }
    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(claimsJson) as Record<string, unknown>;
    } catch {
      setError("Claims must be valid JSON.");
      return;
    }
    setBusy(true);
    try {
      const jwe = new EncryptJWT(payload)
        .setAlgorithm(kemAlg)
        .setEncryption("A256GCM")
        .setIssuer(issuer)
        .setExpirationTime("1h")
        .encrypt(normalizeHexKey(kemPubHex));
      setJweToken(jwe);
      setResult("JWE created (ML-KEM + AES-256-GCM via Node crypto polyfill).");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  function handleDecryptJwe() {
    setError(null);
    setResult(null);
    if (!jweToken.trim() || !jweDecryptKey.trim()) {
      setError("JWE and recipient secret key (hex) required.");
      return;
    }
    setBusy(true);
    try {
      const { payload, protectedHeader } = jwtDecrypt(jweToken.trim(), normalizeHexKey(jweDecryptKey), {
        issuer: issuer.trim() || undefined,
      });
      setResult(formatJson({ protectedHeader, payload }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel">
      <h2>PQ-JOSE — @pq-jose/jose</h2>
      <p className="hint">
        jose-style API on top of <code>@pq-jwt/core</code>: <code>SignJWT</code>, <code>jwtVerify</code>,{" "}
        <code>decodeJwt</code>, JWK export, and JWE (ML-KEM + AES-GCM). Vite bundles a{" "}
        <code>crypto</code> polyfill for browser JWE.
      </p>

      <h3 style={{ marginTop: "1rem", fontSize: "1rem" }}>Signing (ML-DSA)</h3>
      <div className="field-row">
        <div className="field">
          <label htmlFor="jose-sign-alg">Algorithm</label>
          <select id="jose-sign-alg" value={signAlg} onChange={(e) => setSignAlg(e.target.value as typeof signAlg)}>
            {SIGNING_ALGS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="jose-iss">Issuer</label>
          <input id="jose-iss" value={issuer} onChange={(e) => setIssuer(e.target.value)} />
        </div>
      </div>
      <div className="btn-row">
        <button type="button" className="btn btn-primary" disabled={busy} onClick={handleGenerateSigningKeys}>
          Generate signing keypair + JWK
        </button>
      </div>
      {jwkJson && (
        <div className="field" style={{ marginTop: "1rem" }}>
          <FieldLabelRow copy={{ text: jwkJson, label: "JWK" }}>
            AKP JWK (public)
          </FieldLabelRow>
          <pre className="json-block header">{jwkJson}</pre>
        </div>
      )}
      {pubHex && (
        <div className="field">
          <FieldLabelRow copy={{ text: pubHex, label: "public key" }}>
            Public key (hex)
          </FieldLabelRow>
          <div className="key-display">{pubHex}</div>
        </div>
      )}
      {privHex && (
        <div className="field">
          <FieldLabelRow copy={{ text: privHex, label: "secret key" }}>
            Secret key (hex)
          </FieldLabelRow>
          <div className="key-display">{privHex}</div>
        </div>
      )}
      <div className="field">
        <label htmlFor="jose-claims">Claims (JSON)</label>
        <textarea id="jose-claims" value={claimsJson} onChange={(e) => setClaimsJson(e.target.value)} rows={3} />
      </div>
      <div className="btn-row">
        <button type="button" className="btn btn-primary" disabled={busy} onClick={handleSignJose}>
          SignJWT
        </button>
      </div>
      {signedJwt && (
        <div className="field">
          <FieldLabelRow copy={{ text: signedJwt, label: "signed JWT" }}>
            Signed JWT
          </FieldLabelRow>
          <textarea readOnly value={signedJwt} rows={3} spellCheck={false} />
        </div>
      )}

      <h3 style={{ marginTop: "1.5rem", fontSize: "1rem" }}>jwtVerify</h3>
      <div className="field">
        <FieldLabelRow htmlFor="jose-verify-jwt" copy={{ text: verifyInput, label: "JWT" }}>
          JWT
        </FieldLabelRow>
        <textarea id="jose-verify-jwt" value={verifyInput} onChange={(e) => setVerifyInput(e.target.value)} rows={2} />
      </div>
      <div className="field">
        <FieldLabelRow htmlFor="jose-verify-pk" copy={{ text: verifyPub, label: "public key" }}>
          Public key (hex)
        </FieldLabelRow>
        <textarea id="jose-verify-pk" value={verifyPub} onChange={(e) => setVerifyPub(e.target.value)} rows={2} />
      </div>
      <div className="btn-row">
        <button type="button" className="btn btn-primary" disabled={busy} onClick={handleVerifyJose}>
          jwtVerify
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleDecodeJose}>
          decodeJwt + header
        </button>
      </div>

      <h3 style={{ marginTop: "1.5rem", fontSize: "1rem" }}>JWE (ML-KEM)</h3>
      <div className="field">
        <label htmlFor="jose-kem-alg">KEM algorithm</label>
        <select id="jose-kem-alg" value={kemAlg} onChange={(e) => setKemAlg(e.target.value as typeof kemAlg)}>
          {KEM_ALGS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>
      <div className="btn-row">
        <button type="button" className="btn btn-secondary" disabled={busy} onClick={handleGenerateKemKeys}>
          Generate ML-KEM keypair
        </button>
        <button type="button" className="btn btn-primary" disabled={busy} onClick={handleEncryptJwe}>
          EncryptJWT
        </button>
      </div>
      {kemPubHex && (
        <p className="hint" style={{ marginTop: "0.5rem" }}>
          KEM public hex length: {kemPubHex.length} chars
        </p>
      )}
      {jweToken && (
        <div className="field">
          <FieldLabelRow copy={{ text: jweToken, label: "JWE token" }}>
            JWE (5 segments)
          </FieldLabelRow>
          <textarea readOnly value={jweToken} rows={2} spellCheck={false} />
        </div>
      )}
      <div className="field">
        <FieldLabelRow htmlFor="jose-jwe-sk" copy={{ text: jweDecryptKey, label: "recipient secret key" }}>
          Recipient secret (hex) for decrypt
        </FieldLabelRow>
        <textarea
          id="jose-jwe-sk"
          value={jweDecryptKey}
          onChange={(e) => setJweDecryptKey(e.target.value)}
          rows={2}
          spellCheck={false}
        />
      </div>
      <div className="btn-row">
        <button type="button" className="btn btn-primary" disabled={busy} onClick={handleDecryptJwe}>
          jwtDecrypt
        </button>
      </div>

      {error && <div className="status err" style={{ marginTop: "1rem" }}>{error}</div>}
      {result && !error && (
        <div className="field" style={{ marginTop: "1rem" }}>
          <FieldLabelRow copy={{ text: result, label: "result" }}>
            Result
          </FieldLabelRow>
          <pre className="json-block payload">{result}</pre>
        </div>
      )}
    </section>
  );
}
