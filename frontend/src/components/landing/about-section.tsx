'use client'

import { motion } from 'framer-motion'
import { Scissors, Building2, Users, Award } from 'lucide-react'

const stats = [
  { value: '15+', label: 'Anos de Experiência', icon: Building2 },
  { value: '50k+', label: 'Clientes Satisfeitos', icon: Users },
  { value: '12', label: 'Profissionais', icon: Award },
  { value: '30+', label: 'Serviços', icon: Scissors },
]

const statContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const statVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
}

export function AboutSection() {
  return (
    <section id="about" className="bg-zinc-900 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-amber-400">
              Sobre Nós
            </span>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Tradição e Modernidade em Cada Corte
            </h2>
            <p className="mb-4 leading-relaxed text-zinc-400">
              Há mais de 15 anos, a BarberFlow Pro vem redefinindo o conceito de barbearia
              masculina. Combinamos técnicas tradicionais de barbearia com as últimas tendências
              em cuidados masculinos para oferecer uma experiência única.
            </p>
            <p className="leading-relaxed text-zinc-400">
              Nossa equipe de profissionais altamente qualificados está pronta para atender você
              com excelência, desde o clássico corte à navalha até os estilos mais contemporâneos.
              Aqui, cada cliente é tratado com a atenção e o cuidado que merece.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center border border-zinc-700">
              <div className="text-center">
                <Scissors className="mx-auto h-16 w-16 text-amber-500/50" />
                <p className="mt-4 text-sm text-zinc-500">Imagem da Barbearia</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full border-4 border-zinc-900 bg-gradient-to-br from-amber-400 to-amber-600 opacity-20" />
            <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full border-4 border-zinc-900 bg-gradient-to-br from-amber-400 to-amber-600 opacity-10" />
          </motion.div>
        </div>

        <motion.div
          variants={statContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                variants={statVariants}
                className="flex flex-col items-center rounded-xl border border-zinc-800 bg-zinc-950 p-8 text-center"
              >
                <Icon className="mb-3 h-8 w-8 text-amber-400" />
                <span className="text-3xl font-bold text-white">{stat.value}</span>
                <span className="mt-1 text-sm text-zinc-400">{stat.label}</span>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
