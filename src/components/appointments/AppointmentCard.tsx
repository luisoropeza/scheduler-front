import { Phone, Mail, FileText, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import type { Appointment, AppointmentStatus } from "../../types/appointment";

interface AppointmentCardProps {
  appointment: Appointment;
  onConfirm?: (id: number) => void;
  onCancel?: (id: number) => void;
  confirming?: boolean;
  cancelling?: boolean;
}

const statusBadge: Record<AppointmentStatus, "yellow" | "green" | "red"> = {
  PENDING: "yellow",
  CONFIRMED: "green",
  CANCELLED: "red",
};

function fmt(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AppointmentCard({
  appointment,
  onConfirm,
  onCancel,
  confirming,
  cancelling,
}: AppointmentCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-900">{appointment.clientName}</p>
          <p className="text-xs text-gray-500">
            {appointment.providerName}
            {appointment.providerSpecialty && ` · ${appointment.providerSpecialty}`}
          </p>
        </div>
        <Badge variant={statusBadge[appointment.status]}>{appointment.status}</Badge>
      </div>

      <div className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700">
        {fmt(appointment.scheduleStart)} → {fmt(appointment.scheduleEnd)}
      </div>

      <div className="flex flex-col gap-1 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <Phone className="h-3 w-3" />
          {appointment.clientPhone}
        </span>
        {appointment.clientEmail && (
          <span className="flex items-center gap-1.5">
            <Mail className="h-3 w-3" />
            {appointment.clientEmail}
          </span>
        )}
        {appointment.notes && (
          <span className="flex items-center gap-1.5">
            <FileText className="h-3 w-3" />
            {appointment.notes}
          </span>
        )}
      </div>

      {appointment.status !== "CANCELLED" && (
        <div className="flex gap-2 pt-1">
          {appointment.status === "PENDING" && onConfirm && (
            <Button
              size="sm"
              variant="primary"
              loading={confirming}
              onClick={() => onConfirm(appointment.id)}
            >
              <CheckCircle className="h-4 w-4" />
              Confirm
            </Button>
          )}
          {onCancel && (
            <Button
              size="sm"
              variant="danger"
              loading={cancelling}
              onClick={() => onCancel(appointment.id)}
            >
              <XCircle className="h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
