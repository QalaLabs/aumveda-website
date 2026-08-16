import type { ElementType, ReactNode } from "react";

/**
 * Floating glass content surface — the UI "floats inside" the 3D world
 * rather than sitting on an opaque page background. Used by every section.
 */
export function GlassPanel({
  children,
  className = "",
  as: Tag = "div",
  variant = "dark",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  variant?: "dark" | "light";
}) {
  return (
    <Tag
      className={`av-glass ${variant === "light" ? "av-glass-light" : ""} rounded-[28px] ${className}`}
    >
      {children}
    </Tag>
  );
}

export function Eyebrow({ index, label }: { index: string; label: string }) {
  return (
    <p
      data-reveal
      className="mb-7 flex items-center gap-4 font-body text-[11px] font-medium uppercase tracking-[0.28em] text-[hsl(var(--av-copper-soft))]"
    >
      <span className="h-px w-10 bg-[hsl(var(--av-copper))]" />
      {index} — {label}
    </p>
  );
}
