'use client';

import { motion } from 'framer-motion';
import { ScreenLayout } from './ScreenLayout';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { WrappedData } from '@/lib/types';

export function Screen04PeakDay({ data, direction }: { data: WrappedData; direction: number }) {
  const formatDate = (d: Date) =>
    d.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  return (
    <ScreenLayout gradient="bg-gradient-to-b from-orange-900 via-red-700 to-rose-900" direction={direction}>
      <motion.p
        className="text-white/70 text-lg font-medium mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Vuestro día más intenso
      </motion.p>
      <AnimatedNumber
        value={data.peakDay.count}
        className="text-7xl font-black text-white"
      />
      <motion.p
        className="text-white text-xl font-bold mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        mensajes en un solo día
      </motion.p>
      <motion.p
        className="text-white/70 text-base mt-6 capitalize"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        {formatDate(data.peakDay.date)}
      </motion.p>
      <motion.p
        className="text-white/40 text-sm mt-4 italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        ¿Qué pasó ese día? Solo vosotros lo sabéis.
      </motion.p>
    </ScreenLayout>
  );
}
