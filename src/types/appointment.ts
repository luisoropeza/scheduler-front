export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface Appointment {
  id: number;
  scheduleId: number;
  scheduleStart: string;
  scheduleEnd: string;
  providerName: string;
  providerSpecialty: string | null;
  clientName: string;
  clientPhone: string;
  clientEmail: string | null;
  status: AppointmentStatus;
  notes: string | null;
  createdAt: string;
}

export interface AppointmentRequest {
  scheduleId: number;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  notes?: string;
}
