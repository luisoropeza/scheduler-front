import { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import type { AppointmentRequest } from "../../types/appointment";

interface AppointmentFormProps {
  scheduleId: number;
  onSubmit: (data: AppointmentRequest) => void;
  onCancel: () => void;
  loading: boolean;
}

export function AppointmentForm({
  scheduleId,
  onSubmit,
  onCancel,
  loading,
}: AppointmentFormProps) {
  const [form, setForm] = useState({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = (): boolean => {
    const errs: Partial<typeof form> = {};
    if (!form.clientName.trim()) errs.clientName = "Required";
    if (!form.clientPhone.trim()) errs.clientPhone = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      scheduleId,
      clientName: form.clientName.trim(),
      clientPhone: form.clientPhone.trim(),
      clientEmail: form.clientEmail.trim() || undefined,
      notes: form.notes.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        id="clientName"
        label="Client name"
        value={form.clientName}
        onChange={set("clientName")}
        error={errors.clientName}
        autoFocus
      />
      <Input
        id="clientPhone"
        label="Phone"
        type="tel"
        value={form.clientPhone}
        onChange={set("clientPhone")}
        error={errors.clientPhone}
      />
      <Input
        id="clientEmail"
        label="Email (optional)"
        type="email"
        value={form.clientEmail}
        onChange={set("clientEmail")}
      />
      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className="text-sm font-medium text-gray-700">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          value={form.notes}
          onChange={set("notes")}
          rows={3}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none"
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>Book appointment</Button>
      </div>
    </form>
  );
}
