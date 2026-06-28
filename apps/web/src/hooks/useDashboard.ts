'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await api.get('/dashboard');
      return response.data.data;
    },
  });
}
