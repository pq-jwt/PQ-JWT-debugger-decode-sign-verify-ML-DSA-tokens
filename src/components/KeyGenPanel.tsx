import { useState } from "react";
import {
  generateKeys,
  DEFAULT_ALGORITHM,
  ML_DSA_ALGORITHMS,
  algoLabel,
  type Algorithm,
} from "../lib/pq-crypto";

interface Props {
  onKeysGenerated: (keys: { privateKey: string; publicKey: string }) => void;
}

export default function KeyGenPanel({ onKeysGenerated }: Props) {
  const [algo, setAlgo] = useState<Algorithm>(DEFAULT_ALGORITHM);
  const [keys, setKeys] = useState<{ privateKey: string; publicKey: string } | null>(null);
  const [busy, setBusy] = useState(false);

  function handleGenerate() {
    setBusy(true);
    try {
      const kp = generateKeys(algo);
      setKeys(kp);
      onKeysGenerated(kp);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel">
      <h2>Generate ML-DSA key pair</h2>
      <p className="hint">
        Keys are generated in your browser via{" "}
        <a href="https://www.npmjs.com/package/@pq-jwt/core" target="_blank" rel="noreferrer">
          @pq-jwt/core
        </a>{" "}
        (@noble/post-quantum, FIPS 204). Never leave this device.
      </p>

      <div className="field-row">
        <div className="field">
          <label htmlFor="algo-select">Algorithm</label>
          <select
            id="algo-select"
            value={algo}
            onChange={(e) => setAlgo(e.target.value as Algorithm)}
          >
            {ML_DSA_ALGORITHMS.map((a) => (
              <option key={a} value={a}>
                {a === "ML-DSA-44" && "ML-DSA-44 (Category 2, ~2.4 KB sig)"}
                {a === "ML-DSA-65" && "ML-DSA-65 (Category 3, ~3.3 KB sig) — default"}
                {a === "ML-DSA-87" && "ML-DSA-87 (Category 5, ~4.6 KB sig)"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="btn-row">
        <button type="button" className="btn btn-primary" disabled={busy} onClick={handleGenerate}>
          {busy ? "Generating…" : `Generate ${algoLabel(algo)} keypair`}
        </button>
      </div>

      {keys && (
        <>
          <div className="field" style={{ marginTop: "1rem" }}>
            <label>Public key (hex)</label>
            <div className="key-display">{keys.publicKey}</div>
          </div>
          <div className="field">
            <label>Secret key (hex) — keep secret</label>
            <div className="key-display">{keys.privateKey}</div>
          </div>
        </>
      )}
    </section>
  );
}
