'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UsersRound,
  Plus,
  Search,
  Mail,
  Shield,
  Star,
  UserCheck,
  UserX,
  MoreHorizontal,
  Percent,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn, getInitials } from '@/lib/utils';

const teamMembers = [
  { id: '1', name: 'Rafael Costa', email: 'rafael@empresa.com', role: 'owner', active: true, commission: 0, productivity: 95, initials: 'RC' },
  { id: '2', name: 'Ana Oliveira', email: 'ana@empresa.com', role: 'admin', active: true, commission: 10, productivity: 88, initials: 'AO' },
  { id: '3', name: 'Carlos Santos', email: 'carlos@empresa.com', role: 'technician', active: true, commission: 15, productivity: 72, initials: 'CS' },
  { id: '4', name: 'Julia Lima', email: 'julia@empresa.com', role: 'attendant', active: false, commission: 5, productivity: 0, initials: 'JL' },
];

const roleLabels: Record<string, string> = {
  owner: 'Proprietário',
  admin: 'Administrador',
  technician: 'Técnico',
  attendant: 'Atendente',
  viewer: 'Visualizador',
};

const permissionsMatrix = [
  { permission: 'Clientes', roles: { owner: true, admin: true, technician: true, attendant: true, viewer: false } },
  { permission: 'Agendamentos', roles: { owner: true, admin: true, technician: true, attendant: true, viewer: false } },
  { permission: 'Orçamentos', roles: { owner: true, admin: true, technician: true, attendant: true, viewer: false } },
  { permission: 'Financeiro', roles: { owner: true, admin: true, technician: false, attendant: false, viewer: false } },
  { permission: 'Rotas', roles: { owner: true, admin: true, technician: true, attendant: false, viewer: false } },
  { permission: 'CRM', roles: { owner: true, admin: true, technician: true, attendant: true, viewer: false } },
  { permission: 'Portfólio', roles: { owner: true, admin: true, technician: true, attendant: false, viewer: false } },
  { permission: 'Equipe', roles: { owner: true, admin: true, technician: false, attendant: false, viewer: false } },
  { permission: 'Configurações', roles: { owner: true, admin: true, technician: false, attendant: false, viewer: false } },
  { permission: 'Automações', roles: { owner: true, admin: true, technician: false, attendant: false, viewer: false } },
];

const roles = ['owner', 'admin', 'technician', 'attendant', 'viewer'];

export default function EquipePage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('members');

  const filtered = teamMembers.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = teamMembers.filter((m) => m.active).length;
  const avgProductivity = Math.round(
    teamMembers.filter((m) => m.active).reduce((s, m) => s + m.productivity, 0) / activeCount
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Equipe</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Convidar Membro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convidar Membro</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">E-mail</label>
                <Input type="email" placeholder="email@convidado.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Função</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="technician">Técnico</SelectItem>
                    <SelectItem value="attendant">Atendente</SelectItem>
                    <SelectItem value="viewer">Visualizador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline">Cancelar</Button>
                <Button>Convidar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3">
              <UsersRound className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{teamMembers.length}</p>
              <p className="text-xs text-muted-foreground">Total Membros</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-xl bg-green-100 p-3 dark:bg-green-900/30">
              <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeCount}</p>
              <p className="text-xs text-muted-foreground">Ativos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-900/30">
              <Star className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{avgProductivity}%</p>
              <p className="text-xs text-muted-foreground">Produtividade Média</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="members">Membros</TabsTrigger>
          <TabsTrigger value="permissions">Permissões</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-3 mt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar membros..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filtered.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Card className={cn(!member.active && 'opacity-60')}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{member.name}</span>
                        <Badge variant="secondary" className="text-[10px] capitalize">
                          {roleLabels[member.role]}
                        </Badge>
                        {!member.active && (
                          <Badge variant="destructive" className="text-[10px]">Inativo</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-muted-foreground">{member.email}</span>
                        {member.commission > 0 && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Percent className="h-3 w-3" />
                            Comissão: {member.commission}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {member.active && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{member.productivity}%</span>
                        </div>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>
                            {member.active ? 'Desativar' : 'Ativar'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="permissions" className="mt-6">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left font-medium text-sm">Permissão</th>
                    {roles.map((role) => (
                      <th key={role} className="p-4 text-center font-medium text-sm capitalize">
                        {roleLabels[role]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {permissionsMatrix.map((row) => (
                    <tr key={row.permission} className="border-b last:border-0">
                      <td className="p-4 text-sm font-medium">{row.permission}</td>
                      {roles.map((role) => (
                        <td key={role} className="p-4 text-center">
                          {row.roles[role as keyof typeof row.roles] ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
