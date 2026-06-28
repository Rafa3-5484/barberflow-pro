'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Menu,
  Search,
  Bell,
  Moon,
  Sun,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { getInitials } from '@/lib/utils';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/agenda': 'Agenda',
  '/clientes': 'Clientes',
  '/orcamentos': 'Orçamentos',
  '/financeiro': 'Financeiro',
  '/rotas': 'Rotas',
  '/crm': 'CRM',
  '/portfolio': 'Portfólio',
  '/automacoes': 'Automações',
  '/equipe': 'Equipe',
  '/configuracoes': 'Configurações',
  '/perfil': 'Perfil',
};

const searchItems = [
  { href: '/dashboard', label: 'Dashboard', category: 'Páginas' },
  { href: '/agenda', label: 'Agenda', category: 'Páginas' },
  { href: '/clientes', label: 'Clientes', category: 'Páginas' },
  { href: '/orcamentos', label: 'Orçamentos', category: 'Páginas' },
  { href: '/financeiro', label: 'Financeiro', category: 'Páginas' },
  { href: '/rotas', label: 'Rotas', category: 'Páginas' },
  { href: '/crm', label: 'CRM', category: 'Páginas' },
  { href: '/portfolio', label: 'Portfólio', category: 'Páginas' },
  { href: '/automacoes', label: 'Automações', category: 'Páginas' },
  { href: '/equipe', label: 'Equipe', category: 'Páginas' },
  { href: '/configuracoes', label: 'Configurações', category: 'Páginas' },
  { href: '/perfil', label: 'Perfil', category: 'Páginas' },
];

export function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { setSidebarOpen } = useStore();
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);

  const currentTitle = Object.entries(pageTitles).find(([key]) =>
    pathname.startsWith(key),
  )?.[1] || 'ServiceFlow';

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-xl px-4 lg:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary md:hidden" />
          <h1 className="text-lg font-semibold">{currentTitle}</h1>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            className="text-muted-foreground"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Buscar</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-muted-foreground"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Alternar tema</span>
          </Button>

          <Button variant="ghost" size="icon" className="text-muted-foreground relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              3
            </span>
            <span className="sr-only">Notificações</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  {user?.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {user?.name ? getInitials(user.name) : '??'}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium md:inline-block">
                  {user?.name || 'Usuário'}
                </span>
                <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:inline-block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user?.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/perfil" className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  Meu Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/configuracoes" className="flex items-center gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" />
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-destructive cursor-pointer">
                <LogOut className="h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Digite para buscar..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Páginas">
            {searchItems.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => {
                  window.location.href = item.href;
                  setSearchOpen(false);
                }}
              >
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
