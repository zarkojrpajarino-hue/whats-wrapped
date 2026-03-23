'use client';

import { motion } from 'framer-motion';

interface ChatBubbleProps {
  message: string;
  sender: string;
  isRight: boolean;
  delay?: number;
  time?: string;
}

export function ChatBubble({ message, sender, isRight, delay = 0, time }: ChatBubbleProps) {
  return (
    <motion.div
      className={`flex ${isRight ? 'justify-end' : 'justify-start'} w-full`}
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.4, type: 'spring' }}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
          isRight
            ? 'bg-green-600 text-white rounded-br-md'
            : 'bg-white/15 text-white rounded-bl-md'
        }`}
      >
        {!isRight && (
          <p className="text-xs font-semibold text-green-400 mb-0.5">{sender}</p>
        )}
        <p className="text-sm leading-relaxed">{message}</p>
        {time && (
          <p className={`text-[10px] mt-1 text-right ${isRight ? 'text-green-200' : 'text-white/50'}`}>
            {time}
          </p>
        )}
      </div>
    </motion.div>
  );
}
