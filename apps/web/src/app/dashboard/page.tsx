'use client';

import { motion } from 'framer-motion';
import { WelcomeHeader } from '@/components/dashboard/welcome-header';
import { QuickStats } from '@/components/dashboard/quick-stats';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { UpcomingAppointments } from '@/components/dashboard/upcoming-appointments';
import { PendingBudgets } from '@/components/dashboard/pending-budgets';
import { WeatherWidget } from '@/components/dashboard/weather-widget';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function DashboardPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <WelcomeHeader />
      </motion.div>
      <motion.div variants={itemVariants}>
        <QuickStats />
      </motion.div>
      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-3 mb-6">
        <RevenueChart />
        <UpcomingAppointments />
      </motion.div>
      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
        <PendingBudgets />
        <WeatherWidget />
      </motion.div>
    </motion.div>
  );
}
