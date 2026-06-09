import { Trash2 } from "lucide-react";
import { Badge } from "../ui/Badge";
import type { Schedule } from "../../types/schedule";

interface ScheduleItemProps {
  schedule: Schedule;
  onDelete: (id: number) => void;
  deleting: boolean;
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ScheduleItem({ schedule, onDelete, deleting }: ScheduleItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <Badge variant={schedule.status === "AVAILABLE" ? "green" : "yellow"}>
          {schedule.status}
        </Badge>
        <span className="text-sm text-gray-700">
          {fmt(schedule.startTime)} → {fmt(schedule.endTime)}
        </span>
      </div>
      {schedule.status === "AVAILABLE" && (
        <button
          onClick={() => onDelete(schedule.id)}
          disabled={deleting}
          className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
          title="Delete slot"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
