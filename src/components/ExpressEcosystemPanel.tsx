import { NPM_EXPRESS, NPM_ORG_PQ_JWT } from "../lib/ecosystem-links";
import FieldLabelRow from "./FieldLabelRow";

const EXPRESS_SAMPLE = `import express from "express";
import { pqAuth } from "@pq-jwt/express";

const app = express();

app.use(
  pqAuth({
    publicKey: process.env.PQ_PUBLIC_KEY, // hex from exportKey()
    issuer: "https://auth.yourdomain.com",
    audience: "http://localhost:3006",
  })
);

// req.user = verified JWT payload
app.get("/me", (req, res) => res.json({ user: req.user }));

app.listen(3000);`;

export default function ExpressEcosystemPanel() {
  return (
    <section className="panel">
      <h2>Express — @pq-jwt/express</h2>
      <p className="hint">
        <strong>Node.js only.</strong> This SPA does not bundle Express. Install on your API server with{" "}
        <code>@pq-jwt/core</code>.
      </p>

      <FieldLabelRow copy={{ text: EXPRESS_SAMPLE, label: "Express sample" }}>
        Sample pqAuth() setup
      </FieldLabelRow>
      <pre className="json-block header" style={{ maxHeight: "none" }}>
{EXPRESS_SAMPLE}
      </pre>

      <p className="hint" style={{ marginTop: "1rem" }}>
        See{" "}
        <a href={NPM_EXPRESS} target="_blank" rel="noreferrer">
          @pq-jwt/express
        </a>{" "}
        (<a href={NPM_ORG_PQ_JWT} target="_blank" rel="noreferrer">
          all @pq-jwt packages
        </a>
        ){" "}
        for options (<code>clockTolerance</code>, <code>algorithms</code>, custom extractors, role guards).
      </p>
    </section>
  );
}
