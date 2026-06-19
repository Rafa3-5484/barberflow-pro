'use client'

import { motion } from 'framer-motion'
import { Calendar, Star, Scissors } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const professionals = [
  {
    name: 'Carlos Silva',
    specialties: ['Corte Clássico', 'Barba Tradicional', 'Hidratação'],
    rating: 4.9,
  },
  {
    name: 'Rafael Oliveira',
    specialties: ['Degradê', 'Corte Moderno', 'Design Capilar'],
    rating: 4.8,
  },
  {
    name: 'Lucas Santos',
    specialties: ['Barba Estilizada', 'Corte Infantil', 'Sobrancelha'],
    rating: 4.7,
  },
  {
    name: 'Pedro Costa',
    specialties: ['Corte Clássico', 'Barba Tradicional', 'Hidratação'],
    rating: 4.9,
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function ProfessionalsSection() {
  return (
    <section id="professionals" className="bg-zinc-950 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-amber-400">
            Nossos Profissionais
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Mestres da Navalha
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Conheça nossa equipe de barbeiros profissionais prontos para transformar seu visual.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {professionals.map((prof) => (
            <motion.div key={prof.name} variants={itemVariants}>
              <Card className="group border-zinc-800 bg-zinc-900 text-center transition-all hover:border-amber-500/30">
                <CardContent className="flex flex-col items-center p-6">
                  <Avatar size="lg" className="mb-4 h-20 w-20">
                    <AvatarFallback className="bg-zinc-800 text-xl text-amber-400">
                      <Scissors className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="mb-1 text-lg font-semibold text-white">
                    {prof.name}
                  </h3>
                  <div className="mb-3 flex items-center gap-1 text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    <span className="text-sm text-zinc-400">{prof.rating}</span>
                  </div>
                  <div className="mb-4 flex flex-wrap justify-center gap-1.5">
                    {prof.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                  <a href="/agendar">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-zinc-700 text-zinc-300 hover:text-amber-400"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      Agendar
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
