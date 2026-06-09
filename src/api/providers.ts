import { http } from "./client";
import type { Provider, ProviderRequest } from "../types/provider";

export const providersApi = {
  list: (specialty?: string) => {
    const query = specialty ? `?specialty=${encodeURIComponent(specialty)}` : "";
    return http.get<Provider[]>(`/api/providers${query}`);
  },
  get: (id: number) => http.get<Provider>(`/api/providers/${id}`),
  create: (data: ProviderRequest) => http.post<Provider>("/api/providers", data),
  update: (id: number, data: ProviderRequest) =>
    http.put<Provider>(`/api/providers/${id}`, data),
  remove: (id: number) => http.delete<void>(`/api/providers/${id}`),
};
