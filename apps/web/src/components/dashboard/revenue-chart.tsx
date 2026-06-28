'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartArea } from '@/components/ui/chart';
import { formatCurrency } from '@/lib/utils';

const monthlyRevenue = [
  { month: 'Jan', receita: 4200, despesa: 2800 },
  { month: 'Fev', receita: 3800, despesa: 2600 },
  { month: 'Mar', receita: 5100, despesa: 3100 },
  { month: 'Abr', receita: 4800, despesa: 2900 },
  { month: 'Mai', receita: 5600, despesa: 3300 },
  { month: 'Jun', receita: 4900, despesa: 3000 },
];

export function RevenueChart() {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg">Receita vs Despesas</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartArea
          data={monthlyRevenue}
          categories={['receita', 'despesa']}
          index="month"
          colors={['hsl(142.1, 76.2%, 36.3%)', 'hsl(0, 84.2%, 60.2%)']}
          valueFormatter={(v) => formatCurrency(v)}
          showLegend
          showGrid
        />
      </CardContent>
    </Card>
  );
}
