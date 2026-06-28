export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  companyId?: string;
  companyName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'owner' | 'admin' | 'technician' | 'attendant' | 'viewer';

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  document?: string;
  phone?: string;
  address?: Address;
  plan: PlanType;
  settings: CompanySettings;
  createdAt: Date;
  updatedAt: Date;
}

export type PlanType = 'starter' | 'professional' | 'enterprise';

export interface CompanySettings {
  workingHours: WorkingHours;
  weekStart: 'sunday' | 'monday';
  appointmentDuration: number;
  autoConfirmation: boolean;
  reminderEnabled: boolean;
  defaultBudgetValidity: number;
  pixKey?: string;
  pixKeyType?: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
  bankInfo?: BankInfo;
}

export interface WorkingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  active: boolean;
  start: string;
  end: string;
  lunchStart?: string;
  lunchEnd?: string;
}

export interface BankInfo {
  bank: string;
  agency: string;
  account: string;
  accountType: 'checking' | 'savings';
  pixKey?: string;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  lat?: number;
  lng?: number;
}

export interface Client {
  id: string;
  companyId: string;
  name: string;
  phone: string;
  email?: string;
  document?: string;
  address?: Address;
  birthDate?: Date;
  notes?: string;
  source?: string;
  tags?: string[];
  totalSpent: number;
  totalVisits: number;
  lastVisit?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';

export interface Appointment {
  id: string;
  companyId: string;
  clientId: string;
  userId: string;
  title: string;
  description?: string;
  status: AppointmentStatus;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  date: Date;
  startTime: string;
  endTime: string;
  estimatedDuration: number;
  address?: Address;
  photos?: string[];
  attachments?: string[];
  notes?: string;
  price?: number;
  recurrence?: Recurrence;
  createdAt: Date;
  updatedAt: Date;
}

export interface Recurrence {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  interval: number;
  endDate?: Date;
  occurrences?: number;
}

export interface Budget {
  id: string;
  companyId: string;
  clientId: string;
  userId: string;
  number: number;
  status: BudgetStatus;
  items: BudgetItem[];
  subtotal: number;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  shipping?: number;
  total: number;
  notes?: string;
  conditions?: string;
  warranty?: string;
  validity: Date;
  paymentMethods?: string[];
  pixCode?: string;
  pixQrCode?: string;
  signatureUrl?: string;
  acceptedAt?: Date;
  acceptedIp?: string;
  acceptedLat?: number;
  acceptedLng?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type BudgetStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'cancelled' | 'expired';

export interface BudgetItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface FinancialRecord {
  id: string;
  companyId: string;
  clientId?: string;
  appointmentId?: string;
  budgetId?: string;
  type: 'revenue' | 'expense';
  category: string;
  description: string;
  value: number;
  paymentMethod: PaymentMethod;
  status: FinancialStatus;
  dueDate: Date;
  paidAt?: Date;
  installment?: number;
  totalInstallments?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PaymentMethod = 'pix' | 'cash' | 'credit_card' | 'debit_card' | 'boleto' | 'transfer';
export type FinancialStatus = 'pending' | 'paid' | 'partial' | 'overdue' | 'cancelled';

export interface Route {
  id: string;
  companyId: string;
  userId: string;
  date: Date;
  appointments: RouteAppointment[];
  totalDistance: number;
  totalDuration: number;
  fuelCost: number;
  optimized: boolean;
  createdAt: Date;
}

export interface RouteAppointment {
  appointmentId: string;
  order: number;
  estimatedArrival: string;
  distanceFromPrevious: number;
  durationFromPrevious: number;
}

export interface CRMActivity {
  id: string;
  companyId: string;
  clientId: string;
  userId: string;
  type: CRMActivityType;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export type CRMActivityType =
  | 'budget_sent'
  | 'budget_accepted'
  | 'budget_rejected'
  | 'service_completed'
  | 'payment_received'
  | 'appointment_scheduled'
  | 'appointment_cancelled'
  | 'call_made'
  | 'message_sent'
  | 'review_received'
  | 'note_added';

export interface PortfolioItem {
  id: string;
  companyId: string;
  title: string;
  description?: string;
  category: string;
  beforePhoto?: string;
  afterPhoto?: string;
  photos: string[];
  city?: string;
  duration?: number;
  clientName?: string;
  rating?: number;
  tags?: string[];
  public: boolean;
  createdAt: Date;
}

export interface Review {
  id: string;
  companyId: string;
  clientId: string;
  appointmentId: string;
  rating: number;
  comment?: string;
  photos?: string[];
  public: boolean;
  responded: boolean;
  response?: string;
  respondedAt?: Date;
  createdAt: Date;
}

export interface Automation {
  id: string;
  companyId: string;
  name: string;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AutomationTrigger =
  | 'appointment_created'
  | 'appointment_confirmed'
  | 'appointment_completed'
  | 'appointment_cancelled'
  | 'budget_created'
  | 'budget_accepted'
  | 'budget_rejected'
  | 'payment_received'
  | 'client_created'
  | 'review_received'
  | 'schedule';

export type AutomationActionType =
  | 'send_whatsapp'
  | 'send_email'
  | 'send_push'
  | 'create_reminder'
  | 'create_route'
  | 'update_status'
  | 'create_budget'
  | 'request_review';

export interface AutomationAction {
  type: AutomationActionType;
  config: Record<string, unknown>;
  order: number;
}

export interface TeamMember {
  id: string;
  companyId: string;
  userId: string;
  role: UserRole;
  permissions: Permission[];
  commission?: number;
  active: boolean;
  createdAt: Date;
}

export type Permission =
  | 'clients:read'
  | 'clients:write'
  | 'appointments:read'
  | 'appointments:write'
  | 'budgets:read'
  | 'budgets:write'
  | 'financial:read'
  | 'financial:write'
  | 'routes:read'
  | 'routes:write'
  | 'crm:read'
  | 'crm:write'
  | 'portfolio:read'
  | 'portfolio:write'
  | 'team:read'
  | 'team:write'
  | 'settings:read'
  | 'settings:write'
  | 'automations:read'
  | 'automations:write';

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
