'use client';

import { motion } from 'framer-motion';
import { ScreenLayout } from './ScreenLayout';
import { WrappedData } from '@/lib/types';

export function Screen08TopWords({ data, direction }: { data: WrappedData; direction: number }) {
  return (
    <ScreenLayout gradient="bg-gradient-to-b from-cyan-900 via-teal-700 to-emerald-900" direction={direction}>
      <motion.p
        className="text-white/70 text-lg font-medium mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Vuestras palabras favoritas
      </motion.p>

      <div className="flex gap-8 w-full max-w-md justify-center">
        {data.topWords.map((person, pi) => (
          <motion.div
            key={person.name}
            className="flex-1"
            initial={{ opacity: 0, x: pi === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + pi * 0.3 }}
          >
            <p className="text-white font-bold text-sm mb-3 text-center">{person.name}</p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {person.words.slice(0, 10).map((w, i) => {
                const size = Math.max(12, 24 - i * 2);
                return (
                  <motion.span
                    key={w.word}
                    className="text-white/90 font-semibold"
                    style={{ fontSize: `${size}px` }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + pi * 0.3 + i * 0.08 }}
                  >
                    {w.word}
                  </motion.span>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </ScreenLayout>
  );
}
