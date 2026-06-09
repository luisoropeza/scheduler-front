import { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import type { Provider, ProviderRequest } from "../../types/provider";

interface ProviderFormProps {
  initial?: Provider;
  onSubmit: (data: ProviderRequest) => void;
  onCancel: () => void;
  loading: boolean;
}

export function ProviderForm({ initial, onSubmit, onCancel, loading }: ProviderFormProps) {
  const [form, setForm] = useState<ProviderRequest>({
    name: initial?.name ?? "",
    specialty: initial?.specialty ?? "",
    phone: initial?.phone ?? "",
    email: initial?.email ?? "",
  });
  const [errors, setErrors] = useState<Partial<ProviderRequest>>({});

  const set = (field: keyof ProviderRequest) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = (): boolean => {
    if (!form.name.trim()) {
      setErrors({ name: "Name is required" });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: form.name.trim(),
      specialty: form.specialty?.trim() || undefined,
      phone: form.phone?.trim() || undefined,
      email: form.email?.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        id="name"
        label="Name"
        value={form.name}
        onChange={set("name")}
        error={errors.name}
        placeholder="Dr. Jane Smith"
        autoFocus
      />
      <Input
        id="specialty"
        label="Specialty"
        value={form.specialty ?? ""}
        onChange={set("specialty")}
        placeholder="Cardiology"
      />
      <Input
        id="phone"
        label="Phone"
        value={form.phone ?? ""}
        onChange={set("phone")}
        placeholder="+1 555 000 0000"
        type="tel"
      />
      <Input
        id="email"
        label="Email"
        value={form.email ?? ""}
        onChange={set("email")}
        placeholder="provider@clinic.com"
        type="email"
      />
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {initial ? "Save changes" : "Create provider"}
        </Button>
      </div>
    </form>
  );
}
