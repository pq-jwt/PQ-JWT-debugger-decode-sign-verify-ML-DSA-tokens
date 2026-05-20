import { useState, useCallback, lazy, Suspense } from "react";
import TokenDecoder from "./components/TokenDecoder";
import KeyGenPanel from "./components/KeyGenPanel";
import SignPanel from "./components/SignPanel";
import VerifyPanel from "./components/VerifyPanel";
import SizeComparePanel from "./components/SizeComparePanel";
import ExpressEcosystemPanel from "./components/ExpressEcosystemPanel";
import JwtEncodedField from "./components/JwtEncodedField";
import FieldLabelRow from "./components/FieldLabelRow";
import ThemeSwitcher from "./components/ThemeSwitcher";
import LibraryCta from "./components/LibraryCta";
import EcosystemShowcase from "./components/EcosystemShowcase";
import { useTheme } from "./hooks/useTheme";
import {
  GITHUB_DEBUGGER_ISSUES,
  GITHUB_DEBUGGER_NEW_ISSUE,
  GITHUB_ORG,
  NPM_CORE,
  NPM_EXPRESS,
  NPM_HYBRID,
  NPM_ORG_PQ_JOSE,
  NPM_ORG_PQ_JWT,
  NPM_PQ_JOSE,
  PQ_JWT_WEBSITE,
} from "./lib/ecosystem-links";

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
  const { appearance, setAppearance, darkPalette, setDarkPalette, resolvedTheme } = useTheme();
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
        <div className="site-header-row">
          <div className="site-header-inner">
            <h1>
              PQ<span>-JWT</span> Debugger
            </h1>
            <p className="tagline">
              Full PQ-JWT ecosystem in the browser — core, hybrid composite JWTs, PQ-JOSE (JWK / JWE), plus
              Express patterns for Node APIs.
            </p>
            <div className="badge-row">
              <a className="badge pq" href={PQ_JWT_WEBSITE} target="_blank" rel="noreferrer">
                ML-DSA / FIPS 204
              </a>
              <span className="badge">No backend</span>
              <a className="badge pq-eco" href={NPM_CORE} target="_blank" rel="noreferrer">
                @pq-jwt/core
              </a>
              <a className="badge" href={NPM_HYBRID} target="_blank" rel="noreferrer">
                @pq-jwt/hybrid
              </a>
              <a className="badge" href={NPM_PQ_JOSE} target="_blank" rel="noreferrer">
                @pq-jose/jose
              </a>
            </div>
          </div>
          <ThemeSwitcher
            appearance={appearance}
            darkPalette={darkPalette}
            resolvedTheme={resolvedTheme}
            onAppearanceChange={setAppearance}
            onDarkPaletteChange={setDarkPalette}
          />
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
        <section className="panel panel-decode">
          <h2>Encoded token</h2>
          <p className="hint">
            Paste a PQ-JWT below. Header and payload decode locally; signature is shown by size only until you
            verify on the Verify tab.
          </p>
          <div className="field">
            <label htmlFor="encoded-jwt">PQ-JWT</label>
            <JwtEncodedField
              id="encoded-jwt"
              placeholder="eyJhbGciOiJNTC1EU0EtNjUiLCJ0eXAiOiJQUS1KV1QiLCJ2ZXIiOiIxIn0..."
              value={token}
              onChange={setToken}
              rows={10}
              showColoredPreview
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
              <FieldLabelRow htmlFor="sign-privkey" copy={{ text: privateKey, label: "secret key" }}>
                Secret key (hex only — from Keys tab)
              </FieldLabelRow>
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

      <EcosystemShowcase />

      <LibraryCta />

      <footer className="site-footer">
        <p className="footer-feedback">
          <a href={GITHUB_DEBUGGER_ISSUES} target="_blank" rel="noreferrer">
            Share feedback
          </a>
          <span className="footer-sep">|</span>
          <a href={GITHUB_DEBUGGER_NEW_ISSUE} target="_blank" rel="noreferrer">
            Report issue
          </a>
        </p>
        <p>
          <a href={PQ_JWT_WEBSITE} target="_blank" rel="noreferrer">
            pq-jwt.github.io
          </a>
          {" · "}
          <a href={NPM_ORG_PQ_JWT} target="_blank" rel="noreferrer">
            @pq-jwt on npm
          </a>
          {" · "}
          <a href={NPM_ORG_PQ_JOSE} target="_blank" rel="noreferrer">
            @pq-jose on npm
          </a>
          {" · "}
          <a href={NPM_CORE} target="_blank" rel="noreferrer">
            core
          </a>
          {" · "}
          <a href={NPM_HYBRID} target="_blank" rel="noreferrer">
            hybrid
          </a>
          {" · "}
          <a href={NPM_PQ_JOSE} target="_blank" rel="noreferrer">
            jose
          </a>
          {" · "}
          <a href={NPM_EXPRESS} target="_blank" rel="noreferrer">
            express
          </a>
          {" · "}
          <a href={GITHUB_ORG} target="_blank" rel="noreferrer">
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
