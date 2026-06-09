import { Mail, Phone, Stethoscope, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import type { Provider } from "../../types/provider";

interface ProviderCardProps {
  provider: Provider;
  onEdit: (provider: Provider) => void;
  onDelete: (provider: Provider) => void;
  onViewSchedules: (provider: Provider) => void;
}

export function ProviderCard({
  provider,
  onEdit,
  onDelete,
  onViewSchedules,
}: ProviderCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-900">{provider.name}</p>
          {provider.specialty && (
            <p className="flex items-center gap-1 text-xs text-indigo-600 mt-0.5">
              <Stethoscope className="h-3 w-3" />
              {provider.specialty}
            </p>
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(provider)}
            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(provider)}
            className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-1 text-xs text-gray-500">
        {provider.phone && (
          <span className="flex items-center gap-1.5">
            <Phone className="h-3 w-3" />
            {provider.phone}
          </span>
        )}
        {provider.email && (
          <span className="flex items-center gap-1.5">
            <Mail className="h-3 w-3" />
            {provider.email}
          </span>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="self-start"
        onClick={() => onViewSchedules(provider)}
      >
        View schedules →
      </Button>
    </div>
  );
}
