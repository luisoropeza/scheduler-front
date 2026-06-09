import { http } from "./client";
import type { Schedule, ScheduleRequest } from "../types/schedule";

export const schedulesApi = {
  list: (providerId: number) =>
    http.get<Schedule[]>(`/api/providers/${providerId}/schedules`),
  listAvailable: (providerId: number) =>
    http.get<Schedule[]>(`/api/providers/${providerId}/schedules/available`),
  create: (providerId: number, data: ScheduleRequest) =>
    http.post<Schedule>(`/api/providers/${providerId}/schedules`, data),
  createBatch: (providerId: number, data: ScheduleRequest[]) =>
    http.post<Schedule[]>(`/api/providers/${providerId}/schedules/batch`, data),
  remove: (providerId: number, scheduleId: number) =>
    http.delete<void>(`/api/providers/${providerId}/schedules/${scheduleId}`),
};
