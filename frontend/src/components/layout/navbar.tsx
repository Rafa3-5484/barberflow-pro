'use client'

import { useState } from 'react'
import { Menu, X, Sun, Moon, Scissors, Calendar } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '#hero', label: 'Início' },
  { href: '#services', label: 'Serviços' },
  { href: '#professionals', label: 'Profissionais' },
  { href: '#about', label: 'Sobre' },
  { href: '#contact', label: 'Contato' },
]

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setOpen(false)
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-2">
          <Scissors className="h-6 w-6 text-amber-400" />
          <span className="text-lg font-bold tracking-tight text-white">
            BarberFlow Pro
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className="text-sm font-medium text-zinc-300 transition-colors hover:text-amber-400"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-zinc-300 hover:text-amber-400"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Alternar tema</span>
          </Button>

          <a href="/agendar">
            <Button className="hidden md:inline-flex gap-2 bg-amber-500 text-black hover:bg-amber-400">
              <Calendar className="h-4 w-4" />
              Agende Agora
            </Button>
          </a>

          <a href="/login">
            <Button variant="outline" className="hidden border-zinc-700 text-zinc-300 hover:text-white md:inline-flex">
              Área do Cliente
            </Button>
          </a>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="md:hidden">
              <Button variant="ghost" size="icon" className="text-zinc-300">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-zinc-800 bg-zinc-950">
              <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-2">
                  <Scissors className="h-5 w-5 text-amber-400" />
                  <span className="text-lg font-bold tracking-tight text-white">
                    BarberFlow Pro
                  </span>
                </div>
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <SheetClose key={link.href}>
                      <a
                        href={link.href}
                        onClick={(e) => handleScroll(e, link.href)}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-amber-400"
                      >
                        {link.label}
                      </a>
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-zinc-800">
                  <a href="/agendar">
                    <Button className="w-full gap-2 bg-amber-500 text-black hover:bg-amber-400">
                      <Calendar className="h-4 w-4" />
                      Agende Agora
                    </Button>
                  </a>
                  <a href="/login">
                    <Button variant="outline" className="w-full border-zinc-700 text-zinc-300">
                      Área do Cliente
                    </Button>
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
