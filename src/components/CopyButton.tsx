import { useCallback, useState } from "react";

interface Props {
  text: string;
  label: string;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md";
}

export default function CopyButton({
  text,
  label,
  disabled,
  className = "",
  size = "md",
}: Props) {
  const [copied, setCopied] = useState(false);
  const isDisabled = disabled ?? !text.trim();

  const copy = useCallback(async () => {
    const t = text.trim();
    if (!t) return;
    try {
      await navigator.clipboard.writeText(t);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [text]);

  const sizeClass = size === "sm" ? "icon-btn-sm" : "";

  return (
    <span className={`copy-btn-wrap${className ? ` ${className}` : ""}`}>
      {copied && <span className="toolbar-toast">Copied</span>}
      <button
        type="button"
        className={`icon-btn copy-btn ${sizeClass}`.trim()}
        onClick={copy}
        disabled={isDisabled}
        title={`Copy ${label}`}
        aria-label={`Copy ${label}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      </button>
    </span>
  );
}
