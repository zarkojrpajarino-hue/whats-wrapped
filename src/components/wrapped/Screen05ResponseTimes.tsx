'use client';

import { motion } from 'framer-motion';
import { ScreenLayout } from './ScreenLayout';
import { WrappedData } from '@/lib/types';

function formatTime(minutes: number): string {
  if (minutes < 1) return '< 1 min';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function Screen05ResponseTimes({ data, direction }: { data: WrappedData; direction: number }) {
  const sorted = [...data.responseTimes].sort((a, b) => a.avgMinutes - b.avgMinutes);
  const faster = sorted[0];
  const slower = sorted[1];

  return (
    <ScreenLayout gradient="bg-gradient-to-b from-blue-900 via-indigo-800 to-violet-900" direction={direction}>
      <motion.p
        className="text-white/70 text-lg font-medium mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Tiempos de respuesta
      </motion.p>

      <div className="flex gap-8 items-end">
        {faster && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-5xl font-black text-white">{formatTime(faster.avgMinutes)}</p>
            <p className="text-white/60 text-sm mt-2">{faster.name}</p>
            <p className="text-green-400 text-xs mt-1">⚡ Más rápido</p>
          </motion.div>
        )}

        {slower && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-5xl font-black text-white/70">{formatTime(slower.avgMinutes)}</p>
            <p className="text-white/60 text-sm mt-2">{slower.name}</p>
          </motion.div>
        )}
      </div>

      <motion.p
        className="text-white/40 text-sm mt-10 text-center max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        De noche, los dos respondéis al instante.
      </motion.p>
    </ScreenLayout>
  );
}
