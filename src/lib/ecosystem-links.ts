/** Official PQ-JWT ecosystem URLs */
export const DEFAULT_ISSUER = "https://pq-jwt.github.io/";

export const GITHUB_ORG = "https://github.com/pq-jwt";
export const PQ_JWT_WEBSITE = "https://pq-jwt.github.io/";

export const NPM_ORG_PQ_JWT = "https://www.npmjs.com/org/pq-jwt";
export const NPM_ORG_PQ_JOSE = "https://www.npmjs.com/org/pq-jose";

export const NPM_CORE = "https://www.npmjs.com/package/@pq-jwt/core";
export const NPM_HYBRID = "https://www.npmjs.com/package/@pq-jwt/hybrid";
export const NPM_EXPRESS = "https://www.npmjs.com/package/@pq-jwt/express";
export const NPM_PQ_JOSE = "https://www.npmjs.com/package/@pq-jose/jose";

export const NOBLE_HASHES = "https://www.npmjs.com/package/@noble/hashes";
export const NOBLE_POST_QUANTUM = "https://www.npmjs.com/package/@noble/post-quantum";
export const NOBLE_CURVES = "https://www.npmjs.com/package/@noble/curves";

export const GITHUB_PQ_JWT = `${GITHUB_ORG}/PQ-JWT`;
export const GITHUB_DEBUGGER_REPO = `${GITHUB_ORG}/PQ-JWT-debugger-decode-sign-verify-ML-DSA-tokens`;
export const GITHUB_DEBUGGER_ISSUES = `${GITHUB_DEBUGGER_REPO}/issues`;
export const GITHUB_DEBUGGER_NEW_ISSUE = `${GITHUB_DEBUGGER_ISSUES}/new`;

export const EMAIL_GENERAL = "mailto:pq-jwt@pq-jwt.dev";
/** @deprecated Use EMAIL_GENERAL */
export const CONTACT_EMAIL = EMAIL_GENERAL;

export const EMAIL_SUPPORT = "mailto:support@pq-jwt.dev";
export const EMAIL_SECURITY = "mailto:security@pq-jwt.dev";
export const EMAIL_SPONSOR = "mailto:sponsor@pq-jwt.dev";
export const EMAIL_SACHIN = "mailto:sachin@pq-jwt.dev";

/** Buttondown publication slug — change if your list uses a different username */
export const BUTTONDOWN_USERNAME = "pq-jwt";
export const BUTTONDOWN_SUBSCRIBE_ACTION = `https://buttondown.email/api/emails/embed-subscribe/${BUTTONDOWN_USERNAME}`;

/** Matches Cloudflare Email Routing rules on pq-jwt.dev */
export const CONTACT_EMAILS = [
  { address: "pq-jwt@pq-jwt.dev", href: EMAIL_GENERAL, label: "General contact" },
  { address: "support@pq-jwt.dev", href: EMAIL_SUPPORT, label: "Technical support" },
  { address: "security@pq-jwt.dev", href: EMAIL_SECURITY, label: "Security reports" },
  { address: "sponsor@pq-jwt.dev", href: EMAIL_SPONSOR, label: "Sponsorship inquiries" },
  { address: "sachin@pq-jwt.dev", href: EMAIL_SACHIN, label: "Project lead" },
] as const;

export const AUTHOR_GITHUB = "https://github.com/ruhil6789";

export const NIST_FIPS_204 = "https://doi.org/10.6028/NIST.FIPS.204";
export const NIST_FIPS_205 = "https://doi.org/10.6028/NIST.FIPS.205";
export const IETF_COSE_DILITHIUM =
  "https://datatracker.ietf.org/doc/draft-ietf-cose-dilithium/";

export const APP_VERSION = "1.0.0";
