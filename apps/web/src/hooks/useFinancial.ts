'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { FinancialRecord } from '@serviceflow/shared';

interface FinancialFilters {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
}

export function useFinancialRecords(filters?: FinancialFilters) {
  return useQuery({
    queryKey: ['financial-records', filters],
    queryFn: async () => {
      const response = await api.get('/financial', { params: filters });
      return response.data;
    },
  });
}

export function useFinancialDashboard(params?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['financial-dashboard', params],
    queryFn: async () => {
      const response = await api.get('/financial/dashboard', { params });
      return response.data.data;
    },
  });
}

export function useFinancialIndicators() {
  return useQuery({
    queryKey: ['financial-indicators'],
    queryFn: async () => {
      const response = await api.get('/financial/indicators');
      return response.data.data;
    },
  });
}

export function useCreateFinancialRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<FinancialRecord>) => {
      const response = await api.post('/financial', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-records'] });
      queryClient.invalidateQueries({ queryKey: ['financial-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['financial-indicators'] });
    },
  });
}
