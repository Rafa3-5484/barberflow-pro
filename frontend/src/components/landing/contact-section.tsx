'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const businessHours = [
  { day: 'Segunda - Sexta', hours: '09:00 - 20:00' },
  { day: 'Sábado', hours: '09:00 - 18:00' },
  { day: 'Domingo', hours: 'Fechado' },
]

export function ContactSection() {
  return (
    <section id="contact" className="bg-zinc-950 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-amber-400">
            Contato
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Entre em Contato
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Tire suas dúvidas ou agende seu horário. Estamos prontos para atender você.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                    Nome
                  </label>
                  <Input
                    placeholder="Seu nome"
                    className="border-zinc-800 bg-zinc-900 text-zinc-300 placeholder:text-zinc-600"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    className="border-zinc-800 bg-zinc-900 text-zinc-300 placeholder:text-zinc-600"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                  Telefone
                </label>
                <Input
                  placeholder="(11) 99999-8888"
                  className="border-zinc-800 bg-zinc-900 text-zinc-300 placeholder:text-zinc-600"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                  Mensagem
                </label>
                <Textarea
                  placeholder="Digite sua mensagem..."
                  rows={4}
                  className="border-zinc-800 bg-zinc-900 text-zinc-300 placeholder:text-zinc-600"
                />
              </div>
              <Button className="w-full gap-2 bg-amber-500 text-black hover:bg-amber-400 sm:w-auto">
                <Send className="h-4 w-4" />
                Enviar Mensagem
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400">
                Informações
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <div>
                    <p className="text-sm font-medium text-zinc-200">Endereço</p>
                    <p className="text-sm text-zinc-400">
                      Rua Augusta, 1500 - Consolação<br />
                      São Paulo - SP, 01304-001
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <div>
                    <p className="text-sm font-medium text-zinc-200">Telefone</p>
                    <p className="text-sm text-zinc-400">(11) 99999-8888</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <div>
                    <p className="text-sm font-medium text-zinc-200">Email</p>
                    <p className="text-sm text-zinc-400">
                      contato@barberflowpro.com.br
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <div>
                    <p className="text-sm font-medium text-zinc-200">
                      Horário de Funcionamento
                    </p>
                    <div className="mt-1 space-y-1">
                      {businessHours.map((item) => (
                        <div
                          key={item.day}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-zinc-400">{item.day}</span>
                          <span
                            className={
                              item.hours === 'Fechado'
                                ? 'text-red-400'
                                : 'text-zinc-300'
                            }
                          >
                            {item.hours}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex aspect-[16/5] items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
              <div className="text-center">
                <MapPin className="mx-auto h-8 w-8 text-zinc-600" />
                <p className="mt-2 text-sm text-zinc-500">Mapa - Rua Augusta, 1500</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
