import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import type { ScheduleRequest } from "../../types/schedule";

interface ScheduleFormProps {
  onSubmit: (slots: ScheduleRequest[]) => void;
  onCancel: () => void;
  loading: boolean;
}

const emptySlot = (): ScheduleRequest => ({ startTime: "", endTime: "" });

function toIso(localDt: string): string {
  return localDt ? new Date(localDt).toISOString().slice(0, 19) : "";
}

export function ScheduleForm({ onSubmit, onCancel, loading }: ScheduleFormProps) {
  const [slots, setSlots] = useState<ScheduleRequest[]>([emptySlot()]);
  const [errors, setErrors] = useState<string[]>([]);

  const update = (idx: number, field: keyof ScheduleRequest, value: string) =>
    setSlots((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)),
    );

  const addSlot = () => setSlots((prev) => [...prev, emptySlot()]);

  const removeSlot = (idx: number) =>
    setSlots((prev) => prev.filter((_, i) => i !== idx));

  const validate = (): boolean => {
    const errs = slots.map((s, i) => {
      if (!s.startTime || !s.endTime) return `Slot ${i + 1}: both times required`;
      if (new Date(s.startTime) >= new Date(s.endTime))
        return `Slot ${i + 1}: start must be before end`;
      if (new Date(s.startTime) <= new Date())
        return `Slot ${i + 1}: time must be in the future`;
      return "";
    });
    const nonEmpty = errs.filter(Boolean);
    setErrors(nonEmpty);
    return nonEmpty.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(slots.map((s) => ({ startTime: toIso(s.startTime), endTime: toIso(s.endTime) })));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {slots.map((slot, idx) => (
        <div key={idx} className="flex items-end gap-2 rounded-lg border border-gray-200 p-3">
          <div className="flex-1">
            <Input
              label="Start"
              type="datetime-local"
              value={slot.startTime}
              onChange={(e) => update(idx, "startTime", e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Input
              label="End"
              type="datetime-local"
              value={slot.endTime}
              onChange={(e) => update(idx, "endTime", e.target.value)}
            />
          </div>
          {slots.length > 1 && (
            <button
              type="button"
              onClick={() => removeSlot(idx)}
              className="mb-0.5 rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
      {errors.map((e) => (
        <p key={e} className="text-xs text-red-500">{e}</p>
      ))}
      <button
        type="button"
        onClick={addSlot}
        className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 self-start"
      >
        <Plus className="h-4 w-4" /> Add another slot
      </button>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>
          {slots.length === 1 ? "Add slot" : `Add ${slots.length} slots`}
        </Button>
      </div>
    </form>
  );
}
