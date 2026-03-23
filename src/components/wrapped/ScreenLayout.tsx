'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScreenLayoutProps {
  children: ReactNode;
  gradient: string;
  direction?: number;
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

export function ScreenLayout({ children, gradient, direction = 1 }: ScreenLayoutProps) {
  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'tween', duration: 0.3 }}
      className={`absolute inset-0 flex flex-col items-center justify-center p-8 ${gradient}`}
    >
      {children}
    </motion.div>
  );
}
