'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive';
  className?: string;
}

const variantStyles = {
  default: 'bg-card border-border',
  primary: 'bg-primary/5 border-primary/20',
  success: 'bg-green-500/5 border-green-500/20',
  warning: 'bg-amber-500/5 border-amber-500/20',
  destructive: 'bg-red-500/5 border-red-500/20',
};

const iconStyles = {
  default: 'text-muted-foreground',
  primary: 'text-primary',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-amber-600 dark:text-amber-400',
  destructive: 'text-red-600 dark:text-red-400',
};

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    let start = 0;
    const duration = 800;
    const startTime = Date.now();
    const endValue = value;

    function update() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * endValue);
      setDisplay(start);
      if (progress < 1) requestAnimationFrame(update);
    }
    update();
  }, [value]);

  return <span ref={ref}>{display.toLocaleString('pt-BR')}</span>;
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  trend,
  trendLabel,
  variant = 'default',
  className,
}: StatsCardProps) {
  const isNumericValue = typeof value === 'number' || !isNaN(Number(value));
  const numericValue = typeof value === 'number' ? value : Number(String(value).replace(/[^\d,.-]/g, '').replace(',', '.'));
  const isCurrency = typeof value === 'string' && value.includes('R$');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -2, scale: 1.01 }}
      className={cn(
        'relative overflow-hidden rounded-xl border p-5 shadow-sm backdrop-blur-xl transition-all duration-200 hover:shadow-md',
        variantStyles[variant],
        'group',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="text-2xl font-bold tracking-tight">
            {isCurrency && 'R$ '}
            {isNumericValue && !isCurrency ? (
              <AnimatedNumber value={numericValue} />
            ) : (
              value
            )}
          </p>
          {trend !== undefined && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  'text-xs font-medium',
                  trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
                )}
              >
                {trend >= 0 ? '+' : ''}
                {trend}%
              </span>
              {trendLabel && (
                <span className="text-xs text-muted-foreground">{trendLabel}</span>
              )}
            </div>
          )}
        </div>
        <div
          className={cn(
            'rounded-xl p-3 transition-colors duration-200 group-hover:scale-110',
            iconStyles[variant],
            'bg-background/50',
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
