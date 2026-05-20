import { useState, useCallback, lazy, Suspense } from "react";
import TokenDecoder from "./components/TokenDecoder";
import KeyGenPanel from "./components/KeyGenPanel";
import SignPanel from "./components/SignPanel";
import VerifyPanel from "./components/VerifyPanel";
import SizeComparePanel from "./components/SizeComparePanel";
import ExpressEcosystemPanel from "./components/ExpressEcosystemPanel";

const HybridPanel = lazy(() => import("./components/HybridPanel"));
const PQJosePanel = lazy(() => import("./components/PQJosePanel"));

type Tab =
  | "decode"
  | "keys"
  | "sign"
  | "verify"
  | "compare"
  | "hybrid"
  | "jose"
  | "express";

const TABS: { id: Tab; label: string }[] = [
  { id: "decode", label: "Decode" },
  { id: "keys", label: "Keys" },
  { id: "sign", label: "Sign" },
  { id: "verify", label: "Verify" },
  { id: "compare", label: "Size compare" },
  { id: "hybrid", label: "Hybrid" },
  { id: "jose", label: "PQ-JOSE" },
  { id: "express", label: "Express" },
];

export default function App() {
  const [tab, setTab] = useState<Tab>("decode");
  const [token, setToken] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");

  const handleKeys = useCallback((keys: { privateKey: string; publicKey: string }) => {
    setPrivateKey(keys.privateKey);
    setPublicKey(keys.publicKey);
  }, []);

  const handleSigned = useCallback((jwt: string) => {
    setToken(jwt);
  }, []);

  return (
    <div className="app">
      <header className="site-header">
        <h1>
          PQ<span>-JWT</span> Debugger
        </h1>
        <p className="tagline">
          Full PQ-JWT ecosystem in the browser — core, hybrid composite JWTs, PQ-JOSE (JWK / JWE), plus
          Express patterns for Node APIs.
        </p>
        <div className="badge-row">
          <span className="badge pq">ML-DSA / FIPS 204</span>
          <span className="badge">No backend</span>
          <span className="badge pq-eco">@pq-jwt/core</span>
          <span className="badge">@pq-jwt/hybrid</span>
          <span className="badge">@pq-jose/jose</span>
        </div>
      </header>

      <nav className="tabs" aria-label="Debugger sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`tab${tab === t.id ? " active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "decode" && (
        <section className="panel">
          <h2>Encoded token</h2>
          <p className="hint">
            Paste a PQ-JWT below. Header and payload decode locally; signature is shown by size only
            until you verify on the Verify tab.
          </p>
          <div className="field">
            <label htmlFor="encoded-jwt">PQ-JWT</label>
            <textarea
              id="encoded-jwt"
              placeholder="eyJhbGciOiJNTC1EU0EtNjUiLCJ0eXAiOiJQUS1KV1QiLCJ2ZXIiOiIxIn0..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              rows={6}
              spellCheck={false}
            />
          </div>
          <TokenDecoder token={token} />
        </section>
      )}

      {tab === "keys" && <KeyGenPanel onKeysGenerated={handleKeys} />}

      {tab === "sign" && (
        <>
          {!privateKey && (
            <p className="hint" style={{ marginBottom: "0.75rem" }}>
              Tip: generate keys on the Keys tab first, or paste a secret key hex below.
            </p>
          )}
          <section className="panel">
            <h2>Secret key</h2>
            <div className="field">
              <label htmlFor="sign-privkey">Secret key (hex only — from Keys tab)</label>
              <textarea
                id="sign-privkey"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                rows={3}
                spellCheck={false}
              />
            </div>
          </section>
          <SignPanel privateKey={privateKey} onSigned={handleSigned} />
        </>
      )}

      {tab === "verify" && <VerifyPanel token={token} publicKey={publicKey} />}

      {tab === "compare" && <SizeComparePanel privateKey={privateKey} />}

      {tab === "hybrid" && (
        <Suspense fallback={<p className="hint">Loading @pq-jwt/hybrid…</p>}>
          <HybridPanel />
        </Suspense>
      )}

      {tab === "jose" && (
        <Suspense fallback={<p className="hint">Loading @pq-jose/jose…</p>}>
          <PQJosePanel />
        </Suspense>
      )}

      {tab === "express" && <ExpressEcosystemPanel />}

      <footer className="site-footer">
        <p>
          Ecosystem:{" "}
          <a href="https://www.npmjs.com/package/@pq-jwt/core" target="_blank" rel="noreferrer">
            @pq-jwt/core
          </a>
          {" · "}
          <a href="https://www.npmjs.com/package/@pq-jwt/hybrid" target="_blank" rel="noreferrer">
            @pq-jwt/hybrid
          </a>
          {" · "}
          <a href="https://www.npmjs.com/package/@pq-jose/jose" target="_blank" rel="noreferrer">
            @pq-jose/jose
          </a>
          {" · "}
          <a href="https://www.npmjs.com/package/@pq-jwt/express" target="_blank" rel="noreferrer">
            @pq-jwt/express
          </a>
          {" · "}
          <a href="https://github.com/pq-jwt/PQ-JWT" target="_blank" rel="noreferrer">
            GitHub
          </a>
          {" · Inspired by "}
          <a href="https://jwt.io" target="_blank" rel="noreferrer">
            jwt.io
          </a>
        </p>
      </footer>
    </div>
  );
}
