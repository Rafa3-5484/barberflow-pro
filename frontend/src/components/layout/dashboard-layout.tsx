'use client'

import { useState } from 'react'
import { Menu, Search, Bell, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      <Sheet>
        <SheetTrigger
          className="fixed top-3 left-3 z-40 text-zinc-400 lg:hidden"
        >
          <Button
            variant="ghost"
            size="icon"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 border-zinc-800">
          <Sidebar user={user} onLogout={logout} />
        </SheetContent>
      </Sheet>

      <aside className="hidden w-64 shrink-0 lg:block">
        <Sidebar user={user} onLogout={logout} />
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-zinc-800 bg-zinc-950/80 px-4 backdrop-blur-xl lg:px-6">
          <div className="flex-1 flex items-center gap-4">
            <h1 className="text-base font-semibold text-zinc-100 lg:ml-0 ml-10">
              {title || 'Dashboard'}
            </h1>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Buscar..."
                className="h-8 w-48 border-zinc-800 bg-zinc-900 pl-8 text-sm text-zinc-300 placeholder:text-zinc-500 lg:w-64"
              />
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-zinc-400 hover:text-amber-400"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-amber-400">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-amber-500 text-[10px] text-black">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 border-zinc-800 bg-zinc-950">
              <div className="p-3 text-sm font-medium text-zinc-200">Notificações</div>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <div className="p-3 text-sm text-zinc-400 text-center">Nenhuma notificação nova</div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="h-8 gap-2 px-2">
                <Avatar size="sm">
                  <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xs">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium text-zinc-300 sm:inline-block">
                  {user?.name || 'Usuário'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 border-zinc-800 bg-zinc-950">
              <DropdownMenuItem className="text-zinc-300 focus:text-amber-400 focus:bg-zinc-800">
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem className="text-zinc-300 focus:text-amber-400 focus:bg-zinc-800">
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem
                onClick={logout}
                className="text-red-400 focus:text-red-400 focus:bg-zinc-800"
              >
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
