export type UserRole = 'ADMIN' | 'MANAGER' | 'BARBER' | 'CASHIER'
export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
export type PaymentMethod = 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH'
export type TransactionType = 'INCOME' | 'EXPENSE' | 'WITHDRAWAL'

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: UserRole
  avatar?: string
  active: boolean
  barbershopId: string
  createdAt: string
}

export interface Professional {
  id: string
  name: string
  photo?: string
  specialties: string[]
  phone: string
  email?: string
  commission: number
  active: boolean
  userId?: string
}

export interface Service {
  id: string
  name: string
  description?: string
  price: number
  duration: number
  active: boolean
}

export interface Client {
  id: string
  name: string
  phone: string
  email?: string
  birthDate?: string
  notes?: string
  totalVisits: number
  totalSpent: number
  lastVisit?: string
  createdAt: string
}

export interface Appointment {
  id: string
  date: string
  status: AppointmentStatus
  notes?: string
  clientId: string
  client: Client
  professionalId: string
  professional: Professional
  serviceId: string
  service: Service
  createdAt: string
}

export interface CashRegister {
  id: string
  operatorId: string
  operator: User
  initialAmount: number
  currentAmount: number
  totalIncome: number
  totalExpense: number
  status: string
  openedAt: string
  closedAt?: string
  transactions?: Transaction[]
  appointments?: Appointment[]
}

export interface Transaction {
  id: string
  type: TransactionType
  description: string
  amount: number
  paymentMethod?: PaymentMethod
  createdAt: string
}

export interface StockItem {
  id: string
  name: string
  description?: string
  quantity: number
  minQuantity: number
  price?: number
  unit: string
  expiryDate?: string
  category?: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: string
}

export interface Barbershop {
  id: string
  name: string
  slug: string
  phone?: string
  email?: string
  address?: string
  logo?: string
  active: boolean
  createdAt: string
}

export interface DashboardKPIs {
  dailyRevenue: number
  monthlyRevenue: number
  todayAppointments: number
  todayClients: number
  occupancyRate: number
  averageTicket: number
  cancellations: number
  noShow: number
  newClients: number
  recurringClients: number
  servicesSold: { name: string; count: number }[]
  peakHours: { hour: number; count: number }[]
  professionalCommissions: { name: string; commission: number; revenue: number }[]
}
