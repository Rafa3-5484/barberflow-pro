import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Appointment, AppointmentStatus } from '@/types'
import { format } from 'date-fns'

export function useAppointments(date?: string) {
  const queryDate = date || format(new Date(), 'yyyy-MM-dd')
  return useQuery({
    queryKey: ['appointments', queryDate],
    queryFn: () => api.get<Appointment[]>(`/appointments/date/${queryDate}`),
  })
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: () => api.get<Appointment>(`/appointments/${id}`),
    enabled: !!id,
  })
}

export function useCreateAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      clientName?: string
      clientPhone?: string
      clientEmail?: string
      clientId?: string
      professionalId: string
      serviceId: string
      date: string
      notes?: string
    }) => api.post<Appointment>('/appointments', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: AppointmentStatus
    }) => api.patch<Appointment>(`/appointments/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}

export function useAppointmentsByProfessional(professionalId: string) {
  return useQuery({
    queryKey: ['appointments', 'professional', professionalId],
    queryFn: () =>
      api.get<Appointment[]>(
        `/appointments/professional/${professionalId}`
      ),
    enabled: !!professionalId,
  })
}
