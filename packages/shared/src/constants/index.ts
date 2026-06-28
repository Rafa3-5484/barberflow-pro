export const APP_NAME = 'ServiceFlow AI';
export const APP_SLOGAN = 'Automatize seu atendimento. Organize seu trabalho. Receba mais rápido.';
export const APP_VERSION = '1.0.0';

export const PLAN_LIMITS: Record<string, { clients: number; team: number; automations: number }> = {
  starter: { clients: 100, team: 1, automations: 5 },
  professional: { clients: Infinity, team: 10, automations: 50 },
  enterprise: { clients: Infinity, team: Infinity, automations: Infinity },
};

export const APPOINTMENT_STATUS: Record<string, string> = {
  scheduled: 'Agendado',
  confirmed: 'Confirmado',
  in_progress: 'Em Andamento',
  completed: 'Concluído',
  cancelled: 'Cancelado',
  rescheduled: 'Reagendado',
};

export const BUDGET_STATUS: Record<string, string> = {
  draft: 'Rascunho',
  sent: 'Enviado',
  viewed: 'Visualizado',
  accepted: 'Aceito',
  rejected: 'Recusado',
  cancelled: 'Cancelado',
  expired: 'Expirado',
};

export const FINANCIAL_STATUS: Record<string, string> = {
  pending: 'Pendente',
  paid: 'Pago',
  partial: 'Parcial',
  overdue: 'Vencido',
  cancelled: 'Cancelado',
};

export const PAYMENT_METHODS: Record<string, string> = {
  pix: 'PIX',
  cash: 'Dinheiro',
  credit_card: 'Cartão de Crédito',
  debit_card: 'Cartão de Débito',
  boleto: 'Boleto',
  transfer: 'Transferência',
};

export const SERVICE_TYPES = [
  'Instalação',
  'Manutenção',
  'Reparo',
  'Limpeza',
  'Inspeção',
  'Orçamento',
  'Urgência',
  'Outro',
];

export const PRIORITY_LABELS: Record<string, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente',
};

export const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  high: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

export const DEFAULT_WORKING_HOURS = {
  monday: { active: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
  tuesday: { active: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
  wednesday: { active: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
  thursday: { active: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
  friday: { active: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
  saturday: { active: true, start: '08:00', end: '12:00' },
  sunday: { active: false, start: '08:00', end: '12:00' },
};

export const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

export const REMINDER_INTERVALS = [
  { label: '30 minutos antes', value: 30 },
  { label: '1 hora antes', value: 60 },
  { label: '2 horas antes', value: 120 },
  { label: '24 horas antes', value: 1440 },
  { label: '48 horas antes', value: 2880 },
];

export const CURRENCY = {
  locale: 'pt-BR',
  code: 'BRL',
  symbol: 'R$',
};
