'use client';

import { motion } from 'framer-motion';
import { ScreenLayout } from './ScreenLayout';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { WrappedData } from '@/lib/types';

export function Screen09MediaCount({ data, direction }: { data: WrappedData; direction: number }) {
  const items = [
    { icon: '📷', label: 'Fotos', count: data.mediaCount.photos },
    { icon: '🎥', label: 'Vídeos', count: data.mediaCount.videos },
    { icon: '🎤', label: 'Audios', count: data.mediaCount.audios },
    { icon: '😄', label: 'Stickers', count: data.mediaCount.stickers },
  ].filter((i) => i.count > 0);

  const total = items.reduce((s, i) => s + i.count, 0);

  return (
    <ScreenLayout gradient="bg-gradient-to-b from-amber-900 via-orange-700 to-red-900" direction={direction}>
      <motion.p
        className="text-white/70 text-lg font-medium mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        No solo texto...
      </motion.p>

      <AnimatedNumber
        value={total}
        className="text-6xl font-black text-white"
      />
      <motion.p
        className="text-white text-lg font-bold mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        archivos compartidos
      </motion.p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            className="bg-white/10 rounded-2xl p-4 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + i * 0.15, type: 'spring' }}
          >
            <p className="text-3xl mb-1">{item.icon}</p>
            <p className="text-2xl font-black text-white">{item.count.toLocaleString()}</p>
            <p className="text-white/60 text-xs">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </ScreenLayout>
  );
}
