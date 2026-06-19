'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Bell,
  Info,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  CheckCheck,
  Trash2,
  Mail,
  MailOpen,
  Inbox,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import type { Notification } from '@/types'

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Novo agendamento',
    message: 'Carlos Silva agendou um Corte Degradê com Carlos para amanhã às 14:00.',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: '2',
    title: 'Cancelamento',
    message: 'Maria Oliveira cancelou o agendamento de Barba com Ana para hoje às 16:00.',
    type: 'warning',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    title: 'Pagamento confirmado',
    message: 'Pagamento de R$ 75,00 via PIX confirmado para o serviço Corte + Barba de Pedro Santos.',
    type: 'success',
    read: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '4',
    title: 'Estoque baixo',
    message: 'O produto Shampoo Profissional está com estoque baixo (3 unidades).',
    type: 'error',
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '5',
    title: 'Cliente frequente',
    message: 'Lucas Oliveira completou 20 visitas na barbearia! Que tal oferecer um desconto especial?',
    type: 'success',
    read: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '6',
    title: 'Avaliação recebida',
    message: 'Ana Costa avaliou o serviço de Corte Degradê com 5 estrelas.',
    type: 'info',
    read: true,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: '7',
    title: 'Produto próximo ao vencimento',
    message: 'O produto Máscara Capilar vence em 15 dias. Considere usar ou renovar o estoque.',
    type: 'warning',
    read: true,
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: '8',
    title: 'Fechamento de caixa',
    message: 'O caixa do dia 18/06 foi fechado com saldo de R$ 1.560,00.',
    type: 'info',
    read: true,
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  },
]

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  success: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
  error: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
}

export default function NotificacoesPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    setDeletingId(null)
  }

  const sorted = useMemo(() => {
    return [...notifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [notifications])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-semibold text-zinc-100">
            Notificações
            {unreadCount > 0 && (
              <Badge className="bg-amber-500 text-black">{unreadCount} novas</Badge>
            )}
          </h1>
          <p className="text-sm text-zinc-500">
            {notifications.length > 0
              ? `Total de ${notifications.length} notificações`
              : 'Nenhuma notificação'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-zinc-800 text-zinc-300"
            onClick={markAllAsRead}
          >
            <CheckCheck className="h-4 w-4" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {sorted.length === 0 ? (
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Inbox className="mb-3 h-12 w-12 text-zinc-600" />
            <p className="text-sm font-medium text-zinc-400">Nenhuma notificação</p>
            <p className="text-xs text-zinc-500">
              Você não possui notificações no momento
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {sorted.map((notification) => {
            const config = typeConfig[notification.type] || typeConfig.info
            const Icon = config.icon
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={cn(
                    'border transition-all',
                    notification.read
                      ? 'border-zinc-800 bg-zinc-900'
                      : 'border-amber-500/20 bg-amber-500/[0.02]'
                  )}
                >
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', config.bg)}>
                      <Icon className={cn('h-5 w-5', config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className={cn(
                            'text-sm truncate',
                            notification.read ? 'text-zinc-300' : 'font-medium text-zinc-100'
                          )}>
                            {notification.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-zinc-500 whitespace-nowrap">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                              locale: ptBR as any,
                            })}
                          </span>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => markAsRead(notification.id)}
                              className="text-zinc-400 hover:text-zinc-200"
                              title="Marcar como lida"
                            >
                              <MailOpen className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => setDeletingId(notification.id)}
                            className="text-zinc-400 hover:text-red-400"
                            title="Excluir"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-zinc-500 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="mt-1.5 text-xs text-zinc-600">
                        {format(new Date(notification.createdAt), "dd 'de' MMMM 'às' HH:mm", {
                          locale: ptBR as any,
                        })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="max-w-sm border-zinc-800 bg-zinc-900 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Excluir Notificação</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Tem certeza que deseja excluir esta notificação?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingId(null)} className="border-zinc-700 text-zinc-300">
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="gap-1.5"
              onClick={() => deletingId && deleteNotification(deletingId)}
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
