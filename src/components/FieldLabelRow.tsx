import type { ReactNode } from "react";
import CopyButton from "./CopyButton";

interface Props {
  htmlFor?: string;
  children: ReactNode;
  copy?: { text: string; label: string };
}

/** Label row with optional copy — use above key-display, textareas, or JSON blocks. */
export default function FieldLabelRow({ htmlFor, children, copy }: Props) {
  return (
    <div className="field-label-row">
      {htmlFor ? (
        <label htmlFor={htmlFor}>{children}</label>
      ) : (
        <span className="field-label-row-text">{children}</span>
      )}
      {copy && <CopyButton text={copy.text} label={copy.label} size="sm" />}
    </div>
  );
}
