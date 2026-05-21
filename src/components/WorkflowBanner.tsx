interface Props {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: "info" | "success";
}

export default function WorkflowBanner({
  message,
  actionLabel,
  onAction,
  variant = "info",
}: Props) {
  return (
    <div className={`workflow-banner workflow-banner-${variant}`} role="status">
      <span>{message}</span>
      {actionLabel && onAction && (
        <button type="button" className="workflow-banner-btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
