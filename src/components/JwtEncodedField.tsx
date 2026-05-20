import { useCallback } from "react";
import CopyButton from "./CopyButton";

interface Props {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  /** Colored segment preview above the editor (jwt.io-style) */
  showColoredPreview?: boolean;
}

/**
 * Highlights JWT (3 parts) or PQ-JWE compact (5 parts) like jwt.io; plain textarea fallback otherwise.
 */
function SyntaxSegments({ raw }: { raw: string }) {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const parts = trimmed.split(".");
  if (parts.some((p) => p.length === 0)) return null;

  const isJwtOrJwe = parts.length === 3 || parts.length === 5;
  if (!isJwtOrJwe) return null;

  const spanClass =
    parts.length === 3
      ? ["jwt-part-header", "jwt-part-payload", "jwt-part-signature"]
      : [
          "jwt-part-header",
          "jwt-part-payload",
          "jwt-part-enc-a",
          "jwt-part-enc-b",
          "jwt-part-signature",
        ];

  return (
    <div className="jwt-syntax-overview" aria-label="Token segment colors">
      {parts.flatMap((part, i) => {
        const el = (
          <span key={i} className={`jwt-part ${spanClass[i] ?? "jwt-part-raw"}`}>
            {part}
          </span>
        );
        if (i < parts.length - 1) {
          return [el, <span key={`dot-${i}`} className="jwt-sep">{"."}</span>];
        }
        return [el];
      })}
    </div>
  );
}

export default function JwtEncodedField({
  id = "encoded-jwt",
  value,
  onChange,
  placeholder,
  rows = 6,
  showColoredPreview = false,
}: Props) {
  const clear = useCallback(() => {
    onChange("");
  }, [onChange]);

  return (
    <div className="jwt-encoded-field">
      <div className="jwt-encoded-toolbar">
        <span className="jwt-encoded-legend hint">
          <span className="jwt-leg jwt-leg-h">●</span> header
          {" · "}
          <span className="jwt-leg jwt-leg-p">●</span> payload / body
          {" · "}
          <span className="jwt-leg jwt-leg-s">●</span> signature / ciphertext
        </span>
        <div className="jwt-encoded-actions">
          <CopyButton text={value} label="PQ-JWT token" />
          <button type="button" className="icon-btn" onClick={clear} disabled={!value} title="Clear">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            <span className="visually-hidden">Clear</span>
          </button>
        </div>
      </div>
      {showColoredPreview && <SyntaxSegments raw={value} />}
      <textarea
        id={id}
        className={`jwt-textarea${showColoredPreview ? "" : " jwt-textarea-primary"}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
      />
    </div>
  );
}
