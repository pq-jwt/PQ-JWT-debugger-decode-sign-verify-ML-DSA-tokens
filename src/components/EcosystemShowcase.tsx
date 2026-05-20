import {
  GITHUB_ORG,
  NPM_CORE,
  NPM_EXPRESS,
  NPM_HYBRID,
  NPM_ORG_PQ_JOSE,
  NPM_ORG_PQ_JWT,
  NPM_PQ_JOSE,
  NOBLE_CURVES,
  NOBLE_HASHES,
  NOBLE_POST_QUANTUM,
  PQ_JWT_WEBSITE,
} from "../lib/ecosystem-links";

const ECOSYSTEM_PACKAGES = [
  {
    name: "@pq-jwt/core",
    href: NPM_CORE,
    role: "Core · JWT",
    desc: "Post-quantum JWT sign, verify, and decode. ML-DSA & SLH-DSA (FIPS 204 / 205). Default in this debugger.",
    inApp: "Decode, Keys, Sign, Verify, Size compare",
  },
  {
    name: "@pq-jwt/express",
    href: NPM_EXPRESS,
    role: "Backend · Express",
    desc: "Drop-in pqAuth() middleware — typed errors, role guards, custom extractors for Node APIs.",
    inApp: "Express tab (sample)",
  },
  {
    name: "@pq-jwt/hybrid",
    href: NPM_HYBRID,
    role: "Migration · Hybrid",
    desc: "ECDSA P-256 + ML-DSA dual signing. Bridge classical and post-quantum during rollout.",
    inApp: "Hybrid tab",
  },
  {
    name: "@pq-jose/jose",
    href: NPM_PQ_JOSE,
    role: "JOSE · JWE · JWK",
    desc: "Full post-quantum JOSE stack — JWT, JWS, JWE, JWK, JWKS. ML-KEM (FIPS 203) + ML-DSA via @pq-jwt/core.",
    inApp: "PQ-JOSE tab",
  },
] as const;

const NOBLE_DEPS = [
  {
    name: "@noble/post-quantum",
    href: NOBLE_POST_QUANTUM,
    desc: "ML-DSA, SLH-DSA, ML-KEM — NIST FIPS 203–205 primitives",
  },
  {
    name: "@noble/hashes",
    href: NOBLE_HASHES,
    desc: "SHA-2, SHA-3, BLAKE — audited hash layer for SLH-DSA & JOSE",
  },
  {
    name: "@noble/curves",
    href: NOBLE_CURVES,
    desc: "P-256 & classical curves — used by @pq-jwt/hybrid migration path",
  },
] as const;

const BROKEN_ALGOS = [
  {
    title: "RS256 / RSA",
    body: "Security basis: integer factorization (N = p × q). Shor's algorithm factors N in O(log³N) quantum operations — private key recovery in polynomial time.",
  },
  {
    title: "ES256 / ECDSA",
    body: "Security basis: elliptic curve discrete logarithm. Shor's algorithm solves ECDLP in polynomial time. P-256, secp256k1, and other EC curves are affected.",
  },
] as const;

const PQ_ALGOS = [
  {
    title: "ML-DSA (FIPS 204)",
    body: "Security basis: Module-LWE lattice hardness. Shor's algorithm gives no speedup — not a group-period problem. Grover → √ speedup only (~96-bit quantum margin at ML-DSA-65).",
  },
  {
    title: "SLH-DSA (FIPS 205)",
    body: "Security basis: hash function hardness only. No lattice assumptions — conservative choice after years of NIST analysis. Ideal for long-lived archival tokens.",
  },
] as const;

const NIST_ALGORITHMS = [
  {
    id: "ML-DSA-44",
    fips: "NIST FIPS 204 · Lattice (Module-LWE)",
    desc: "Security level 2. Best for IoT and constrained environments where key size matters most.",
    recommended: false,
    stats: [
      { value: "128-bit Q", label: "Quantum security" },
      { value: "2.5ms", label: "Key generation" },
      { value: "1,312 B", label: "Public key" },
      { value: "8.1ms", label: "Sign time" },
    ],
  },
  {
    id: "ML-DSA-65",
    fips: "NIST FIPS 204 · Lattice (Module-LWE)",
    desc: "Security level 3. Best balance of performance and security. Default algorithm in @pq-jwt/core.",
    recommended: true,
    stats: [
      { value: "192-bit Q", label: "Quantum security" },
      { value: "3.9ms", label: "Key generation" },
      { value: "1,952 B", label: "Public key" },
      { value: "10.7ms", label: "Sign time" },
    ],
  },
  {
    id: "ML-DSA-87",
    fips: "NIST FIPS 204 · Lattice (Module-LWE)",
    desc: "Security level 5. Government, banking, and high-security systems. Meets NSA CNSA 2.0.",
    recommended: false,
    stats: [
      { value: "256-bit Q", label: "Quantum security" },
      { value: "4.8ms", label: "Key generation" },
      { value: "2,592 B", label: "Public key" },
      { value: "11.1ms", label: "Sign time" },
    ],
  },
  {
    id: "SLH-DSA-SHA2-128s",
    fips: "NIST FIPS 205 · Hash-based (SPHINCS+)",
    desc: "Conservative choice. No lattice assumptions — hash security only. For long-term archival tokens.",
    recommended: false,
    stats: [
      { value: "128-bit Q", label: "Quantum security" },
      { value: "623ms", label: "Key generation" },
      { value: "32 B", label: "Public key" },
      { value: "5,373ms", label: "Sign time" },
    ],
  },
] as const;

function StatGrid({ stats }: { stats: readonly { value: string; label: string }[] }) {
  return (
    <div className="eco-stat-grid">
      {stats.map((s) => (
        <div key={s.label} className="eco-stat">
          <span className="eco-stat-value">{s.value}</span>
          <span className="eco-stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function EcosystemShowcase() {
  return (
    <div className="eco-showcase" aria-label="PQ-JWT ecosystem overview">
      {/* 1 — Platform & npm */}
      <section className="eco-block">
        <p className="eco-kicker eco-kicker-teal">// PQ-JWT ECOSYSTEM · PLATFORM & LIBRARIES</p>
        <h2 className="eco-title">Post-quantum JWT platform on npm</h2>
        <p className="eco-lead">
          Four published packages under{" "}
          <a href={NPM_ORG_PQ_JWT} target="_blank" rel="noreferrer">
            @pq-jwt
          </a>{" "}
          and{" "}
          <a href={NPM_ORG_PQ_JOSE} target="_blank" rel="noreferrer">
            @pq-jose
          </a>
          . This debugger runs them in your browser — no backend. Docs and guides:{" "}
          <a href={PQ_JWT_WEBSITE} target="_blank" rel="noreferrer">
            pq-jwt.github.io
          </a>
          .
        </p>

        <div className="eco-noble-row">
          <p className="eco-noble-heading">Audited cryptography stack</p>
          <p className="eco-noble-lead">
            PQ-JWT builds on Paul Miller&apos;s{" "}
            <a href={NOBLE_POST_QUANTUM} target="_blank" rel="noreferrer">
              @noble/post-quantum
            </a>
            ,{" "}
            <a href={NOBLE_HASHES} target="_blank" rel="noreferrer">
              @noble/hashes
            </a>
            , and{" "}
            <a href={NOBLE_CURVES} target="_blank" rel="noreferrer">
              @noble/curves
            </a>{" "}
            — independent, MIT-licensed primitives used across the JavaScript ecosystem.
          </p>
          <ul className="eco-noble-pills">
            {NOBLE_DEPS.map((d) => (
              <li key={d.name}>
                <a href={d.href} target="_blank" rel="noreferrer" className="eco-pill eco-pill-noble">
                  {d.name}
                </a>
                <span className="eco-pill-desc">{d.desc}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="eco-pkg-grid">
          {ECOSYSTEM_PACKAGES.map((pkg) => (
            <article key={pkg.name} className="eco-pkg-card">
              <span className="eco-pkg-role">{pkg.role}</span>
              <h3 className="eco-pkg-name">
                <a href={pkg.href} target="_blank" rel="noreferrer">
                  {pkg.name}
                </a>
              </h3>
              <p className="eco-pkg-desc">{pkg.desc}</p>
              <p className="eco-pkg-app">
                <span>In this debugger:</span> {pkg.inApp}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* 2 — The problem */}
      <section className="eco-block">
        <p className="eco-kicker eco-kicker-red">// THE PROBLEM</p>
        <h2 className="eco-title">Your JWTs will be forged by quantum computers</h2>
        <p className="eco-lead">
          RS256 relies on integer factorization. ES256 relies on elliptic curve discrete log. Shor&apos;s algorithm
          (1994) solves both in polynomial time on a cryptographically relevant quantum computer.
        </p>
        <div className="eco-algo-grid eco-algo-grid-4">
          {BROKEN_ALGOS.map((a) => (
            <article key={a.title} className="eco-algo-card eco-algo-card-broken">
              <span className="eco-algo-status eco-algo-status-broken">● Broken by quantum</span>
              <h3 className="eco-algo-name">{a.title}</h3>
              <p className="eco-algo-body">{a.body}</p>
              <span className="eco-algo-tag eco-algo-tag-broken">Shor&apos;s algorithm: APPLICABLE</span>
            </article>
          ))}
          {PQ_ALGOS.map((a) => (
            <article key={a.title} className="eco-algo-card eco-algo-card-safe">
              <span className="eco-algo-status eco-algo-status-safe">● Quantum resistant</span>
              <h3 className="eco-algo-name">{a.title}</h3>
              <p className="eco-algo-body">{a.body}</p>
              <span className="eco-algo-tag eco-algo-tag-safe">Shor&apos;s algorithm: NOT APPLICABLE</span>
            </article>
          ))}
        </div>
      </section>

      {/* 3 — NIST four algorithms */}
      <section className="eco-block">
        <p className="eco-kicker eco-kicker-teal">// NIST STANDARDIZED · AUGUST 2024</p>
        <h2 className="eco-title">Four algorithms. All NIST approved.</h2>
        <p className="eco-lead">
          After a 7-year open competition, NIST selected and standardized these algorithms in August 2024. The NSA
          mandates them for national security systems by 2030.{" "}
          <a href={NPM_CORE} target="_blank" rel="noreferrer">
            @pq-jwt/core
          </a>{" "}
          exposes all four for signing and verification in JavaScript and TypeScript.
        </p>
        <div className="eco-algo-grid eco-algo-grid-4">
          {NIST_ALGORITHMS.map((algo) => (
            <article
              key={algo.id}
              className={`eco-nist-card${algo.recommended ? " eco-nist-card-rec" : ""}`}
            >
              <div className="eco-nist-head">
                <h3 className="eco-nist-id">{algo.id}</h3>
                {algo.recommended && <span className="eco-rec-badge">Recommended</span>}
              </div>
              <p className="eco-nist-fips">{algo.fips}</p>
              <p className="eco-nist-desc">{algo.desc}</p>
              <StatGrid stats={algo.stats} />
            </article>
          ))}
        </div>
        <p className="eco-footnote">
          Benchmarks are representative Node.js v22 figures from{" "}
          <a href={PQ_JWT_WEBSITE} target="_blank" rel="noreferrer">
            pq-jwt.github.io
          </a>
          . PQ-JOSE adds ML-KEM (FIPS 203) for JWE on the{" "}
          <a href={NPM_PQ_JOSE} target="_blank" rel="noreferrer">
            @pq-jose/jose
          </a>{" "}
          tab. Source:{" "}
          <a href={GITHUB_ORG} target="_blank" rel="noreferrer">
            github.com/pq-jwt
          </a>
          .
        </p>
      </section>
    </div>
  );
}
