'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Clock,
  Calendar,
  Wallet,
  Bell,
  Palette,
  CreditCard,
  Save,
  Upload,
  Sun,
  Moon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from 'next-themes';
import { useStore } from '@/lib/store';

const weekDays = [
  { key: 'monday', label: 'Segunda-feira' },
  { key: 'tuesday', label: 'Terça-feira' },
  { key: 'wednesday', label: 'Quarta-feira' },
  { key: 'thursday', label: 'Quinta-feira' },
  { key: 'friday', label: 'Sexta-feira' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
];

export default function ConfiguracoesPage() {
  const { theme: storeTheme, setTheme } = useStore();
  const { theme, setTheme: setNextTheme } = useTheme();
  const [workingHours, setWorkingHours] = useState<Record<string, { active: boolean; start: string; end: string }>>({
    monday: { active: true, start: '08:00', end: '18:00' },
    tuesday: { active: true, start: '08:00', end: '18:00' },
    wednesday: { active: true, start: '08:00', end: '18:00' },
    thursday: { active: true, start: '08:00', end: '18:00' },
    friday: { active: true, start: '08:00', end: '18:00' },
    saturday: { active: true, start: '08:00', end: '12:00' },
    sunday: { active: false, start: '08:00', end: '12:00' },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Configurações</h2>
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      <Tabs defaultValue="company">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="company" className="gap-2">
            <Building2 className="h-4 w-4" />
            Empresa
          </TabsTrigger>
          <TabsTrigger value="hours" className="gap-2">
            <Clock className="h-4 w-4" />
            Horários
          </TabsTrigger>
          <TabsTrigger value="appointments" className="gap-2">
            <Calendar className="h-4 w-4" />
            Agendamentos
          </TabsTrigger>
          <TabsTrigger value="financial" className="gap-2">
            <Wallet className="h-4 w-4" />
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="theme" className="gap-2">
            <Palette className="h-4 w-4" />
            Aparência
          </TabsTrigger>
          <TabsTrigger value="plan" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Plano
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Perfil da Empresa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-muted">
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Adicionar Logo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG ou SVG. Máx 2MB.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nome da Empresa</Label>
                  <Input defaultValue="Minha Empresa" />
                </div>
                <div className="space-y-2">
                  <Label>CNPJ/CPF</Label>
                  <Input defaultValue="00.000.000/0001-00" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input defaultValue="(11) 99999-8888" />
                </div>
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input type="email" defaultValue="contato@empresa.com" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Horários de Funcionamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {weekDays.map((day) => (
                <div key={day.key} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-36">
                    <Switch
                      checked={workingHours[day.key]?.active}
                      onCheckedChange={(checked) =>
                        setWorkingHours((prev) => ({
                          ...prev,
                          [day.key]: { ...prev[day.key], active: checked },
                        }))
                      }
                    />
                    <Label className="font-medium">{day.label}</Label>
                  </div>
                  <Input
                    type="time"
                    value={workingHours[day.key]?.start || '08:00'}
                    onChange={(e) =>
                      setWorkingHours((prev) => ({
                        ...prev,
                        [day.key]: { ...prev[day.key], start: e.target.value },
                      }))
                    }
                    className="w-32"
                    disabled={!workingHours[day.key]?.active}
                  />
                  <span className="text-muted-foreground">até</span>
                  <Input
                    type="time"
                    value={workingHours[day.key]?.end || '18:00'}
                    onChange={(e) =>
                      setWorkingHours((prev) => ({
                        ...prev,
                        [day.key]: { ...prev[day.key], end: e.target.value },
                      }))
                    }
                    className="w-32"
                    disabled={!workingHours[day.key]?.active}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configurações de Agendamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Duração Padrão (minutos)</Label>
                  <p className="text-xs text-muted-foreground">Tempo padrão para novos agendamentos</p>
                </div>
                <Input type="number" defaultValue={60} className="w-24" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Confirmação Automática</Label>
                  <p className="text-xs text-muted-foreground">Confirmar agendamentos automaticamente</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Lembretes Automáticos</Label>
                  <p className="text-xs text-muted-foreground">Enviar lembretes antes do agendamento</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configurações Financeiras</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Chave PIX</Label>
                <Input placeholder="Sua chave PIX" />
                <p className="text-xs text-muted-foreground">
                  Usada para receber pagamentos dos orçamentos
                </p>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Banco</Label>
                  <Input placeholder="Ex: Nubank" />
                </div>
                <div className="space-y-2">
                  <Label>Agência</Label>
                  <Input placeholder="0000" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Conta</Label>
                  <Input placeholder="00000-0" />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Conta</Label>
                  <Input placeholder="Corrente / Poupança" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preferências de Notificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificações por E-mail</Label>
                  <p className="text-xs text-muted-foreground">Receber notificações por e-mail</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificações Push</Label>
                  <p className="text-xs text-muted-foreground">Receber notificações no navegador</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificações WhatsApp</Label>
                  <p className="text-xs text-muted-foreground">Receber notificações por WhatsApp</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Aparência</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  className="h-24 flex-col gap-2"
                  onClick={() => setNextTheme('light')}
                >
                  <Sun className="h-6 w-6" />
                  <span>Claro</span>
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  className="h-24 flex-col gap-2"
                  onClick={() => setNextTheme('dark')}
                >
                  <Moon className="h-6 w-6" />
                  <span>Escuro</span>
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  className="h-24 flex-col gap-2"
                  onClick={() => setNextTheme('system')}
                >
                  <Sun className="h-6 w-6" />
                  <span>Sistema</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plan" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Plano e Faturamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Plano Professional</p>
                    <p className="text-sm text-muted-foreground">R$ 49,90/mês</p>
                  </div>
                  <Badge variant="success">Ativo</Badge>
                </div>
                <Separator className="my-4" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Clientes</span>
                    <span>Ilimitado</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Equipe</span>
                    <span>10 membros</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Automações</span>
                    <span>50</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Gerenciar Assinatura
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
