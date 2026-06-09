import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { schedulesApi } from "../api/schedules";
import type { ScheduleRequest } from "../types/schedule";

export const scheduleKeys = {
  all: ["schedules"] as const,
  byProvider: (providerId: number) =>
    [...scheduleKeys.all, "provider", providerId] as const,
  available: (providerId: number) =>
    [...scheduleKeys.byProvider(providerId), "available"] as const,
};

export function useSchedules(providerId: number) {
  return useQuery({
    queryKey: scheduleKeys.byProvider(providerId),
    queryFn: () => schedulesApi.list(providerId),
    staleTime: 1000 * 60 * 2,
  });
}

export function useAvailableSchedules(providerId: number) {
  return useQuery({
    queryKey: scheduleKeys.available(providerId),
    queryFn: () => schedulesApi.listAvailable(providerId),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateSchedule(providerId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ScheduleRequest) =>
      schedulesApi.create(providerId, data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: scheduleKeys.byProvider(providerId) }),
  });
}

export function useCreateBatchSchedules(providerId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ScheduleRequest[]) =>
      schedulesApi.createBatch(providerId, data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: scheduleKeys.byProvider(providerId) }),
  });
}

export function useDeleteSchedule(providerId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (scheduleId: number) =>
      schedulesApi.remove(providerId, scheduleId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: scheduleKeys.byProvider(providerId) }),
  });
}
