'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Search,
  Plus,
  Download,
  Users,
  UserPlus,
  Repeat,
  DollarSign,
  Phone,
  Mail,
  Calendar,
  Clock,
  Star,
  FileText,
  X,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn, formatCurrency } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { useClients, useClientSearch } from '@/hooks/use-clients'
import { useDashboardKPIs } from '@/hooks/use-dashboard'
import type { Client } from '@/types'

export default function ClientesPage() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showNewDialog, setShowNewDialog] = useState(false)

  const { data: clients, isLoading } = useClients()
  const { data: searchResults } = useClientSearch(debouncedSearch)
  const { data: kpis } = useDashboardKPIs()

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const onSearchChange = useCallback((value: string) => {
    setSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value)
    }, 400)
  }, [])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const displayClients = useMemo(() => {
    if (debouncedSearch.length >= 2) return searchResults || []
    return clients || []
  }, [clients, searchResults, debouncedSearch])

  const stats = useMemo(() => ({
    total: clients?.length || 0,
    new: kpis?.newClients ?? 0,
    recurring: kpis?.recurringClients ?? 0,
    avgTicket: kpis?.averageTicket ?? 0,
  }), [clients, kpis])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">Clientes</h1>
          <p className="text-sm text-zinc-500">Gerencie sua base de clientes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 border-zinc-800 text-zinc-300">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button
            size="sm"
            className="gap-1.5 bg-amber-500 text-black hover:bg-amber-400"
            onClick={() => setShowNewDialog(true)}
          >
            <Plus className="h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <Users className="h-4 w-4 text-blue-400" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-zinc-500">Total Clientes</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-green-500/10 p-2">
                <UserPlus className="h-4 w-4 text-green-400" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{stats.new}</p>
            <p className="text-xs text-zinc-500">Clientes Novos (mês)</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-purple-500/10 p-2">
                <Repeat className="h-4 w-4 text-purple-400" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{stats.recurring}</p>
            <p className="text-xs text-zinc-500">Clientes Recorrentes</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-amber-500/10 p-2">
                <DollarSign className="h-4 w-4 text-amber-400" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{formatCurrency(stats.avgTicket)}</p>
            <p className="text-xs text-zinc-500">Ticket Médio</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          placeholder="Buscar cliente por nome, telefone ou email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 border-zinc-800 bg-zinc-900 pl-9 text-zinc-300 placeholder:text-zinc-600"
        />
      </div>

      <Card className="border-zinc-800 bg-zinc-900">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800">
                <TableHead className="text-zinc-500">Nome</TableHead>
                <TableHead className="text-zinc-500">Telefone</TableHead>
                <TableHead className="text-zinc-500 hidden md:table-cell">Email</TableHead>
                <TableHead className="text-zinc-500 hidden lg:table-cell">Última Visita</TableHead>
                <TableHead className="text-zinc-500 hidden lg:table-cell">Total Visitas</TableHead>
                <TableHead className="text-zinc-500 hidden sm:table-cell">Total Gasto</TableHead>
                <TableHead className="text-zinc-500">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-zinc-500">
                    <div className="flex items-center justify-center py-4">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : displayClients.length > 0 ? (
                displayClients.map((client) => (
                  <TableRow
                    key={client.id}
                    className="border-zinc-800 cursor-pointer hover:bg-zinc-800/30"
                    onClick={() => setSelectedClient(client)}
                  >
                    <TableCell className="font-medium text-zinc-200">{client.name}</TableCell>
                    <TableCell className="text-zinc-400">{client.phone}</TableCell>
                    <TableCell className="text-zinc-400 hidden md:table-cell">{client.email || '---'}</TableCell>
                    <TableCell className="text-zinc-400 hidden lg:table-cell">
                      {client.lastVisit
                        ? format(new Date(client.lastVisit), 'dd/MM/yyyy')
                        : '---'}
                    </TableCell>
                    <TableCell className="text-zinc-400 hidden lg:table-cell">{client.totalVisits}</TableCell>
                    <TableCell className="text-zinc-400 hidden sm:table-cell">
                      {formatCurrency(client.totalSpent)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="xs"
                        className="text-zinc-400 hover:text-zinc-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedClient(client)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-zinc-500 py-8">
                    {debouncedSearch.length >= 2
                      ? 'Nenhum cliente encontrado para esta busca'
                      : 'Nenhum cliente cadastrado'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={!!selectedClient} onOpenChange={(open) => !open && setSelectedClient(null)}>
        <SheetContent className="w-full border-zinc-800 bg-zinc-900 text-zinc-100 sm:max-w-md">
          {selectedClient && (
            <>
              <SheetHeader>
                <SheetTitle className="text-zinc-100">{selectedClient.name}</SheetTitle>
                <SheetDescription className="text-zinc-500">
                  Cliente desde {format(new Date(selectedClient.createdAt), 'dd/MM/yyyy')}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-zinc-800/50 p-3 text-center">
                    <p className="text-2xl font-bold text-zinc-200">{selectedClient.totalVisits}</p>
                    <p className="text-xs text-zinc-500">Total de Visitas</p>
                  </div>
                  <div className="rounded-lg bg-zinc-800/50 p-3 text-center">
                    <p className="text-2xl font-bold text-amber-400">{formatCurrency(selectedClient.totalSpent)}</p>
                    <p className="text-xs text-zinc-500">Total Gasto</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-zinc-300">Informações de Contato</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Phone className="h-4 w-4" />
                      {selectedClient.phone}
                    </div>
                    {selectedClient.email && (
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Mail className="h-4 w-4" />
                        {selectedClient.email}
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="bg-zinc-800" />

                <div>
                  <h4 className="mb-3 text-sm font-medium text-zinc-300">Histórico de Agendamentos</h4>
                  <ClientAppointmentHistory clientId={selectedClient.id} />
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium text-zinc-300">Observações</h4>
                  <div className="rounded-lg bg-zinc-800/30 p-3">
                    <p className="text-sm text-zinc-500 italic">Nenhuma observação registrada.</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="max-w-md border-zinc-800 bg-zinc-900 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Novo Cliente</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Cadastre um novo cliente na barbearia
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-zinc-400">Nome</Label>
              <Input placeholder="Nome completo" className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-zinc-400">Telefone</Label>
                <Input placeholder="(11) 99999-8888" className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
              </div>
              <div>
                <Label className="text-xs text-zinc-400">Email</Label>
                <Input placeholder="email@exemplo.com" className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)} className="border-zinc-700 text-zinc-300">
              Cancelar
            </Button>
            <Button className="bg-amber-500 text-black hover:bg-amber-400">Cadastrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

function ClientAppointmentHistory({ clientId }: { clientId: string }) {
  const { data: clients } = useClients()
  const client = clients?.find((c) => c.id === clientId)

  const mockHistory = [
    { date: '2026-06-18T14:00:00', service: 'Corte Degradê', professional: 'Carlos', value: 55 },
    { date: '2026-06-10T10:30:00', service: 'Barba', professional: 'Carlos', value: 30 },
    { date: '2026-05-28T15:00:00', service: 'Corte + Barba', professional: 'Ana', value: 75 },
    { date: '2026-05-15T11:00:00', service: 'Corte Degradê', professional: 'Carlos', value: 55 },
  ]

  return (
    <div className="space-y-2">
      {mockHistory.map((item, i) => (
        <div key={i} className="flex items-center justify-between rounded-lg bg-zinc-800/30 p-2.5">
          <div>
            <p className="text-sm font-medium text-zinc-200">{item.service}</p>
            <p className="text-xs text-zinc-500">{item.professional}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-400">
              {format(new Date(item.date), "dd 'de' MMM", { locale: ptBR as any })}
            </p>
            <p className="text-xs text-amber-400">{formatCurrency(item.value)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
