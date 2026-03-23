'use client';

import { motion } from 'framer-motion';
import { ScreenLayout } from './ScreenLayout';
import { WrappedData } from '@/lib/types';

export function Screen06HourlyDistribution({ data, direction }: { data: WrappedData; direction: number }) {
  const max = Math.max(...data.hourlyDistribution);
  const peakHour = data.hourlyDistribution.indexOf(max);

  return (
    <ScreenLayout gradient="bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950" direction={direction}>
      {/* Stars background effect */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <motion.p
        className="text-white/70 text-lg font-medium mb-2 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Vuestras horas
      </motion.p>

      <motion.p
        className="text-6xl font-black text-white relative z-10"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: 'spring' }}
      >
        {data.nightPercentage}%
      </motion.p>
      <motion.p
        className="text-white/80 text-lg font-semibold mb-8 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        de noche
      </motion.p>

      {/* Hour chart */}
      <motion.div
        className="flex items-end gap-0.5 h-24 w-full max-w-sm relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        {data.hourlyDistribution.map((count, hour) => {
          const height = max > 0 ? (count / max) * 100 : 0;
          const isNight = hour >= 21 || hour < 6;
          return (
            <div key={hour} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t-sm transition-all ${
                  isNight ? 'bg-indigo-400' : 'bg-white/30'
                } ${hour === peakHour ? 'bg-yellow-400' : ''}`}
                style={{ height: `${Math.max(2, height)}%` }}
              />
              {hour % 6 === 0 && (
                <span className="text-[8px] text-white/40">{hour}h</span>
              )}
            </div>
          );
        })}
      </motion.div>

      <motion.p
        className="text-white/40 text-xs mt-6 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        Hora pico: {peakHour}:00
      </motion.p>
    </ScreenLayout>
  );
}
