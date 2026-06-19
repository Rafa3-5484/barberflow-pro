'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Scissors,
  LayoutDashboard,
  Calendar,
  Users,
  UserCircle,
  DollarSign,
  BarChart3,
  Package,
  Settings,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { User } from '@/types'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/agenda', label: 'Agenda', icon: Calendar },
  { href: '/dashboard/profissionais', label: 'Profissionais', icon: Users },
  { href: '/dashboard/clientes', label: 'Clientes', icon: UserCircle },
  { href: '/dashboard/caixa', label: 'Caixa', icon: DollarSign },
  { href: '/dashboard/relatorios', label: 'Relatórios', icon: BarChart3 },
  { href: '/dashboard/estoque', label: 'Estoque', icon: Package },
  { href: '/dashboard/configuracoes', label: 'Configurações', icon: Settings },
]

interface SidebarProps {
  user?: User | null
  onLogout?: () => void
  className?: string
}

export function Sidebar({ user, onLogout, className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-zinc-800 bg-zinc-950',
        className
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-zinc-800 px-6">
        <Scissors className="h-5 w-5 text-amber-400" />
        <span className="text-base font-bold tracking-tight text-white">
          BarberFlow Pro
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-zinc-800 p-4">
        {user && (
          <div className="mb-3 flex items-center gap-3">
            <Avatar size="sm">
              <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xs">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-zinc-200">
                {user.name}
              </p>
              <p className="truncate text-xs text-zinc-500">{user.role}</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="w-full justify-start gap-2 text-zinc-400 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </aside>
  )
}
