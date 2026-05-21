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
import TrustBar from "./components/TrustBar";
import TabNav, { type TabId } from "./components/TabNav";
import WorkflowBanner from "./components/WorkflowBanner";
import LibraryCta from "./components/LibraryCta";
import EcosystemShowcase from "./components/EcosystemShowcase";
import SiteFooter from "./components/SiteFooter";
import { useTheme } from "./hooks/useTheme";
import { PQ_JWT_WEBSITE } from "./lib/ecosystem-links";

const HybridPanel = lazy(() => import("./components/HybridPanel"));
const PQJosePanel = lazy(() => import("./components/PQJosePanel"));

export default function App() {
  const { appearance, setAppearance, darkPalette, setDarkPalette, resolvedTheme } = useTheme();
  const [tab, setTab] = useState<TabId>("decode");
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
              <span className="badge">Hybrid &amp; PQ-JOSE</span>
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

      <TrustBar />

      <TabNav active={tab} onChange={setTab} />

      {tab === "decode" && publicKey && token.trim() && (
        <WorkflowBanner
          message="Keys loaded — verify this token’s ML-DSA signature locally."
          actionLabel="Open Verify"
          onAction={() => setTab("verify")}
        />
      )}

      {tab === "keys" && privateKey && publicKey && (
        <WorkflowBanner
          variant="success"
          message="Key pair ready — sign a JWT or paste the public key on Verify."
          actionLabel="Open Sign"
          onAction={() => setTab("sign")}
        />
      )}

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

      <SiteFooter />
    </div>
  );
}
