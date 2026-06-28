'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Image,
  Lock,
  Globe,
  ChevronLeft,
  ChevronRight,
  Camera,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const portfolioItems = [
  { id: '1', title: 'Instalação Elétrica Residencial', category: 'Instalação', before: null, after: null, public: true },
  { id: '2', title: 'Manutenção de Ar Condicionado', category: 'Manutenção', before: null, after: null, public: true },
  { id: '3', title: 'Reparo Hidráulico', category: 'Reparo', before: null, after: null, public: false },
];

const categories = ['Todas', 'Instalação', 'Manutenção', 'Reparo', 'Limpeza'];

export default function PortfolioPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = portfolioItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'Todas' || item.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Portfólio</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Novo Item do Portfólio</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Título</label>
                <Input placeholder="Título do serviço" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Categoria</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instalacao">Instalação</SelectItem>
                      <SelectItem value="manutencao">Manutenção</SelectItem>
                      <SelectItem value="reparo">Reparo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Público</label>
                  <div className="flex items-center gap-2 pt-2">
                    <Switch id="public-toggle" defaultChecked />
                    <label htmlFor="public-toggle" className="text-sm">Visível no site</label>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Fotos</label>
                <div className="flex items-center justify-center h-32 rounded-lg border-2 border-dashed border-muted-foreground/25 cursor-pointer hover:border-primary/50 transition-colors">
                  <div className="text-center">
                    <Camera className="mx-auto h-8 w-8 text-muted-foreground/50 mb-1" />
                    <p className="text-xs text-muted-foreground">Clique para adicionar fotos</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Descrição</label>
                <Textarea placeholder="Descrição do serviço..." />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline">Cancelar</Button>
                <Button>Salvar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar no portfólio..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList>
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="text-xs">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Image className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium">Nenhum item no portfólio</p>
            <p className="text-sm text-muted-foreground mt-1">
              Adicione fotos dos seus trabalhos
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Card className="group overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <div className="relative h-48 bg-muted flex items-center justify-center">
                  <Image className="h-12 w-12 text-muted-foreground/30" />
                  {!item.public && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="gap-1">
                        <Lock className="h-3 w-3" />
                        Privado
                      </Badge>
                    </div>
                  )}
                  {item.public && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="success" className="gap-1">
                        <Globe className="h-3 w-3" />
                        Público
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <Badge variant="secondary" className="mt-1 text-[10px]">
                        {item.category}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon-sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
