'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings,
  Building,
  Users,
  Scissors,
  Link,
  Bell,
  Palette,
  Save,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Sun,
  Moon,
  Monitor,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const tabs = [
  { id: 'general', label: 'Geral', icon: Building },
  { id: 'team', label: 'Equipe', icon: Users },
  { id: 'services', label: 'Serviços', icon: Scissors },
  { id: 'integrations', label: 'Integrações', icon: Link },
  { id: 'notifications', label: 'Notificações', icon: Bell },
  { id: 'appearance', label: 'Aparência', icon: Palette },
]

const accentColors = [
  { name: 'Âmbar', value: '#f59e0b' },
  { name: 'Verde', value: '#10b981' },
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Roxo', value: '#8b5cf6' },
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Vermelho', value: '#ef4444' },
  { name: 'Ciano', value: '#06b6d4' },
  { name: 'Laranja', value: '#f97316' },
]

const teamMembers = [
  { id: '1', name: 'Admin', email: 'admin@barberflow.com', role: 'ADMIN', active: true },
  { id: '2', name: 'Carlos Silva', email: 'carlos@barberflow.com', role: 'BARBER', active: true },
  { id: '3', name: 'Ana Costa', email: 'ana@barberflow.com', role: 'BARBER', active: true },
  { id: '4', name: 'Pedro Santos', email: 'pedro@barberflow.com', role: 'MANAGER', active: true },
  { id: '5', name: 'Maria Oliveira', email: 'maria@barberflow.com', role: 'CASHIER', active: false },
]

const roleLabels: Record<string, string> = {
  ADMIN: 'Administrador',
  MANAGER: 'Gerente',
  BARBER: 'Barbeiro',
  CASHIER: 'Caixa',
}

const servicesList = [
  { id: '1', name: 'Corte Degradê', price: 55, duration: 40, active: true },
  { id: '2', name: 'Barba', price: 30, duration: 20, active: true },
  { id: '3', name: 'Corte + Barba', price: 75, duration: 60, active: true },
  { id: '4', name: 'Hidratação', price: 70, duration: 45, active: true },
  { id: '5', name: 'Sobrancelha', price: 20, duration: 15, active: false },
]

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [showServiceDialog, setShowServiceDialog] = useState(false)
  const [showTeamDialog, setShowTeamDialog] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-lg font-semibold text-zinc-100">Configurações</h1>
        <p className="text-sm text-zinc-500">Gerencie as configurações da barbearia</p>
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-lg bg-zinc-900 p-1">
        {tabs.map((tab) => {
          const TabIcon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all whitespace-nowrap',
                activeTab === tab.id
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              <TabIcon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'general' && <GeneralSettings />}
      {activeTab === 'team' && (
        <TeamSettings
          onInvite={() => setShowTeamDialog(true)}
          showInviteDialog={showTeamDialog}
          onCloseInvite={() => setShowTeamDialog(false)}
        />
      )}
      {activeTab === 'services' && (
        <ServiceSettings
          onAdd={() => setShowServiceDialog(true)}
          showAddDialog={showServiceDialog}
          onCloseAdd={() => setShowServiceDialog(false)}
        />
      )}
      {activeTab === 'integrations' && <IntegrationSettings />}
      {activeTab === 'notifications' && <NotificationSettings />}
      {activeTab === 'appearance' && <AppearanceSettings />}
    </motion.div>
  )
}

function GeneralSettings() {
  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-zinc-200">Informações da Barbearia</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <Label className="text-xs text-zinc-400">Nome da Barbearia</Label>
            <Input
              defaultValue="BarberFlow Pro"
              className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300"
            />
          </div>
          <div>
            <Label className="text-xs text-zinc-400">Telefone</Label>
            <Input
              defaultValue="(11) 99999-8888"
              className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300"
            />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs text-zinc-400">Endereço</Label>
            <Input
              defaultValue="Rua Augusta, 1500 - Consolação, São Paulo - SP"
              className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300"
            />
          </div>
          <div>
            <Label className="text-xs text-zinc-400">Email</Label>
            <Input
              defaultValue="contato@barberflow.com"
              type="email"
              className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300"
            />
          </div>
          <div>
            <Label className="text-xs text-zinc-400">WhatsApp</Label>
            <Input
              defaultValue="5511999998888"
              className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300"
            />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs text-zinc-400">Horário de Funcionamento</Label>
            <div className="mt-1 grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-zinc-500">Abertura</Label>
                <Input type="time" defaultValue="08:00" className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
              </div>
              <div>
                <Label className="text-xs text-zinc-500">Fechamento</Label>
                <Input type="time" defaultValue="20:00" className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
              </div>
            </div>
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs text-zinc-400">Dias de Funcionamento</Label>
            <div className="mt-1 flex flex-wrap gap-2">
              {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day) => (
                <Badge
                  key={day}
                  variant={day !== 'Dom' ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer',
                    day !== 'Dom' ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' : 'text-zinc-500 border-zinc-700'
                  )}
                >
                  {day}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <Button className="mt-6 gap-1.5 bg-amber-500 text-black hover:bg-amber-400">
          <Save className="h-4 w-4" />
          Salvar Alterações
        </Button>
      </CardContent>
    </Card>
  )
}

function TeamSettings({
  onInvite,
  showInviteDialog,
  onCloseInvite,
}: {
  onInvite: () => void
  showInviteDialog: boolean
  onCloseInvite: () => void
}) {
  return (
    <>
      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-zinc-200">Equipe</CardTitle>
            <Button
              size="sm"
              className="gap-1.5 bg-amber-500 text-black hover:bg-amber-400"
              onClick={onInvite}
            >
              <Plus className="h-4 w-4" />
              Convidar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800">
                <TableHead className="text-zinc-500">Nome</TableHead>
                <TableHead className="text-zinc-500 hidden md:table-cell">Email</TableHead>
                <TableHead className="text-zinc-500">Função</TableHead>
                <TableHead className="text-zinc-500">Status</TableHead>
                <TableHead className="text-zinc-500">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id} className="border-zinc-800">
                  <TableCell className="font-medium text-zinc-200">{member.name}</TableCell>
                  <TableCell className="text-zinc-400 hidden md:table-cell">{member.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-zinc-400 border-zinc-700">
                      {roleLabels[member.role] || member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={member.active ? 'default' : 'outline'}
                      className={cn(member.active ? 'bg-green-500/10 text-green-400' : 'text-zinc-500')}
                    >
                      {member.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="xs" className="text-zinc-400 hover:text-zinc-200">
                        Editar
                      </Button>
                      <Button variant="ghost" size="xs" className="text-zinc-400 hover:text-red-400">
                        {member.active ? 'Desativar' : 'Ativar'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showInviteDialog} onOpenChange={onCloseInvite}>
        <DialogContent className="max-w-md border-zinc-800 bg-zinc-900 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Convidar Membro</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Adicione um novo membro à equipe
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-zinc-400">Nome</Label>
              <Input placeholder="Nome completo" className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
            </div>
            <div>
              <Label className="text-xs text-zinc-400">Email</Label>
              <Input type="email" placeholder="email@exemplo.com" className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
            </div>
            <div>
              <Label className="text-xs text-zinc-400">Função</Label>
              <Select>
                <SelectTrigger className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="MANAGER">Gerente</SelectItem>
                  <SelectItem value="BARBER">Barbeiro</SelectItem>
                  <SelectItem value="CASHIER">Caixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onCloseInvite} className="border-zinc-700 text-zinc-300">
              Cancelar
            </Button>
            <Button className="bg-amber-500 text-black hover:bg-amber-400">Convidar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ServiceSettings({
  onAdd,
  showAddDialog,
  onCloseAdd,
}: {
  onAdd: () => void
  showAddDialog: boolean
  onCloseAdd: () => void
}) {
  return (
    <>
      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-zinc-200">Serviços</CardTitle>
            <Button
              size="sm"
              className="gap-1.5 bg-amber-500 text-black hover:bg-amber-400"
              onClick={onAdd}
            >
              <Plus className="h-4 w-4" />
              Novo Serviço
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800">
                <TableHead className="text-zinc-500">Nome</TableHead>
                <TableHead className="text-zinc-500">Preço</TableHead>
                <TableHead className="text-zinc-500">Duração</TableHead>
                <TableHead className="text-zinc-500">Ativo</TableHead>
                <TableHead className="text-zinc-500">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servicesList.map((service) => (
                <TableRow key={service.id} className="border-zinc-800">
                  <TableCell className="font-medium text-zinc-200">{service.name}</TableCell>
                  <TableCell className="text-amber-400">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price)}
                  </TableCell>
                  <TableCell className="text-zinc-400">{service.duration} min</TableCell>
                  <TableCell>
                    <Badge
                      variant={service.active ? 'default' : 'outline'}
                      className={cn(service.active ? 'bg-green-500/10 text-green-400' : 'text-zinc-500')}
                    >
                      {service.active ? 'Sim' : 'Não'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="xs" className="text-zinc-400 hover:text-zinc-200">
                        Editar
                      </Button>
                      <Button variant="ghost" size="xs" className="text-zinc-400 hover:text-red-400">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showAddDialog} onOpenChange={onCloseAdd}>
        <DialogContent className="max-w-md border-zinc-800 bg-zinc-900 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Novo Serviço</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Adicione um novo serviço à barbearia
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-zinc-400">Nome</Label>
              <Input placeholder="Nome do serviço" className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
            </div>
            <div>
              <Label className="text-xs text-zinc-400">Descrição</Label>
              <Textarea
                placeholder="Descrição do serviço"
                className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-zinc-400">Preço (R$)</Label>
                <Input type="number" step="0.01" placeholder="0,00" className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
              </div>
              <div>
                <Label className="text-xs text-zinc-400">Duração (min)</Label>
                <Input type="number" placeholder="30" className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onCloseAdd} className="border-zinc-700 text-zinc-300">
              Cancelar
            </Button>
            <Button className="bg-amber-500 text-black hover:bg-amber-400">Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function IntegrationSettings() {
  return (
    <div className="space-y-4">
      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-zinc-200">WhatsApp</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-zinc-800/30 p-3">
              <div>
                <p className="text-sm font-medium text-zinc-200">WhatsApp Business API</p>
                <p className="text-xs text-zinc-500">Conecte sua conta do WhatsApp Business</p>
              </div>
              <Badge variant="outline" className="text-zinc-500">Não conectado</Badge>
            </div>
            <div>
              <Label className="text-xs text-zinc-400">Token de Acesso</Label>
              <Input
                type="password"
                placeholder="Insira o token..."
                className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300"
              />
            </div>
            <div>
              <Label className="text-xs text-zinc-400">Número de Telefone</Label>
              <Input
                placeholder="5511999998888"
                className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300"
              />
            </div>
            <Button variant="outline" className="border-zinc-700 text-zinc-300">Conectar</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-zinc-200">Google Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-zinc-800/30 p-3">
              <div>
                <p className="text-sm font-medium text-zinc-200">Google Calendar API</p>
                <p className="text-xs text-zinc-500">Sincronize agendamentos com o Google Calendar</p>
              </div>
              <Badge variant="outline" className="text-zinc-500">Não conectado</Badge>
            </div>
            <Button variant="outline" className="border-zinc-700 text-zinc-300">Conectar com Google</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-zinc-200">Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-zinc-800/30 p-3">
              <div>
                <p className="text-sm font-medium text-zinc-200">Stripe / PIX</p>
                <p className="text-xs text-zinc-500">Configure pagamentos online</p>
              </div>
              <Badge variant="outline" className="text-zinc-500">Não configurado</Badge>
            </div>
            <div>
              <Label className="text-xs text-zinc-400">Chave PIX</Label>
              <Input
                placeholder="Sua chave PIX"
                className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300"
              />
            </div>
            <Button variant="outline" className="border-zinc-700 text-zinc-300">Salvar Chave</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function NotificationSettings() {
  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-zinc-200">Preferências de Notificação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Lembretes</h4>
          <div className="flex items-center justify-between rounded-lg bg-zinc-800/30 p-3">
            <div>
              <p className="text-sm font-medium text-zinc-200">Lembrete 24h antes</p>
              <p className="text-xs text-zinc-500">Envia notificação 24 horas antes do agendamento</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-zinc-700 has-checked:bg-amber-500">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white transition-all peer-checked:translate-x-4" />
              </label>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-zinc-800/30 p-3">
            <div>
              <p className="text-sm font-medium text-zinc-200">Lembrete 2h antes</p>
              <p className="text-xs text-zinc-500">Envia notificação 2 horas antes do agendamento</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-zinc-700 has-checked:bg-amber-500">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white transition-all peer-checked:translate-x-4" />
              </label>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-zinc-800/30 p-3">
            <div>
              <p className="text-sm font-medium text-zinc-200">Confirmação de agendamento</p>
              <p className="text-xs text-zinc-500">Notifica quando um agendamento for confirmado</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-zinc-700 has-checked:bg-amber-500">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white transition-all peer-checked:translate-x-4" />
              </label>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-zinc-800/30 p-3">
            <div>
              <p className="text-sm font-medium text-zinc-200">Cancelamento</p>
              <p className="text-xs text-zinc-500">Notifica quando um agendamento for cancelado</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-zinc-700 has-checked:bg-amber-500">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white transition-all peer-checked:translate-x-4" />
              </label>
            </div>
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        <div className="space-y-4">
          <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">WhatsApp</h4>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-zinc-400">Template de Confirmação</Label>
              <Textarea
                defaultValue="Olá {{nome}}, seu agendamento para {{servico}} com {{profissional}} em {{data}} às {{horario}} foi confirmado!"
                className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300 text-xs"
                rows={3}
              />
            </div>
            <div>
              <Label className="text-xs text-zinc-400">Template de Lembrete</Label>
              <Textarea
                defaultValue="Olá {{nome}}, lembramos do seu agendamento para {{servico}} com {{profissional}} amanhã às {{horario}}. Confirme sua presença!"
                className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300 text-xs"
                rows={3}
              />
            </div>
          </div>
        </div>

        <Button className="gap-1.5 bg-amber-500 text-black hover:bg-amber-400">
          <Save className="h-4 w-4" />
          Salvar Configurações
        </Button>
      </CardContent>
    </Card>
  )
}

function AppearanceSettings() {
  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-zinc-200">Aparência</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="mb-3 text-xs font-medium text-zinc-400 uppercase tracking-wider">Tema</h4>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'light', icon: Sun, label: 'Claro' },
              { value: 'dark', icon: Moon, label: 'Escuro' },
              { value: 'system', icon: Monitor, label: 'Sistema' },
            ].map((theme) => {
              const ThemeIcon = theme.icon
              return (
                <button
                  key={theme.value}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
                    theme.value === 'dark'
                      ? 'border-amber-500/30 bg-amber-500/5'
                      : 'border-zinc-800 hover:border-zinc-700'
                  )}
                >
                  <ThemeIcon className={cn(
                    'h-6 w-6',
                    theme.value === 'dark' ? 'text-amber-400' : 'text-zinc-400'
                  )} />
                  <span className={cn(
                    'text-sm font-medium',
                    theme.value === 'dark' ? 'text-amber-400' : 'text-zinc-300'
                  )}>
                    {theme.label}
                  </span>
                  {theme.value === 'dark' && (
                    <Check className="h-4 w-4 text-amber-400" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        <div>
          <h4 className="mb-3 text-xs font-medium text-zinc-400 uppercase tracking-wider">Cor de Destaque</h4>
          <div className="flex flex-wrap gap-3">
            {accentColors.map((color) => (
              <button
                key={color.value}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full transition-all hover:scale-110',
                  color.value === '#f59e0b' && 'ring-2 ring-amber-500 ring-offset-2 ring-offset-zinc-900'
                )}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {color.value === '#f59e0b' && <Check className="h-5 w-5 text-white" />}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {accentColors.map((color) => (
              <Badge
                key={color.value}
                variant={color.value === '#f59e0b' ? 'default' : 'outline'}
                className={cn('cursor-pointer', color.value === '#f59e0b' ? 'bg-amber-500/10 text-amber-400' : 'text-zinc-400 border-zinc-700')}
              >
                {color.name}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        <div>
          <h4 className="mb-3 text-xs font-medium text-zinc-400 uppercase tracking-wider">Fonte</h4>
          <Select>
            <SelectTrigger className="w-48 border-zinc-800 bg-zinc-950 text-zinc-300">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inter">Inter</SelectItem>
              <SelectItem value="sans">System Sans</SelectItem>
              <SelectItem value="mono">Monospace</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="gap-1.5 bg-amber-500 text-black hover:bg-amber-400">
          <Save className="h-4 w-4" />
          Salvar Preferências
        </Button>
      </CardContent>
    </Card>
  )
}
