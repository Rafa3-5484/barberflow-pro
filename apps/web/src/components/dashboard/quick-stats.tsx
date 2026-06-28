'use client';

import { CalendarCheck, FileText, Wallet, Clock } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/stats-card';

export function QuickStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      <StatsCard
        icon={CalendarCheck}
        label="Atendimentos Hoje"
        value={8}
        trend={12}
        trendLabel="vs. ontem"
        variant="primary"
      />
      <StatsCard
        icon={FileText}
        label="Orçamentos Pendentes"
        value={3}
        trend={-5}
        trendLabel="vs. semana passada"
        variant="warning"
      />
      <StatsCard
        icon={Wallet}
        label="Para Receber"
        value="R$ 2.350"
        trend={8}
        trendLabel="vs. mês passado"
        variant="success"
      />
      <StatsCard
        icon={Clock}
        label="Confirmações Pendentes"
        value={4}
        trend={0}
        trendLabel="sem alterações"
        variant="default"
      />
    </div>
  );
}
