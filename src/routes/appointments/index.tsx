import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, CalendarCheck } from "lucide-react";
import { useAppointmentsByPhone, useConfirmAppointment, useCancelAppointment } from "../../hooks/appointmentQueries";
import { AppointmentCard } from "../../components/appointments/AppointmentCard";
import { Input } from "../../components/ui/Input";
import { Spinner } from "../../components/ui/Spinner";
import { EmptyState } from "../../components/ui/EmptyState";

export const Route = createFileRoute("/appointments/")({
  component: AppointmentsPage,
});

function AppointmentsPage() {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState("");

  const { data, isLoading, isError } = useAppointmentsByPhone(submitted);
  const confirm = useConfirmAppointment();
  const cancel = useCancelAppointment();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(phone.trim());
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Appointments</h1>

      {/* Phone search */}
      <form onSubmit={handleSearch} className="flex items-end gap-3 mb-8 max-w-sm">
        <div className="flex-1">
          <Input
            id="phone"
            label="Search by client phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555 000 0000"
          />
        </div>
        <button
          type="submit"
          className="mb-0.5 flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </form>

      {!submitted && (
        <EmptyState
          icon={<CalendarCheck className="h-12 w-12" />}
          title="Enter a phone number to search"
          description="Find all appointments for a client by their phone number."
        />
      )}

      {submitted && isLoading && <Spinner />}

      {submitted && isError && (
        <p className="text-sm text-red-500">Failed to load appointments.</p>
      )}

      {submitted && data && data.length === 0 && (
        <EmptyState
          title="No appointments found"
          description={`No appointments for ${submitted}.`}
        />
      )}

      {submitted && data && data.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((a) => (
            <AppointmentCard
              key={a.id}
              appointment={a}
              onConfirm={confirm.mutate}
              onCancel={cancel.mutate}
              confirming={confirm.isPending}
              cancelling={cancel.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
