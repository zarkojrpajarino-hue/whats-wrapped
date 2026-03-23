'use client';

import { motion } from 'framer-motion';
import { ScreenLayout } from './ScreenLayout';
import { WrappedData } from '@/lib/types';

export function Screen10Eras({ data, direction }: { data: WrappedData; direction: number }) {
  const formatDate = (d: Date) =>
    d.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });

  return (
    <ScreenLayout gradient="bg-gradient-to-b from-violet-950 via-purple-900 to-fuchsia-950" direction={direction}>
      <motion.p
        className="text-white/70 text-lg font-medium mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Vuestra historia en capítulos
      </motion.p>
      <motion.p
        className="text-white text-3xl font-black mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Las Eras
      </motion.p>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        {data.eras.map((era, i) => (
          <motion.div
            key={i}
            className="relative pl-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.3 }}
          >
            {/* Timeline line */}
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-white/20" />
            {/* Timeline dot */}
            <div className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-purple-700" />

            <div className="bg-white/10 rounded-xl p-4">
              <div className="flex justify-between items-start mb-1">
                <p className="text-white font-bold text-base">{era.label}</p>
                <span className="text-white/40 text-xs">{era.messageCount.toLocaleString()} msgs</span>
              </div>
              <p className="text-white/50 text-xs mb-2">
                {formatDate(era.start)} — {formatDate(era.end)}
              </p>
              <p className="text-white/70 text-sm italic">{era.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </ScreenLayout>
  );
}
