'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { format, addDays, isBefore } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Package,
  Plus,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Edit,
  Trash2,
  Search,
  X,
  DollarSign,
  Calendar,
  Clock,
  Tag,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useStockItems, useStockAlerts } from '@/hooks/use-stock'
import type { StockItem } from '@/types'

const categories = [
  'Todos',
  'Produtos Capilares',
  'Barba',
  'Higiene',
  'Descartáveis',
  'Equipamentos',
  'Outros',
]

export default function EstoquePage() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | null>('Todos')
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<StockItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<StockItem | null>(null)

  const { data: stockItems, isLoading } = useStockItems()
  const { data: alerts } = useStockAlerts()

  const isExpiringSoon = (date?: string) => {
    if (!date) return false
    const expiry = new Date(date)
    const thirtyDays = addDays(new Date(), 30)
    return isBefore(expiry, thirtyDays) && !isBefore(expiry, new Date())
  }

  const isExpired = (date?: string) => {
    if (!date) return false
    return isBefore(new Date(date), new Date())
  }

  const filteredItems = useMemo(() => {
    if (!stockItems) return []
    return stockItems.filter((item) => {
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(search.toLowerCase()))
      const matchesCategory =
        categoryFilter === 'Todos' || item.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [stockItems, search, categoryFilter])

  const stats = useMemo(() => {
    if (!stockItems) return { total: 0, lowStock: 0, expiring: 0 }
    const lowStock = stockItems.filter((i) => i.quantity <= i.minQuantity).length
    const expiring = stockItems.filter((i) => isExpiringSoon(i.expiryDate) || isExpired(i.expiryDate)).length
    return { total: stockItems.length, lowStock, expiring }
  }, [stockItems])

  const getItemStatus = (item: StockItem): { label: string; color: string } => {
    if (item.quantity === 0) return { label: 'Sem Estoque', color: 'text-red-400 bg-red-500/10' }
    if (item.quantity <= item.minQuantity) return { label: 'Estoque Baixo', color: 'text-red-400 bg-red-500/10' }
    if (isExpired(item.expiryDate)) return { label: 'Vencido', color: 'text-red-400 bg-red-500/10' }
    if (isExpiringSoon(item.expiryDate)) return { label: 'Próximo ao Vencimento', color: 'text-amber-400 bg-amber-500/10' }
    return { label: 'OK', color: 'text-green-400 bg-green-500/10' }
  }

  const getRowStyle = (item: StockItem) => {
    if (item.quantity === 0 || item.quantity <= item.minQuantity) return 'bg-red-500/5'
    if (isExpired(item.expiryDate)) return 'bg-red-500/5'
    if (isExpiringSoon(item.expiryDate)) return 'bg-amber-500/5'
    return ''
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">Estoque</h1>
          <p className="text-sm text-zinc-500">Gerencie seus produtos e insumos</p>
        </div>
        <Button
          size="sm"
          className="gap-1.5 bg-amber-500 text-black hover:bg-amber-400"
          onClick={() => setShowNewDialog(true)}
        >
          <Plus className="h-4 w-4" />
          Novo Item
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <Package className="h-4 w-4 text-blue-400" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-zinc-500">Total Itens</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-red-500/10 p-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
              </div>
              {stats.lowStock > 0 && (
                <Badge variant="destructive" className="text-[10px]">{stats.lowStock}</Badge>
              )}
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{stats.lowStock}</p>
            <p className="text-xs text-zinc-500">Estoque Baixo</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-amber-500/10 p-2">
                <AlertCircle className="h-4 w-4 text-amber-400" />
              </div>
              {stats.expiring > 0 && (
                <Badge variant="outline" className="text-amber-400 border-amber-500/20 text-[10px]">{stats.expiring}</Badge>
              )}
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{stats.expiring}</p>
            <p className="text-xs text-zinc-500">Produtos para Vencer</p>
          </CardContent>
        </Card>
      </div>

      {alerts && (alerts.lowStock.length > 0 || alerts.expiring.length > 0) && (
        <div className="space-y-2">
          {alerts.lowStock.filter((a) => a.quantity === 0).slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-300">{item.name}</p>
                <p className="text-xs text-red-400/70">Sem estoque - Quantidade: {item.quantity}</p>
              </div>
            </div>
          ))}
          {alerts.lowStock.filter((a) => a.quantity > 0 && a.quantity <= a.minQuantity).slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-300">{item.name}</p>
                <p className="text-xs text-red-400/70">Estoque baixo: {item.quantity} (mínimo: {item.minQuantity})</p>
              </div>
            </div>
          ))}
          {alerts.expiring.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <Clock className="h-5 w-5 shrink-0 text-amber-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-300">{item.name}</p>
                <p className="text-xs text-amber-400/70">
                  Vence em {item.expiryDate ? format(new Date(item.expiryDate), 'dd/MM/yyyy') : '---'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Buscar item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 border-zinc-800 bg-zinc-900 pl-9 text-zinc-300 placeholder:text-zinc-600"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-9 w-44 border-zinc-800 bg-zinc-900 text-zinc-300">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="border-zinc-800 bg-zinc-900">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800">
                <TableHead className="text-zinc-500">Nome</TableHead>
                <TableHead className="text-zinc-500 hidden md:table-cell">Categoria</TableHead>
                <TableHead className="text-zinc-500">Quantidade</TableHead>
                <TableHead className="text-zinc-500 hidden lg:table-cell">Mínimo</TableHead>
                <TableHead className="text-zinc-500 hidden sm:table-cell">Preço</TableHead>
                <TableHead className="text-zinc-500 hidden lg:table-cell">Validade</TableHead>
                <TableHead className="text-zinc-500">Status</TableHead>
                <TableHead className="text-zinc-500">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const status = getItemStatus(item)
                  return (
                    <TableRow key={item.id} className={cn('border-zinc-800', getRowStyle(item))}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-zinc-200">{item.name}</p>
                          {item.description && (
                            <p className="text-xs text-zinc-500">{item.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-zinc-400 hidden md:table-cell">
                        {item.category ? (
                          <Badge variant="outline" className="text-zinc-400 border-zinc-700">
                            {item.category}
                          </Badge>
                        ) : '---'}
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          'font-medium',
                          item.quantity <= item.minQuantity ? 'text-red-400' : 'text-zinc-200'
                        )}>
                          {item.quantity} {item.unit}
                        </span>
                      </TableCell>
                      <TableCell className="text-zinc-500 hidden lg:table-cell">
                        {item.minQuantity} {item.unit}
                      </TableCell>
                      <TableCell className="text-amber-400 hidden sm:table-cell">
                        {item.price ? formatCurrency(item.price) : '---'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {item.expiryDate ? (
                          <span className={cn(
                            'text-xs',
                            isExpired(item.expiryDate) ? 'text-red-400' :
                            isExpiringSoon(item.expiryDate) ? 'text-amber-400' :
                            'text-zinc-400'
                          )}>
                            {format(new Date(item.expiryDate), 'dd/MM/yyyy')}
                          </span>
                        ) : '---'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('text-[10px]', status.color)}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => setEditingItem(item)}
                            className="text-zinc-400 hover:text-zinc-200"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => setDeletingItem(item)}
                            className="text-zinc-400 hover:text-red-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-zinc-500">
                    <Package className="mx-auto mb-2 h-8 w-8 text-zinc-600" />
                    {search || categoryFilter !== 'Todos'
                      ? 'Nenhum item encontrado para esta busca'
                      : 'Nenhum item cadastrado'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="max-w-md border-zinc-800 bg-zinc-900 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Novo Item</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Adicione um novo produto ao estoque
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label className="text-xs text-zinc-400">Nome</Label>
              <Input placeholder="Nome do produto" className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
            </div>
            <div className="col-span-2">
              <Label className="text-xs text-zinc-400">Descrição</Label>
              <Input placeholder="Descrição opcional" className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
            </div>
            <div>
              <Label className="text-xs text-zinc-400">Quantidade</Label>
              <Input type="number" placeholder="0" className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
            </div>
            <div>
              <Label className="text-xs text-zinc-400">Quantidade Mínima</Label>
              <Input type="number" placeholder="0" className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
            </div>
            <div>
              <Label className="text-xs text-zinc-400">Preço (R$)</Label>
              <Input type="number" step="0.01" placeholder="0,00" className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
            </div>
            <div>
              <Label className="text-xs text-zinc-400">Unidade</Label>
              <Input placeholder="un, ml, g..." className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
            </div>
            <div>
              <Label className="text-xs text-zinc-400">Data de Validade</Label>
              <Input type="date" className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
            </div>
            <div>
              <Label className="text-xs text-zinc-400">Categoria</Label>
              <Select>
                <SelectTrigger className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(c => c !== 'Todos').map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)} className="border-zinc-700 text-zinc-300">
              Cancelar
            </Button>
            <Button className="bg-amber-500 text-black hover:bg-amber-400">Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="max-w-md border-zinc-800 bg-zinc-900 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Editar Item</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Atualize as informações do item
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="text-xs text-zinc-400">Nome</Label>
                <Input defaultValue={editingItem.name} className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
              </div>
              <div className="col-span-2">
                <Label className="text-xs text-zinc-400">Descrição</Label>
                <Input defaultValue={editingItem.description || ''} className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
              </div>
              <div>
                <Label className="text-xs text-zinc-400">Quantidade</Label>
                <Input type="number" defaultValue={editingItem.quantity} className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
              </div>
              <div>
                <Label className="text-xs text-zinc-400">Qtd. Mínima</Label>
                <Input type="number" defaultValue={editingItem.minQuantity} className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
              </div>
              <div>
                <Label className="text-xs text-zinc-400">Preço</Label>
                <Input type="number" step="0.01" defaultValue={editingItem.price} className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
              </div>
              <div>
                <Label className="text-xs text-zinc-400">Unidade</Label>
                <Input defaultValue={editingItem.unit} className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)} className="border-zinc-700 text-zinc-300">
              Cancelar
            </Button>
            <Button className="bg-amber-500 text-black hover:bg-amber-400">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
        <DialogContent className="max-w-sm border-zinc-800 bg-zinc-900 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Excluir Item</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Tem certeza que deseja excluir este item?
            </DialogDescription>
          </DialogHeader>
          {deletingItem && (
            <div className="rounded-lg bg-zinc-800/50 p-3">
              <p className="font-medium text-zinc-200">{deletingItem.name}</p>
              <p className="text-xs text-zinc-500">Quantidade: {deletingItem.quantity} {deletingItem.unit}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingItem(null)} className="border-zinc-700 text-zinc-300">
              Cancelar
            </Button>
            <Button variant="destructive" className="gap-1.5">
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
