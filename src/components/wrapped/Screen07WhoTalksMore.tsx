'use client';

import { motion } from 'framer-motion';
import { ScreenLayout } from './ScreenLayout';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { WrappedData } from '@/lib/types';

export function Screen07WhoTalksMore({ data, direction }: { data: WrappedData; direction: number }) {
  const sorted = [...data.messageSplit].sort((a, b) => b.count - a.count);
  const leader = sorted[0];
  const other = sorted[1];

  return (
    <ScreenLayout gradient="bg-gradient-to-b from-pink-900 via-rose-700 to-pink-900" direction={direction}>
      <motion.p
        className="text-white/70 text-lg font-medium mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        ¿Quién habla más?
      </motion.p>

      {leader && (
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
        >
          <p className="text-white text-xl font-bold mb-2">{leader.name}</p>
          <AnimatedNumber
            value={leader.percentage}
            suffix="%"
            className="text-7xl font-black text-white"
          />
          <p className="text-white/50 text-sm mt-2">{leader.count.toLocaleString()} mensajes</p>
        </motion.div>
      )}

      {/* Bar comparison */}
      <motion.div
        className="w-full max-w-xs mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex h-4 rounded-full overflow-hidden bg-white/10">
          {sorted.map((s, i) => (
            <motion.div
              key={s.name}
              className={i === 0 ? 'bg-white' : 'bg-white/40'}
              initial={{ width: '0%' }}
              animate={{ width: `${s.percentage}%` }}
              transition={{ delay: 1.2, duration: 0.8 }}
            />
          ))}
        </div>
        {other && (
          <div className="flex justify-between mt-2 text-xs text-white/50">
            <span>{leader?.name}</span>
            <span>{other.name}</span>
          </div>
        )}
      </motion.div>
    </ScreenLayout>
  );
}
