import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appointmentsApi } from "../api/appointments";
import type { AppointmentRequest, AppointmentStatus } from "../types/appointment";

export const appointmentKeys = {
  all: ["appointments"] as const,
  byPhone: (phone: string) =>
    [...appointmentKeys.all, "phone", phone] as const,
  byProvider: (providerId: number, status?: AppointmentStatus) =>
    [...appointmentKeys.all, "provider", providerId, { status }] as const,
  detail: (id: number) => [...appointmentKeys.all, id] as const,
};

export function useAppointmentsByPhone(phone: string) {
  return useQuery({
    queryKey: appointmentKeys.byPhone(phone),
    queryFn: () => appointmentsApi.listByPhone(phone),
    enabled: phone.trim().length > 0,
    staleTime: 1000 * 60,
  });
}

export function useAppointmentsByProvider(
  providerId: number,
  status?: AppointmentStatus,
) {
  return useQuery({
    queryKey: appointmentKeys.byProvider(providerId, status),
    queryFn: () => appointmentsApi.listByProvider(providerId, status),
    staleTime: 1000 * 60,
  });
}

export function useCreateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AppointmentRequest) => appointmentsApi.create(data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: appointmentKeys.all }),
  });
}

export function useConfirmAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => appointmentsApi.confirm(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: appointmentKeys.all }),
  });
}

export function useCancelAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => appointmentsApi.cancel(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: appointmentKeys.all }),
  });
}
