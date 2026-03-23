'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const initial = user.email?.charAt(0).toUpperCase() ?? '?';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-black font-bold text-sm hover:opacity-90 transition-opacity"
      >
        {initial}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-12 bg-zinc-900 border border-white/10 rounded-xl p-3 min-w-[200px] shadow-xl"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <p className="text-white/40 text-xs px-2 mb-2 truncate">{user.email}</p>
            <button
              onClick={async () => {
                await signOut();
                setOpen(false);
              }}
              className="w-full text-left text-white/70 text-sm px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              Cerrar sesión
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
