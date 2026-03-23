'use client';

import { motion } from 'framer-motion';
import { ScreenLayout } from './ScreenLayout';
import { WrappedData } from '@/lib/types';

export function Screen12LongestMessage({ data, direction }: { data: WrappedData; direction: number }) {
  const msg = data.longestMessage;
  const charCount = msg.content.length;
  const wordCount = msg.content.split(/\s+/).length;

  // Truncate for display
  const preview = msg.content.length > 200
    ? msg.content.slice(0, 200) + '...'
    : msg.content;

  const formatDate = (d: Date) =>
    d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <ScreenLayout gradient="bg-gradient-to-b from-sky-900 via-blue-800 to-indigo-900" direction={direction}>
      <motion.p
        className="text-white/70 text-lg font-medium mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        El mensaje más largo
      </motion.p>

      <motion.div
        className="flex gap-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-center">
          <p className="text-3xl font-black text-white">{charCount.toLocaleString()}</p>
          <p className="text-white/50 text-xs">caracteres</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-black text-white">{wordCount}</p>
          <p className="text-white/50 text-xs">palabras</p>
        </div>
      </motion.div>

      <motion.div
        className="bg-white/10 rounded-2xl p-5 max-w-sm w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-green-400 text-xs font-semibold mb-2">{msg.sender}</p>
        <p className="text-white/80 text-sm leading-relaxed italic">
          &ldquo;{preview}&rdquo;
        </p>
      </motion.div>

      <motion.p
        className="text-white/40 text-xs mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        {formatDate(msg.timestamp)}
      </motion.p>
    </ScreenLayout>
  );
}
