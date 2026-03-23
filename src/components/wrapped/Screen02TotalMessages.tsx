'use client';

import { motion } from 'framer-motion';
import { ScreenLayout } from './ScreenLayout';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { WrappedData } from '@/lib/types';

export function Screen02TotalMessages({ data, direction }: { data: WrappedData; direction: number }) {
  const avgPerDay = Math.round(data.totalMessages / data.totalDays);

  return (
    <ScreenLayout gradient="bg-gradient-to-b from-purple-900 via-purple-700 to-fuchsia-900" direction={direction}>
      <motion.p
        className="text-white/70 text-lg font-medium mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Habéis intercambiado
      </motion.p>
      <AnimatedNumber
        value={data.totalMessages}
        className="text-7xl md:text-8xl font-black text-white"
      />
      <motion.p
        className="text-white text-2xl font-bold mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        mensajes
      </motion.p>
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <p className="text-white/60 text-sm">
          en {data.totalDays} días
        </p>
        <p className="text-white/80 text-lg font-semibold mt-1">
          una media de {avgPerDay} al día
        </p>
      </motion.div>
    </ScreenLayout>
  );
}
