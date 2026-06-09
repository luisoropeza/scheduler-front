export type ScheduleStatus = "AVAILABLE" | "BOOKED";

export interface Schedule {
  id: number;
  providerId: number;
  providerName: string;
  providerSpecialty: string | null;
  startTime: string;
  endTime: string;
  status: ScheduleStatus;
}

export interface ScheduleRequest {
  startTime: string;
  endTime: string;
}
