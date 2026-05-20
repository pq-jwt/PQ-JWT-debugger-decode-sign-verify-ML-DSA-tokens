import {
  GITHUB_ORG,
  NPM_ORG_PQ_JWT,
  PQ_JWT_WEBSITE,
} from "../lib/ecosystem-links";

export default function LibraryCta() {
  return (
    <section className="library-cta" aria-labelledby="library-cta-heading">
      <h2 id="library-cta-heading">Looking for a PQ-JWT library?</h2>
      <p>
        Explore the PQ-JWT ecosystem on{" "}
        <a href={NPM_ORG_PQ_JWT} target="_blank" rel="noreferrer">
          npm (@pq-jwt)
        </a>{" "}
        and{" "}
        <a href={GITHUB_ORG} target="_blank" rel="noreferrer">
          GitHub
        </a>{" "}
        — core ML-DSA tokens, hybrid composite signing, PQ-JOSE (JWK / JWE), and Express middleware for Node
        APIs. Docs and guides live at{" "}
        <a href={PQ_JWT_WEBSITE} target="_blank" rel="noreferrer">
          pq-jwt.github.io
        </a>
        .
      </p>
      <div className="library-cta-actions">
        <a className="library-cta-btn" href={GITHUB_ORG} target="_blank" rel="noreferrer">
          PQ-JWT on GitHub
          <span aria-hidden> →</span>
        </a>
        <a className="library-cta-link" href={NPM_ORG_PQ_JWT} target="_blank" rel="noreferrer">
          Browse @pq-jwt packages on npm
        </a>
      </div>
    </section>
  );
}
