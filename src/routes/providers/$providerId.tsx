import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarPlus, CalendarX } from "lucide-react";
import { useProvider } from "../../hooks/providerQueries";
import { useSchedules, useCreateBatchSchedules, useDeleteSchedule } from "../../hooks/scheduleQueries";
import { useAppointmentsByProvider, useConfirmAppointment, useCancelAppointment } from "../../hooks/appointmentQueries";
import { ScheduleItem } from "../../components/schedules/ScheduleItem";
import { ScheduleForm } from "../../components/schedules/ScheduleForm";
import { AppointmentCard } from "../../components/appointments/AppointmentCard";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { EmptyState } from "../../components/ui/EmptyState";
import type { AppointmentStatus } from "../../types/appointment";
import type { ScheduleRequest } from "../../types/schedule";

export const Route = createFileRoute("/providers/$providerId")({
  component: ProviderDetailPage,
});

const STATUS_TABS: AppointmentStatus[] = ["CONFIRMED", "PENDING", "CANCELLED"];

function ProviderDetailPage() {
  const { providerId } = Route.useParams();
  const id = Number(providerId);

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AppointmentStatus>("CONFIRMED");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: provider, isLoading: providerLoading } = useProvider(id);
  const { data: schedules, isLoading: schedulesLoading } = useSchedules(id);
  const { data: appointments, isLoading: apptLoading } = useAppointmentsByProvider(id, activeTab);

  const createBatch = useCreateBatchSchedules(id);
  const deleteSchedule = useDeleteSchedule(id);
  const confirm = useConfirmAppointment();
  const cancel = useCancelAppointment();

  const handleCreateSchedules = (slots: ScheduleRequest[]) => {
    createBatch.mutate(slots, { onSuccess: () => setScheduleModalOpen(false) });
  };

  const handleDeleteSchedule = (scheduleId: number) => {
    setDeletingId(scheduleId);
    deleteSchedule.mutate(scheduleId, { onSettled: () => setDeletingId(null) });
  };

  if (providerLoading) return <Spinner />;
  if (!provider) return <p className="p-8 text-sm text-red-500">Provider not found.</p>;

  return (
    <div className="p-8 max-w-4xl">
      <Link
        to="/providers"
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to providers
      </Link>

      {/* Provider header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">{provider.name}</h1>
        {provider.specialty && (
          <p className="text-sm text-indigo-600 mt-0.5">{provider.specialty}</p>
        )}
      </div>

      {/* Schedules section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">Schedules</h2>
          <Button size="sm" onClick={() => setScheduleModalOpen(true)}>
            <CalendarPlus className="h-4 w-4" />
            Add slots
          </Button>
        </div>

        {schedulesLoading && <Spinner label="Loading schedules…" />}

        {schedules && schedules.length === 0 && (
          <EmptyState
            icon={<CalendarX className="h-10 w-10" />}
            title="No schedule slots"
            description="Add time slots so clients can book appointments."
          />
        )}

        {schedules && schedules.length > 0 && (
          <div className="flex flex-col gap-2">
            {schedules.map((s) => (
              <ScheduleItem
                key={s.id}
                schedule={s}
                onDelete={handleDeleteSchedule}
                deleting={deletingId === s.id}
              />
            ))}
          </div>
        )}
      </section>

      {/* Appointments section */}
      <section>
        <h2 className="text-base font-semibold text-gray-800 mb-4">Appointments</h2>

        {/* Status tabs */}
        <div className="flex gap-1 mb-4 border-b border-gray-200">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {apptLoading && <Spinner label="Loading appointments…" />}

        {appointments && appointments.length === 0 && (
          <EmptyState title={`No ${activeTab.toLowerCase()} appointments`} />
        )}

        {appointments && appointments.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {appointments.map((a) => (
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
      </section>

      <Modal
        open={scheduleModalOpen}
        title="Add schedule slots"
        onClose={() => setScheduleModalOpen(false)}
      >
        <ScheduleForm
          onSubmit={handleCreateSchedules}
          onCancel={() => setScheduleModalOpen(false)}
          loading={createBatch.isPending}
        />
      </Modal>
    </div>
  );
}
