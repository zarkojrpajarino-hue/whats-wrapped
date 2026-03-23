'use client';

import { motion } from 'framer-motion';
import { ScreenLayout } from './ScreenLayout';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { WrappedData } from '@/lib/types';

export function Screen03LongestStreak({ data, direction }: { data: WrappedData; direction: number }) {
  const formatDate = (d: Date) =>
    d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

  return (
    <ScreenLayout gradient="bg-gradient-to-b from-green-900 via-emerald-700 to-teal-900" direction={direction}>
      <motion.p
        className="text-white/70 text-lg font-medium mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Vuestra racha más larga
      </motion.p>
      <AnimatedNumber
        value={data.longestStreak.days}
        className="text-8xl font-black text-white"
      />
      <motion.p
        className="text-white text-2xl font-bold mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        días seguidos hablando
      </motion.p>
      <motion.p
        className="text-white/50 text-sm mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        del {formatDate(data.longestStreak.start)} al {formatDate(data.longestStreak.end)}
      </motion.p>
      <motion.p
        className="text-white/40 text-xs mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        Ni un solo día sin hablar 🔥
      </motion.p>
    </ScreenLayout>
  );
}
