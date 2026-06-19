import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BookingFlow } from "@/components/agendamento/booking-flow";

export const metadata: Metadata = {
  title: "Agende seu Horário | BarberFlow Pro",
  description:
    "Agende seu horário na BarberFlow Pro. Escolha o serviço, profissional e horário ideal para você.",
};

export default function AgendarPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-zinc-950 pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Agende seu Horário
            </h1>
            <p className="mt-3 text-zinc-400">
              Escolha o serviço, profissional e melhor horário para você.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8">
            <BookingFlow />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
