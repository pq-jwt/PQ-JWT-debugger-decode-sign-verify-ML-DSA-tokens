import {
  APP_VERSION,
  AUTHOR_GITHUB,
  CONTACT_EMAIL,
  GITHUB_DEBUGGER_REPO,
  GITHUB_ORG,
  IETF_COSE_DILITHIUM,
  NIST_FIPS_204,
  NIST_FIPS_205,
  NPM_CORE,
  PQ_JWT_WEBSITE,
} from "../lib/ecosystem-links";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <nav className="footer-row footer-nav" aria-label="Site links">
        <a href={GITHUB_ORG} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href={NPM_CORE} target="_blank" rel="noreferrer">
          npm
        </a>
        <a href={PQ_JWT_WEBSITE} target="_blank" rel="noreferrer">
          Docs
        </a>
        <a href={CONTACT_EMAIL}>Contact</a>
      </nav>

      <nav className="footer-row footer-standards" aria-label="Standards references">
        <a href={NIST_FIPS_204} target="_blank" rel="noreferrer">
          NIST FIPS 204
        </a>
        <a href={NIST_FIPS_205} target="_blank" rel="noreferrer">
          NIST FIPS 205
        </a>
        <a href={IETF_COSE_DILITHIUM} target="_blank" rel="noreferrer">
          IETF Draft
        </a>
      </nav>

      <p className="footer-row footer-security">
        <span className="footer-lock" aria-hidden>
          🔒
        </span>{" "}
        No keys or tokens are sent to any server. All cryptographic operations run locally in your
        browser.{" "}
        <a href={GITHUB_DEBUGGER_REPO} target="_blank" rel="noreferrer">
          View source
        </a>
      </p>

      <p className="footer-row footer-attribution">
        Built by{" "}
        <a href={AUTHOR_GITHUB} target="_blank" rel="noreferrer">
          Sachin Ruhil
        </a>{" "}
        · MIT License · v{APP_VERSION}
      </p>
    </footer>
  );
}
