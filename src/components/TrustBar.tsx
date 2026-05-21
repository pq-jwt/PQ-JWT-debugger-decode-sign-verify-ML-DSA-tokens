import {
  APP_VERSION,
  GITHUB_DEBUGGER_REPO,
  GITHUB_ORG,
  NIST_FIPS_204,
  NPM_ORG_PQ_JWT,
  PQ_JWT_WEBSITE,
} from "../lib/ecosystem-links";

export default function TrustBar() {
  return (
    <div className="trust-bar" role="complementary" aria-label="Trust and ecosystem">
      <div className="trust-bar-primary">
        <span className="trust-chip trust-chip-strong">
          Maintained by{" "}
          <a href={GITHUB_ORG} target="_blank" rel="noreferrer">
            PQ-JWT ecosystem
          </a>
        </span>
        <span className="trust-sep" aria-hidden>
          ·
        </span>
        <span className="trust-chip">
          <span className="trust-icon" aria-hidden>
            🔒
          </span>{" "}
          100% client-side
        </span>
        <span className="trust-sep" aria-hidden>
          ·
        </span>
        <a className="trust-chip trust-chip-link" href={NIST_FIPS_204} target="_blank" rel="noreferrer">
          NIST FIPS 204
        </a>
        <span className="trust-sep" aria-hidden>
          ·
        </span>
        <a
          className="trust-chip trust-chip-link"
          href={GITHUB_DEBUGGER_REPO}
          target="_blank"
          rel="noreferrer"
        >
          Open source (MIT)
        </a>
      </div>
      <div className="trust-bar-secondary">
        <a href={PQ_JWT_WEBSITE} target="_blank" rel="noreferrer">
          Docs
        </a>
        <span className="trust-sep" aria-hidden>
          ·
        </span>
        <a href={GITHUB_ORG} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <span className="trust-sep" aria-hidden>
          ·
        </span>
        <a href={NPM_ORG_PQ_JWT} target="_blank" rel="noreferrer">
          npm @pq-jwt
        </a>
        <span className="trust-sep" aria-hidden>
          ·
        </span>
        <span className="trust-version">v{APP_VERSION}</span>
      </div>
    </div>
  );
}
