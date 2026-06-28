'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Appointment, PaginatedResponse } from '@serviceflow/shared';

interface AppointmentFilters {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
  clientId?: string;
  userId?: string;
  search?: string;
}

export function useAppointments(filters?: AppointmentFilters) {
  return useQuery({
    queryKey: ['appointments', filters],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Appointment>>('/appointments', {
        params: filters,
      });
      return response.data;
    },
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: async () => {
      const response = await api.get<{ data: Appointment }>(`/appointments/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useAppointmentsCalendar(params: { startDate: string; endDate: string; userId?: string }) {
  return useQuery({
    queryKey: ['appointments-calendar', params],
    queryFn: async () => {
      const response = await api.get<{ data: Appointment[] }>('/appointments/calendar', {
        params,
      });
      return response.data.data;
    },
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Appointment>) => {
      const response = await api.post<{ data: Appointment }>('/appointments', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointments-calendar'] });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Appointment> }) => {
      const response = await api.put<{ data: Appointment }>(`/appointments/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', variables.id] });
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/appointments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}
