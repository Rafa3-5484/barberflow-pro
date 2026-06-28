import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPhone,
  formatDocument,
  isValidPhone,
  isValidEmail,
  isValidDocument,
  generateId,
  slugify,
  calculateDistance,
  cn as cnShared,
  debounce,
  truncate,
  getInitials,
  daysBetween,
  addDays,
  isToday,
  isPast,
  timeToMinutes,
  minutesToTime,
  getMonthDays,
  weekDayName,
  monthName,
  APPOINTMENT_STATUS,
  BUDGET_STATUS,
  FINANCIAL_STATUS,
  PAYMENT_METHODS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  SERVICE_TYPES,
  CURRENCY,
} from '@serviceflow/shared';
