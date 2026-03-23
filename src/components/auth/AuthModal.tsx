'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signInWithMagicLink } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signInWithMagicLink(email);

    if (error) {
      setError('Error al enviar el enlace. Inténtalo de nuevo.');
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
    onSuccess?.();
  };

  const handleClose = () => {
    setEmail('');
    setSent(false);
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/80" onClick={handleClose} />
          <motion.div
            className="relative bg-zinc-900 border border-white/10 rounded-2xl p-8 max-w-sm w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {sent ? (
              <div className="text-center">
                <div className="text-4xl mb-4">📧</div>
                <h2 className="text-xl font-bold text-white mb-2">¡Revisa tu email!</h2>
                <p className="text-white/60 text-sm mb-6">
                  Te hemos enviado un enlace mágico a <strong className="text-white">{email}</strong>.
                  Haz clic en él para iniciar sesión.
                </p>
                <button
                  onClick={handleClose}
                  className="text-white/40 text-sm hover:text-white transition-colors"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-white mb-2">Guardar tu análisis</h2>
                <p className="text-white/60 text-sm mb-6">
                  Inicia sesión para guardar y acceder a tus análisis desde cualquier dispositivo.
                </p>
                <form onSubmit={handleSubmit}>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-green-500/50 transition-colors mb-4"
                  />
                  {error && (
                    <p className="text-red-400 text-sm mb-4">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-400 text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? 'Enviando...' : 'Enviar enlace mágico'}
                  </button>
                </form>
                <button
                  onClick={handleClose}
                  className="w-full text-white/40 text-sm mt-4 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
