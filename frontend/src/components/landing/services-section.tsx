'use client'

import { motion } from 'framer-motion'
import { Scissors, Sparkles, Clock, DollarSign, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const services = [
  {
    name: 'Corte Masculino',
    description: 'Corte personalizado com tesoura e máquina, finalização com produtos premium.',
    price: 55,
    duration: 40,
    icon: Scissors,
  },
  {
    name: 'Barba Completa',
    description: 'Aparação e modelagem de barba com navalha, toalha quente e balm.',
    price: 35,
    duration: 30,
    icon: Sparkles,
  },
  {
    name: 'Corte + Barba',
    description: 'Combo completo de corte e barba com desconto especial.',
    price: 75,
    duration: 60,
    icon: Scissors,
  },
  {
    name: 'Hidratação Capilar',
    description: 'Tratamento nutritivo para cabelos e couro cabeludo.',
    price: 45,
    duration: 35,
    icon: Sparkles,
  },
  {
    name: 'Sobrancelha',
    description: 'Design de sobrancelha com pinça e navalha.',
    price: 20,
    duration: 15,
    icon: Sparkles,
  },
  {
    name: 'Corte Infantil',
    description: 'Corte lúdico e paciente para crianças até 12 anos.',
    price: 45,
    duration: 30,
    icon: Scissors,
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function ServicesSection() {
  return (
    <section id="services" className="bg-zinc-900 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-amber-400">
            Nossos Serviços
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Excelência em Cada Corte
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Do clássico ao moderno, oferecemos serviços premium para valorizar seu estilo.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service) => {
            const Icon = service.icon
            return (
              <motion.div key={service.name} variants={itemVariants}>
                <Card className="group border-zinc-800 bg-zinc-950 transition-all hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-white">
                      {service.name}
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-zinc-400">
                      {service.description}
                    </p>
                    <div className="mb-4 flex items-center gap-4 text-sm text-zinc-500">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5 text-amber-400" />
                        R$ {service.price}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-amber-400" />
                        {service.duration} min
                      </span>
                    </div>
                    <a href="/agendar">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 border-zinc-700 text-zinc-300 hover:text-amber-400"
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        Agendar
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
