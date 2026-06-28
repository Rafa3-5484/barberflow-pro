'use client';

import { motion } from 'framer-motion';
import { Send, MoreHorizontal, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrency, formatDate, daysBetween } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const budgets = [
  { id: '1', client: 'Maria Oliveira', value: 850, sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: 'sent' },
  { id: '2', client: 'João Santos', value: 1200, sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), status: 'viewed' },
  { id: '3', client: 'Ana Costa', value: 540, sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), status: 'sent' },
  { id: '4', client: 'Pedro Alves', value: 2300, sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), status: 'sent' },
];

const statusLabel: Record<string, string> = { sent: 'Enviado', viewed: 'Visualizado' };
const statusVariant: Record<string, 'warning' | 'info'> = { sent: 'warning', viewed: 'info' };

export function PendingBudgets() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg">Orçamentos Pendentes</CardTitle>
        <Button variant="ghost" size="sm" className="text-xs">
          Ver todos
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[280px] px-6 pb-4">
          <div className="space-y-2">
            {budgets.map((budget, idx) => (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{budget.client}</span>
                    <Badge variant={statusVariant[budget.status]} className="text-[10px] px-1.5 py-0">
                      {statusLabel[budget.status]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-sm font-semibold text-primary">
                      {formatCurrency(budget.value)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      há {daysBetween(budget.sentAt, new Date())} dias
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon-sm">
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Eye className="h-4 w-4" /> Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Send className="h-4 w-4" /> Enviar lembrete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
