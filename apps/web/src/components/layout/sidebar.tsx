'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  FileText,
  Wallet,
  MapPin,
  MessageSquare,
  Images,
  Zap,
  UsersRound,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/agenda', label: 'Agenda', icon: CalendarDays },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/orcamentos', label: 'Orçamentos', icon: FileText },
  { href: '/financeiro', label: 'Financeiro', icon: Wallet },
  { href: '/rotas', label: 'Rotas', icon: MapPin },
  { href: '/crm', label: 'CRM', icon: MessageSquare },
  { href: '/portfolio', label: 'Portfólio', icon: Images },
  { href: '/automacoes', label: 'Automações', icon: Zap },
  { href: '/equipe', label: 'Equipe', icon: UsersRound },
];

const bottomItems = [
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useStore();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const collapsed = !sidebarOpen || isMobile;

  const sidebarVariants = {
    expanded: { width: 260 },
    collapsed: { width: 72 },
  };

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={collapsed ? 'collapsed' : 'expanded'}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 z-30 flex h-full flex-col border-r bg-sidebar-background',
          collapsed && 'items-center',
        )}
      >
        <div className={cn('flex h-16 items-center', collapsed ? 'justify-center' : 'px-4 justify-between')}>
          <AnimatePresence mode="wait">
            {collapsed ? (
              <motion.div
                key="collapsed-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Sparkles className="h-8 w-8 text-sidebar-primary" />
              </motion.div>
            ) : (
              <motion.div
                key="expanded-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Sparkles className="h-7 w-7 text-sidebar-primary" />
                <span className="text-lg font-bold text-sidebar-foreground">ServiceFlow</span>
              </motion.div>
            )}
          </AnimatePresence>
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          )}
        </div>

        <Separator className="bg-sidebar-border" />

        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            const linkContent = collapsed ? (
              <Icon className="h-5 w-5 shrink-0" />
            ) : (
              <>
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </>
            );

            const link = (
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  collapsed && 'justify-center px-2',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                )}
              >
                {linkContent}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }
            return <div key={item.href}>{link}</div>;
          })}
        </nav>

        <Separator className="bg-sidebar-border" />

        <div className="p-2 space-y-1">
          {bottomItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            const linkContent = collapsed ? (
              <Icon className="h-5 w-5 shrink-0" />
            ) : (
              <>
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </>
            );

            const link = (
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  collapsed && 'justify-center px-2',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                )}
              >
                {linkContent}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }
            return <div key={item.href}>{link}</div>;
          })}
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
