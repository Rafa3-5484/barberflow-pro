import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);

  const company = await prisma.company.upsert({
    where: { slug: 'serviceflow-demo' },
    update: {},
    create: {
      name: 'ServiceFlow Demo',
      slug: 'serviceflow-demo',
      plan: 'professional',
      settings: {
        workingHours: {
          monday: { active: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
          tuesday: { active: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
          wednesday: { active: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
          thursday: { active: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
          friday: { active: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
          saturday: { active: true, start: '08:00', end: '12:00' },
          sunday: { active: false, start: '08:00', end: '12:00' },
        },
        weekStart: 'monday',
        appointmentDuration: 60,
        autoConfirmation: true,
        reminderEnabled: true,
        defaultBudgetValidity: 7,
      },
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'admin@serviceflow.ai' },
    update: {},
    create: {
      email: 'admin@serviceflow.ai',
      password: hashedPassword,
      name: 'Rafael Silva',
      phone: '11999999999',
      role: 'OWNER',
      companyId: company.id,
      emailVerified: true,
      active: true,
    },
  });

  const clients = await Promise.all([
    prisma.client.create({
      data: {
        companyId: company.id,
        name: 'Carlos Silva',
        phone: '11988887777',
        email: 'carlos@email.com',
        address: {
          street: 'Rua das Flores',
          number: '123',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01001-000',
          lat: -23.5505,
          lng: -46.6333,
        },
        notes: 'Cliente desde 2024',
        tags: ['fidelizado', 'recorrente'],
      },
    }),
    prisma.client.create({
      data: {
        companyId: company.id,
        name: 'Maria Oliveira',
        phone: '11977776666',
        email: 'maria@email.com',
        address: {
          street: 'Av. Paulista',
          number: '1000',
          neighborhood: 'Bela Vista',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01310-100',
          lat: -23.5613,
          lng: -46.6564,
        },
        tags: ['novo'],
      },
    }),
    prisma.client.create({
      data: {
        companyId: company.id,
        name: 'João Santos',
        phone: '11966665555',
        email: 'joao@email.com',
        address: {
          street: 'Rua Augusta',
          number: '500',
          neighborhood: 'Consolação',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01304-000',
          lat: -23.5557,
          lng: -46.6590,
        },
      },
    }),
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await Promise.all([
    prisma.appointment.create({
      data: {
        companyId: company.id,
        clientId: clients[0].id,
        userId: user.id,
        title: 'Instalação de Ar Condicionado',
        status: 'confirmed',
        type: 'Instalação',
        priority: 'high',
        date: today,
        startTime: '08:00',
        endTime: '10:00',
        estimatedDuration: 120,
        price: 850,
        address: clients[0].address as any,
      },
    }),
    prisma.appointment.create({
      data: {
        companyId: company.id,
        clientId: clients[1].id,
        userId: user.id,
        title: 'Manutenção Preventiva',
        status: 'in_progress',
        type: 'Manutenção',
        priority: 'medium',
        date: today,
        startTime: '10:30',
        endTime: '12:00',
        estimatedDuration: 90,
        price: 350,
        address: clients[1].address as any,
      },
    }),
    prisma.appointment.create({
      data: {
        companyId: company.id,
        clientId: clients[2].id,
        userId: user.id,
        title: 'Reparo Elétrico',
        status: 'scheduled',
        type: 'Reparo',
        priority: 'urgent',
        date: today,
        startTime: '14:00',
        endTime: '16:00',
        estimatedDuration: 120,
        price: 580,
        address: clients[2].address as any,
      },
    }),
  ]);

  const budgetItems = [
    { description: 'Ar Condicionado 12000 BTUs', quantity: 1, unitPrice: 2200, total: 2200 },
    { description: 'Instalação', quantity: 1, unitPrice: 450, total: 450 },
    { description: 'Material Elétrico', quantity: 1, unitPrice: 120, total: 120 },
  ];

  await prisma.budget.create({
    data: {
      companyId: company.id,
      clientId: clients[0].id,
      userId: user.id,
      number: 1,
      status: 'sent',
      items: budgetItems,
      subtotal: 2770,
      total: 2770,
      notes: 'Orçamento válido por 7 dias',
      conditions: 'Pagamento à vista ou em até 3x sem juros',
      warranty: '1 ano de garantia no serviço',
      validity: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      paymentMethods: ['pix', 'cash', 'credit_card'],
    },
  });

  await prisma.financialRecord.create({
    data: {
      companyId: company.id,
      clientId: clients[0].id,
      type: 'revenue',
      category: 'Instalação',
      description: 'Instalação de Ar Condicionado - Carlos Silva',
      value: 2770,
      paymentMethod: 'pix',
      status: 'paid',
      dueDate: today,
      paidAt: today,
    },
  });

  await prisma.companySettings.create({
    data: { companyId: company.id },
  });

  console.log('Seed completed successfully!');
  console.log(`Company: ${company.name} (${company.slug})`);
  console.log(`Admin: admin@serviceflow.ai / 123456`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
