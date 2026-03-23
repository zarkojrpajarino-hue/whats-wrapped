'use client';

import { motion } from 'framer-motion';
import { FileUploader } from '@/components/upload/FileUploader';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-purple-950/50 to-black flex flex-col items-center justify-center px-6">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
          Whats
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
            Wrapped
          </span>
        </h1>
        <p className="text-white/60 text-lg md:text-xl max-w-md mx-auto">
          Descubre la historia oculta en tus conversaciones de WhatsApp
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <FileUploader />
      </motion.div>
    </main>
  );
}
