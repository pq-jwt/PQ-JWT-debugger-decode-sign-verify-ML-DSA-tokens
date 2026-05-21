type TabId =
  | "decode"
  | "keys"
  | "sign"
  | "verify"
  | "compare"
  | "hybrid"
  | "jose"
  | "express";

interface TabDef {
  id: TabId;
  label: string;
}

const CORE_TABS: TabDef[] = [
  { id: "decode", label: "Decode" },
  { id: "keys", label: "Keys" },
  { id: "sign", label: "Sign" },
  { id: "verify", label: "Verify" },
  { id: "compare", label: "Size compare" },
];

const ADVANCED_TABS: TabDef[] = [
  { id: "hybrid", label: "Hybrid" },
  { id: "jose", label: "PQ-JOSE" },
  { id: "express", label: "Express" },
];

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
}

function TabButton({
  id,
  label,
  active,
  onChange,
}: TabDef & { active: TabId; onChange: (tab: TabId) => void }) {
  return (
    <button
      type="button"
      className={`tab${active === id ? " active" : ""}`}
      onClick={() => onChange(id)}
      aria-current={active === id ? "page" : undefined}
    >
      {label}
    </button>
  );
}

export default function TabNav({ active, onChange }: Props) {
  return (
    <nav className="tabs tabs-grouped" aria-label="Debugger sections">
      <div className="tab-group">
        <span className="tab-group-label">JWT toolkit</span>
        <div className="tab-group-buttons" role="group" aria-label="JWT toolkit">
          {CORE_TABS.map((t) => (
            <TabButton key={t.id} {...t} active={active} onChange={onChange} />
          ))}
        </div>
      </div>
      <div className="tab-group-divider" aria-hidden />
      <div className="tab-group">
        <span className="tab-group-label">Advanced</span>
        <div className="tab-group-buttons" role="group" aria-label="Advanced">
          {ADVANCED_TABS.map((t) => (
            <TabButton key={t.id} {...t} active={active} onChange={onChange} />
          ))}
        </div>
      </div>
    </nav>
  );
}

export type { TabId };
