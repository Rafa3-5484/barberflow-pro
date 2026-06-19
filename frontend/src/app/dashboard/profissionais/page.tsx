'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  User,
  Plus,
  Phone,
  Mail,
  Percent,
  Star,
  Calendar,
  TrendingUp,
  ToggleLeft,
  ToggleRight,
  Search,
  LayoutGrid,
  List,
  X,
  DollarSign,
  Clock,
  Check,
  X as XIcon,
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
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { useProfessionals } from '@/hooks/use-professionals'
import { useAppointmentsByProfessional } from '@/hooks/use-appointments'
import { useDashboardKPIs } from '@/hooks/use-dashboard'
import type { Professional } from '@/types'

export default function ProfissionaisPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [search, setSearch] = useState('')
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null)
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)

  const { data: professionals, isLoading } = useProfessionals()
  const { data: kpis } = useDashboardKPIs()

  const filteredProfessionals = useMemo(() => {
    if (!professionals) return []
    if (!search) return professionals
    const q = search.toLowerCase()
    return professionals.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.specialties.some((s) => s.toLowerCase().includes(q)) ||
        p.phone.includes(q)
    )
  }, [professionals, search])

  const stats = useMemo(() => {
    if (!professionals) {
      return { total: 0, active: 0, avgCommission: 0, todayAppointments: 0 }
    }
    const active = professionals.filter((p) => p.active).length
    const avgCommission =
      professionals.length > 0
        ? professionals.reduce((acc, p) => acc + p.commission, 0) / professionals.length
        : 0
    return {
      total: professionals.length,
      active,
      avgCommission,
      todayAppointments: kpis?.todayAppointments ?? 0,
    }
  }, [professionals, kpis])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">Profissionais</h1>
          <p className="text-sm text-zinc-500">Gerencie sua equipe de profissionais</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg bg-zinc-900 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'rounded-md p-1.5 transition-all',
                viewMode === 'grid' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                'rounded-md p-1.5 transition-all',
                viewMode === 'table' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <Button
            size="sm"
            className="gap-1.5 bg-amber-500 text-black hover:bg-amber-400"
            onClick={() => setShowNewDialog(true)}
          >
            <Plus className="h-4 w-4" />
            Novo Profissional
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <User className="h-4 w-4 text-blue-400" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-zinc-500">Total Profissionais</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-green-500/10 p-2">
                <Check className="h-4 w-4 text-green-400" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{stats.active}</p>
            <p className="text-xs text-zinc-500">Ativos</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-purple-500/10 p-2">
                <Percent className="h-4 w-4 text-purple-400" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{stats.avgCommission.toFixed(1)}%</p>
            <p className="text-xs text-zinc-500">Comissão Média</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-amber-500/10 p-2">
                <Calendar className="h-4 w-4 text-amber-400" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{stats.todayAppointments}</p>
            <p className="text-xs text-zinc-500">Agendamentos Hoje</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          placeholder="Buscar profissional..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 border-zinc-800 bg-zinc-900 pl-9 text-zinc-300 placeholder:text-zinc-600"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProfessionals.map((prof) => (
            <motion.div
              key={prof.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className="group cursor-pointer border-zinc-800 bg-zinc-900 transition-all hover:border-amber-500/30"
                onClick={() => setSelectedProfessional(prof)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800 text-amber-400">
                      {prof.photo ? (
                        <img src={prof.photo} alt={prof.name} className="h-14 w-14 rounded-full object-cover" />
                      ) : (
                        <User className="h-7 w-7" />
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      className="text-zinc-600 hover:text-zinc-400"
                    >
                      {prof.active ? (
                        <ToggleRight className="h-5 w-5 text-green-400" />
                      ) : (
                        <ToggleLeft className="h-5 w-5 text-zinc-600" />
                      )}
                    </button>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-zinc-200">{prof.name}</h3>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {prof.specialties.map((s) => (
                      <Badge key={s} variant="secondary" className="bg-amber-500/10 text-amber-400 text-[10px]">
                        {s}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-3 space-y-1.5 text-xs text-zinc-500">
                    <p className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {prof.phone}
                    </p>
                    {prof.email && (
                      <p className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {prof.email}
                      </p>
                    )}
                    <p className="flex items-center gap-1">
                      <Percent className="h-3 w-3 text-amber-400" />
                      <span className="text-amber-400">{prof.commission}% comissão</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {filteredProfessionals.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <User className="mb-3 h-10 w-10 text-zinc-600" />
              <p className="text-sm text-zinc-500">Nenhum profissional encontrado</p>
            </div>
          )}
        </div>
      ) : (
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800">
                  <TableHead className="text-zinc-500">Nome</TableHead>
                  <TableHead className="text-zinc-500">Especialidades</TableHead>
                  <TableHead className="text-zinc-500">Comissão</TableHead>
                  <TableHead className="text-zinc-500">Telefone</TableHead>
                  <TableHead className="text-zinc-500">Status</TableHead>
                  <TableHead className="text-zinc-500">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfessionals.map((prof) => (
                  <TableRow key={prof.id} className="border-zinc-800">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-amber-400">
                          {prof.photo ? (
                            <img src={prof.photo} alt={prof.name} className="h-8 w-8 rounded-full object-cover" />
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                        </div>
                        <span className="font-medium text-zinc-200">{prof.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {prof.specialties.map((s) => (
                          <Badge key={s} variant="secondary" className="bg-amber-500/10 text-amber-400 text-[10px]">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-amber-400">{prof.commission}%</TableCell>
                    <TableCell className="text-zinc-400">{prof.phone}</TableCell>
                    <TableCell>
                      <Badge variant={prof.active ? 'default' : 'outline'} className={cn(prof.active ? 'bg-green-500/10 text-green-400' : 'text-zinc-500')}>
                        {prof.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="xs" onClick={() => setEditingProfessional(prof)} className="text-zinc-400 hover:text-zinc-200">
                          Editar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredProfessionals.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-zinc-500">
                      Nenhum profissional encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!editingProfessional} onOpenChange={(open) => !open && setEditingProfessional(null)}>
        <DialogContent className="max-w-md border-zinc-800 bg-zinc-900 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Editar Profissional</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Atualize as informações do profissional
            </DialogDescription>
          </DialogHeader>
          {editingProfessional && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-amber-400">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-200">{editingProfessional.name}</p>
                  <p className="text-xs text-zinc-500">{editingProfessional.specialties.join(', ')}</p>
                </div>
              </div>
              <Separator className="bg-zinc-800" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-zinc-400">Nome</Label>
                  <Input defaultValue={editingProfessional.name} className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
                </div>
                <div>
                  <Label className="text-xs text-zinc-400">Telefone</Label>
                  <Input defaultValue={editingProfessional.phone} className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-zinc-400">Email</Label>
                  <Input defaultValue={editingProfessional.email || ''} className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
                </div>
                <div>
                  <Label className="text-xs text-zinc-400">Comissão (%)</Label>
                  <Input defaultValue={editingProfessional.commission} type="number" className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
                </div>
                <div className="flex items-end pb-2">
                  <Button variant="outline" className="w-full border-zinc-700 text-zinc-300">
                    {editingProfessional.active ? 'Desativar' : 'Ativar'}
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setEditingProfessional(null)} className="border-zinc-700 text-zinc-300">
              Cancelar
            </Button>
            <Button className="bg-amber-500 text-black hover:bg-amber-400">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="max-w-md border-zinc-800 bg-zinc-900 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Novo Profissional</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Cadastre um novo profissional na barbearia
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-zinc-400">Nome</Label>
              <Input placeholder="Nome completo" className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
            </div>
            <div>
              <Label className="text-xs text-zinc-400">URL da Foto</Label>
              <Input placeholder="https://..." className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
            </div>
            <div>
              <Label className="text-xs text-zinc-400">Especialidades</Label>
              <Input placeholder="Corte, Barba, Hidratação..." className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
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
            <div>
              <Label className="text-xs text-zinc-400">Comissão (%)</Label>
              <Input type="number" placeholder="40" className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300">
                Ativo
              </Button>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowNewDialog(false)} className="border-zinc-700 text-zinc-300">
              Cancelar
            </Button>
            <Button className="bg-amber-500 text-black hover:bg-amber-400">Cadastrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedProfessional} onOpenChange={(open) => !open && setSelectedProfessional(null)}>
        <DialogContent className="max-w-xl border-zinc-800 bg-zinc-900 text-zinc-100">
          {selectedProfessional && (
            <>
              <DialogHeader>
                <DialogTitle className="text-zinc-100">{selectedProfessional.name}</DialogTitle>
                <DialogDescription className="text-zinc-500">
                  Detalhes e desempenho do profissional
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-amber-400">
                    {selectedProfessional.photo ? (
                      <img src={selectedProfessional.photo} alt={selectedProfessional.name} className="h-16 w-16 rounded-full object-cover" />
                    ) : (
                      <User className="h-8 w-8" />
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-1">
                      {selectedProfessional.specialties.map((s) => (
                        <Badge key={s} variant="secondary" className="bg-amber-500/10 text-amber-400">{s}</Badge>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{selectedProfessional.phone}</span>
                      {selectedProfessional.email && (
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{selectedProfessional.email}</span>
                      )}
                      <span className="flex items-center gap-1 text-amber-400"><Percent className="h-3 w-3" />{selectedProfessional.commission}%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-zinc-800/50 p-3 text-center">
                    <p className="text-lg font-bold text-zinc-200">12</p>
                    <p className="text-xs text-zinc-500">Agendamentos Hoje</p>
                  </div>
                  <div className="rounded-lg bg-zinc-800/50 p-3 text-center">
                    <p className="text-lg font-bold text-green-400">{formatCurrency(580)}</p>
                    <p className="text-xs text-zinc-500">Faturamento Hoje</p>
                  </div>
                  <div className="rounded-lg bg-zinc-800/50 p-3 text-center">
                    <p className="text-lg font-bold text-amber-400">{formatCurrency(232)}</p>
                    <p className="text-xs text-zinc-500">Comissão Acumulada</p>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium text-zinc-300">Agendamentos Recentes</h4>
                  <ProfessionalAppointments professionalId={selectedProfessional.id} />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

function ProfessionalAppointments({ professionalId }: { professionalId: string }) {
  const { data: appointments, isLoading } = useAppointmentsByProfessional(professionalId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    )
  }

  if (!appointments || appointments.length === 0) {
    return <p className="py-4 text-center text-xs text-zinc-500">Nenhum agendamento encontrado</p>
  }

  return (
    <div className="space-y-2">
      {appointments.slice(0, 5).map((apt) => (
        <div key={apt.id} className="flex items-center justify-between rounded-lg bg-zinc-800/30 p-2.5">
          <div>
            <p className="text-sm font-medium text-zinc-200">{apt.client?.name}</p>
            <p className="text-xs text-zinc-500">{apt.service?.name}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-400">{format(new Date(apt.date), 'dd/MM HH:mm')}</p>
            <Badge variant="outline" className="mt-0.5 text-[10px]">
              {apt.status === 'COMPLETED' ? 'Concluído' : apt.status === 'SCHEDULED' ? 'Agendado' : apt.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
