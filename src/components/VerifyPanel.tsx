import { useState, useEffect } from "react";
import { verifyToken, peekToken } from "../lib/pq-crypto";
import { formatJson, isHexKey, isLikelyJwt } from "../lib/jwt-utils";

interface Props {
  token: string;
  publicKey: string;
}

export default function VerifyPanel({ token, publicKey }: Props) {
  const [issuer, setIssuer] = useState("");
  const [audience, setAudience] = useState("");
  const [jwtInput, setJwtInput] = useState(token);
  const [pubKeyInput, setPubKeyInput] = useState(publicKey);
  const [payload, setPayload] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setJwtInput(token);
    if (token.trim() && isLikelyJwt(token)) {
      try {
        const { payload: p } = peekToken(token);
        if (typeof p.iss === "string") setIssuer(p.iss);
        if (typeof p.aud === "string") setAudience(p.aud);
      } catch {
        /* ignore peek errors while typing */
      }
    }
  }, [token]);

  useEffect(() => {
    setPubKeyInput(publicKey);
  }, [publicKey]);

  function handleJwtChange(value: string) {
    setJwtInput(value);
    if (value.trim() && isLikelyJwt(value)) {
      try {
        const { payload: p } = peekToken(value);
        if (typeof p.iss === "string") setIssuer(p.iss);
        if (typeof p.aud === "string") setAudience(p.aud);
      } catch {
        /* ignore */
      }
    }
  }

  function handleVerify() {
    setError(null);
    setPayload(null);
    const jwt = jwtInput.trim();
    const pub = pubKeyInput.trim();

    if (!jwt || !pub) {
      setError("JWT and public key are required.");
      return;
    }
    if (!isLikelyJwt(jwt)) {
      setError(
        "Paste the complete JWT (three dot-separated parts starting with eyJ…). You may have pasted only part of the signature."
      );
      return;
    }
    if (!isHexKey(pub)) {
      setError(
        "Public key must be hex from the Keys tab (generate keypair → copy public key). Do not paste the JWT or signature here."
      );
      return;
    }

    setBusy(true);
    try {
      const claims = verifyToken(jwt, pub, {
        issuer: issuer.trim() || undefined,
        audience: audience.trim() || undefined,
      });
      setPayload(formatJson(claims));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel">
      <h2>Verify PQ-JWT</h2>
      <p className="hint">
        Paste the full token and the matching <strong>hex public key</strong> from whoever signed it.
        Issuer and audience are auto-filled from the token when possible.
      </p>

      <div className="field">
        <label htmlFor="verify-jwt">JWT</label>
        <textarea
          id="verify-jwt"
          value={jwtInput}
          onChange={(e) => handleJwtChange(e.target.value)}
          rows={4}
          spellCheck={false}
        />
      </div>

      <div className="field">
        <label htmlFor="verify-pubkey">Public key (hex)</label>
        <textarea
          id="verify-pubkey"
          value={pubKeyInput}
          onChange={(e) => setPubKeyInput(e.target.value)}
          rows={3}
          spellCheck={false}
          placeholder="3904 hex characters for ML-DSA-65 (from Keys tab or your server .env PQ_PUBLIC_KEY)"
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="verify-iss">Expected issuer (iss)</label>
          <input
            id="verify-iss"
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            placeholder="e.g. pq-jwttest"
          />
        </div>
        <div className="field">
          <label htmlFor="verify-aud">Expected audience (aud)</label>
          <input
            id="verify-aud"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="optional"
          />
        </div>
      </div>

      <div className="btn-row">
        <button type="button" className="btn btn-primary" disabled={busy} onClick={handleVerify}>
          {busy ? "Verifying…" : "Verify signature"}
        </button>
      </div>

      {error && <div className="status err">{error}</div>}
      {payload && (
        <>
          <div className="status ok">Signature valid — claims verified.</div>
          <div className="field" style={{ marginTop: "1rem" }}>
            <label>Verified payload</label>
            <pre className="json-block payload">{payload}</pre>
          </div>
        </>
      )}
    </section>
  );
}
