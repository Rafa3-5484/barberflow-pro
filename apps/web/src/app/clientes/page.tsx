'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Phone,
  Mail,
  Tag,
  MoreHorizontal,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn, getInitials, formatPhone, formatCurrency } from '@/lib/utils';

const clients = [
  { id: '1', name: 'Carlos Silva', phone: '(11) 99999-8888', email: 'carlos@email.com', totalSpent: 4850, lastVisit: new Date('2024-06-15'), tags: ['VIP', 'Recorrente'], visits: 12 },
  { id: '2', name: 'Maria Oliveira', phone: '(11) 97777-6666', email: 'maria@email.com', totalSpent: 3200, lastVisit: new Date('2024-06-10'), tags: ['Novo'], visits: 3 },
  { id: '3', name: 'João Santos', phone: '(11) 95555-4444', email: 'joao@email.com', totalSpent: 1500, lastVisit: new Date('2024-05-28'), tags: ['Comercial'], visits: 5 },
  { id: '4', name: 'Ana Costa', phone: '(11) 93333-2222', email: 'ana@email.com', totalSpent: 7800, lastVisit: new Date('2024-06-18'), tags: ['VIP', 'Fidelidade'], visits: 20 },
  { id: '5', name: 'Pedro Alves', phone: '(11) 91111-0000', email: 'pedro@email.com', totalSpent: 600, lastVisit: new Date('2024-06-01'), tags: ['Indicado'], visits: 1 },
];

export default function ClientesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [isLoading] = useState(false);

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Clientes</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode('grid')}
            className={cn(viewMode === 'grid' && 'bg-accent')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode('list')}
            className={cn(viewMode === 'list' && 'bg-accent')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Novo Cliente</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Nome</label>
                    <Input placeholder="Nome do cliente" />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Telefone</label>
                    <Input placeholder="(11) 99999-9999" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">E-mail</label>
                  <Input type="email" placeholder="cliente@email.com" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Endereço</label>
                  <Input placeholder="Rua, número, bairro, cidade" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Observações</label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Anotações sobre o cliente..."
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline">Cancelar</Button>
                  <Button>Salvar Cliente</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar clientes..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className={cn('grid gap-4', viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : '')}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : filteredClients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium">Nenhum cliente encontrado</p>
            <p className="text-sm text-muted-foreground mt-1">
              {search ? 'Tente ajustar sua busca' : 'Cadastre seu primeiro cliente'}
            </p>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client, idx) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.3 }}
            >
              <Link href={`/clientes/${client.id}`}>
                <Card className="h-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(client.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span>{formatCurrency(client.totalSpent)}</span>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{formatPhone(client.phone)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{client.email}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {client.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="p-4 font-medium">Cliente</th>
                  <th className="p-4 font-medium hidden md:table-cell">Telefone</th>
                  <th className="p-4 font-medium hidden lg:table-cell">E-mail</th>
                  <th className="p-4 font-medium hidden sm:table-cell">Total Gasto</th>
                  <th className="p-4 font-medium">Tags</th>
                  <th className="p-4 font-medium w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4">
                      <Link href={`/clientes/${client.id}`} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {getInitials(client.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{client.name}</span>
                      </Link>
                    </td>
                    <td className="p-4 text-sm hidden md:table-cell">{formatPhone(client.phone)}</td>
                    <td className="p-4 text-sm hidden lg:table-cell">{client.email}</td>
                    <td className="p-4 text-sm hidden sm:table-cell font-medium">
                      {formatCurrency(client.totalSpent)}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {client.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
