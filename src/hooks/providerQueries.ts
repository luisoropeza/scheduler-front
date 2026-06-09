import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { providersApi } from "../api/providers";
import type { ProviderRequest } from "../types/provider";

export const providerKeys = {
  all: ["providers"] as const,
  lists: () => [...providerKeys.all, "list"] as const,
  list: (specialty?: string) => [...providerKeys.lists(), { specialty }] as const,
  detail: (id: number) => [...providerKeys.all, "detail", id] as const,
};

export function useProviders(specialty?: string) {
  return useQuery({
    queryKey: providerKeys.list(specialty),
    queryFn: () => providersApi.list(specialty),
    staleTime: 1000 * 60 * 5,
  });
}

export function useProvider(id: number) {
  return useQuery({
    queryKey: providerKeys.detail(id),
    queryFn: () => providersApi.get(id),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProviderRequest) => providersApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: providerKeys.lists() }),
  });
}

export function useUpdateProvider(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProviderRequest) => providersApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: providerKeys.lists() });
      qc.invalidateQueries({ queryKey: providerKeys.detail(id) });
    },
  });
}

export function useDeleteProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => providersApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: providerKeys.lists() }),
  });
}
