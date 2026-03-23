'use client';

import { motion } from 'framer-motion';
import { ScreenLayout } from './ScreenLayout';
import { ChatBubble } from '../ui/ChatBubble';
import { WrappedData } from '@/lib/types';

export function Screen01FirstMessage({ data, direction }: { data: WrappedData; direction: number }) {
  const first = data.firstMessages;

  const formatTime = (d: Date) => {
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <ScreenLayout gradient="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" direction={direction}>
      <motion.p
        className="text-white/60 text-sm font-medium mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Así empezó todo
      </motion.p>
      <motion.p
        className="text-white/40 text-xs mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {first[0] && formatDate(first[0].timestamp)}
      </motion.p>
      <div className="flex flex-col gap-3 w-full max-w-sm">
        {first.map((msg, i) => (
          <ChatBubble
            key={i}
            message={msg.isMedia ? '📷 Foto' : msg.content}
            sender={msg.sender}
            isRight={msg.sender === data.participants[0]}
            delay={0.6 + i * 0.5}
            time={formatTime(msg.timestamp)}
          />
        ))}
      </div>
      <motion.p
        className="text-white/30 text-xs mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        ¿Os acordáis de esto?
      </motion.p>
    </ScreenLayout>
  );
}
