import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { CashRegister, Transaction } from '@/types'

export function useCurrentCashRegister() {
  return useQuery({
    queryKey: ['cash-register', 'current'],
    queryFn: () => api.get<CashRegister>('/cash-register/current'),
    refetchInterval: 30000,
  })
}

export function useOpenCashRegister() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { initialAmount: number }) =>
      api.post<CashRegister>('/cash-register/open', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-register'] })
    },
  })
}

export function useCloseCashRegister() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      api.post<CashRegister>(`/cash-register/close/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-register'] })
    },
  })
}

export function useAddTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      cashRegisterId: string
      type: 'INCOME' | 'EXPENSE' | 'WITHDRAWAL'
      description: string
      amount: number
      paymentMethod?: 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH'
    }) => api.post<Transaction>('/cash-register/transaction', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-register'] })
    },
  })
}
