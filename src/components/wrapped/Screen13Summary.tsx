'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScreenLayout } from './ScreenLayout';
import { WrappedData } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import { useAnalysisStorage } from '@/hooks/useAnalysisStorage';
import { AuthModal } from '@/components/auth/AuthModal';

export function Screen13Summary({ data, direction }: { data: WrappedData; direction: number }) {
  const { user } = useAuth();
  const { saveAnalysis, saving } = useAnalysisStorage();
  const [saved, setSaved] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const handleSave = async () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    const { error } = await saveAnalysis(data);
    if (!error) setSaved(true);
  };
  const formatDate = (d: Date) =>
    d.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });

  const startDate = data.firstMessages[0]?.timestamp;

  const stats = [
    { label: 'Mensajes', value: data.totalMessages.toLocaleString() },
    { label: 'Días', value: data.totalDays.toLocaleString() },
    { label: 'Racha máx.', value: `${data.longestStreak.days} días` },
    { label: 'Fotos', value: data.mediaCount.photos.toLocaleString() },
    { label: 'Audios', value: data.mediaCount.audios.toLocaleString() },
    { label: 'Eras', value: data.eras.length.toString() },
  ];

  return (
    <ScreenLayout gradient="bg-gradient-to-b from-fuchsia-950 via-purple-900 to-violet-950" direction={direction}>
      <motion.p
        className="text-white/50 text-sm mb-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {data.participants.join(' & ')}
      </motion.p>
      <motion.p
        className="text-white text-3xl font-black mb-1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: 'spring' }}
      >
        Vuestra Historia
      </motion.p>
      {startDate && (
        <motion.p
          className="text-white/40 text-xs mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          desde {formatDate(startDate)}
        </motion.p>
      )}

      <motion.div
        className="grid grid-cols-3 gap-3 w-full max-w-sm mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="bg-white/10 rounded-xl p-3 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + i * 0.1 }}
          >
            <p className="text-white font-black text-lg">{s.value}</p>
            <p className="text-white/50 text-[10px]">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.p
        className="text-white/60 text-sm italic text-center max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        Cada mensaje cuenta una historia. Esta es la vuestra.
      </motion.p>

      <motion.button
        onClick={handleSave}
        disabled={saving || saved}
        className={`mt-6 px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
          saved
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-white/10 text-white hover:bg-white/20 active:scale-95'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        whileTap={{ scale: 0.95 }}
      >
        {saved ? 'Guardado' : saving ? 'Guardando...' : user ? 'Guardar análisis' : 'Guardar análisis'}
      </motion.button>

      <motion.div
        className="mt-3 bg-white/10 px-6 py-2 rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        <p className="text-white/70 text-xs font-semibold tracking-wider">
          WHATS WRAPPED
        </p>
      </motion.div>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </ScreenLayout>
  );
}
