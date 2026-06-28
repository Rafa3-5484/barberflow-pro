'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Budget, PaginatedResponse } from '@serviceflow/shared';

interface BudgetFilters {
  page?: number;
  limit?: number;
  status?: string;
  clientId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export function useBudgets(filters?: BudgetFilters) {
  return useQuery({
    queryKey: ['budgets', filters],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Budget>>('/budgets', {
        params: filters,
      });
      return response.data;
    },
  });
}

export function useBudget(id: string) {
  return useQuery({
    queryKey: ['budget', id],
    queryFn: async () => {
      const response = await api.get<{ data: Budget }>(`/budgets/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Budget>) => {
      const response = await api.post<{ data: Budget }>('/budgets', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Budget> }) => {
      const response = await api.put<{ data: Budget }>(`/budgets/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budget', variables.id] });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/budgets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
}

export function useSendBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post<{ data: Budget }>(`/budgets/${id}/send`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
}

export function useAcceptBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post<{ data: Budget }>(`/budgets/${id}/accept`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
}
