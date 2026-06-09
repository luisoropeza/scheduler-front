import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      {icon && <div className="text-gray-300">{icon}</div>}
      <p className="text-sm font-medium text-gray-500">{title}</p>
      {description && (
        <p className="max-w-xs text-xs text-gray-400">{description}</p>
      )}
      {action}
    </div>
  );
}
