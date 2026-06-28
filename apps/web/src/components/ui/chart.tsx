'use client';

import * as React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts';
import { cn } from '@/lib/utils';

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactElement;
}

function ChartContainer({ children, className, ...props }: ChartContainerProps) {
  return (
    <div className={cn('w-full h-[300px]', className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
  formatter?: (value: number) => string;
}

function ChartTooltipContent({ active, payload, label, formatter }: ChartTooltipContentProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background p-3 shadow-sm">
      {label && <p className="mb-2 text-xs font-medium text-muted-foreground">{label}</p>}
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium">
            {formatter ? formatter(entry.value) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function ChartLegendContent({ payload }: { payload?: Array<{ value: string; color: string }> }) {
  if (!payload?.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-4 pt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          {entry.value}
        </div>
      ))}
    </div>
  );
}

interface AreaChartProps {
  data: Array<Record<string, unknown>>;
  categories: string[];
  index: string;
  colors?: string[];
  showGradient?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
  valueFormatter?: (value: number) => string;
  className?: string;
}

function ChartArea({
  data,
  categories,
  index,
  colors = ['hsl(var(--primary))'],
  showGradient = true,
  showLegend = true,
  showTooltip = true,
  showGrid = false,
  valueFormatter,
  className,
}: AreaChartProps) {
  return (
    <ChartContainer className={className}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />}
        <XAxis
          dataKey={index}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="text-xs text-muted-foreground"
        />
        <YAxis tickLine={false} axisLine={false} className="text-xs text-muted-foreground" />
        {showTooltip && (
          <Tooltip
            content={<ChartTooltipContent formatter={valueFormatter} />}
            cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }}
          />
        )}
        {showLegend && <Legend content={<ChartLegendContent />} />}
        {categories.map((cat, idx) => (
          <defs key={`gradient-${idx}`}>
            <linearGradient id={`chart-gradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors[idx % colors.length]} stopOpacity={0.3} />
              <stop offset="95%" stopColor={colors[idx % colors.length]} stopOpacity={0} />
            </linearGradient>
          </defs>
        ))}
        {categories.map((cat, idx) => (
          <Area
            key={cat}
            type="monotone"
            dataKey={cat}
            stroke={colors[idx % colors.length]}
            strokeWidth={2}
            fill={showGradient ? `url(#chart-gradient-${idx})` : 'transparent'}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}

interface BarChartProps {
  data: Array<Record<string, unknown>>;
  categories: string[];
  index: string;
  colors?: string[];
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
  valueFormatter?: (value: number) => string;
  className?: string;
}

function ChartBar({
  data,
  categories,
  index,
  colors = ['hsl(var(--primary))', 'hsl(var(--destructive))'],
  showLegend = true,
  showTooltip = true,
  showGrid = false,
  valueFormatter,
  className,
}: BarChartProps) {
  return (
    <ChartContainer className={className}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />}
        <XAxis
          dataKey={index}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="text-xs text-muted-foreground"
        />
        <YAxis tickLine={false} axisLine={false} className="text-xs text-muted-foreground" />
        {showTooltip && (
          <Tooltip
            content={<ChartTooltipContent formatter={valueFormatter} />}
            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
          />
        )}
        {showLegend && <Legend content={<ChartLegendContent />} />}
        {categories.map((cat, idx) => (
          <Bar
            key={cat}
            dataKey={cat}
            fill={colors[idx % colors.length]}
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}

export {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
  ChartArea,
  ChartBar,
  AreaChart,
  BarChart,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
};
