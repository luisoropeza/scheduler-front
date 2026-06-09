import { http } from "./client";
import type { Appointment, AppointmentRequest, AppointmentStatus } from "../types/appointment";

export const appointmentsApi = {
  create: (data: AppointmentRequest) =>
    http.post<Appointment>("/api/appointments", data),
  get: (id: number) => http.get<Appointment>(`/api/appointments/${id}`),
  listByPhone: (phone: string) =>
    http.get<Appointment[]>(`/api/appointments?phone=${encodeURIComponent(phone)}`),
  listByProvider: (providerId: number, status?: AppointmentStatus) => {
    const query = status ? `?status=${status}` : "";
    return http.get<Appointment[]>(
      `/api/appointments/provider/${providerId}${query}`,
    );
  },
  confirm: (id: number) =>
    http.patch<Appointment>(`/api/appointments/${id}/confirm`),
  cancel: (id: number) =>
    http.patch<Appointment>(`/api/appointments/${id}/cancel`),
};
