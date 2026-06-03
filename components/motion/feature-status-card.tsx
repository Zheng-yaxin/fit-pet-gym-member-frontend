"use client";

type FeatureStatusKind = "loading" | "error" | "success" | "empty";

type FeatureStatusCardProps = {
  kind?: FeatureStatusKind;
  title: string;
  detail?: string;
};

export function FeatureStatusCard({ kind = "loading", title, detail }: FeatureStatusCardProps) {
  const role = kind === "error" ? "alert" : "status";

  return (
    <div className={`feature-status-card feature-status-card--${kind}`} role={role} aria-live="polite">
      <span className="feature-status-orb" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="feature-status-copy">
        <strong>{title}</strong>
        {detail ? <small>{detail}</small> : null}
      </span>
    </div>
  );
}
