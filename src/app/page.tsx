'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileUploader } from '@/components/upload/FileUploader';
import { AuthModal } from '@/components/auth/AuthModal';
import { UserMenu } from '@/components/auth/UserMenu';
import { useAuth } from '@/lib/auth-context';
import { useAnalysisStorage } from '@/hooks/useAnalysisStorage';
import { useWrappedData } from '@/lib/context';
import { useRouter } from 'next/navigation';

interface SavedItem {
  id: string;
  title: string;
  created_at: string;
}

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [savedList, setSavedList] = useState<SavedItem[]>([]);
  const { listAnalyses } = useAnalysisStorage();
  const { setData } = useWrappedData();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      listAnalyses().then(({ analyses }) => {
        setSavedList(analyses.map((a) => ({ id: a.id, title: a.title, created_at: a.created_at })));
      });
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAnalysis = async (id: string) => {
    const { analyses } = await listAnalyses();
    const found = analyses.find((a) => a.id === id);
    if (found) {
      setData(found.data);
      router.push('/wrapped');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-purple-950/50 to-black flex flex-col items-center justify-center px-6 relative">
      {/* Top bar */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        {!authLoading && !user && (
          <button
            onClick={() => setShowAuth(true)}
            className="text-white/50 text-sm hover:text-white transition-colors border border-white/10 rounded-full px-4 py-1.5 hover:border-white/30"
          >
            Iniciar sesión
          </button>
        )}
        <UserMenu />
      </div>

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

      {/* Saved analyses list */}
      {user && savedList.length > 0 && (
        <motion.div
          className="mt-12 w-full max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-white/40 text-xs uppercase tracking-wider mb-3">Tus análisis guardados</h3>
          <div className="space-y-2">
            {savedList.map((item) => (
              <button
                key={item.id}
                onClick={() => loadAnalysis(item.id)}
                className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl px-4 py-3 transition-colors group"
              >
                <p className="text-white text-sm font-medium group-hover:text-green-400 transition-colors">
                  {item.title}
                </p>
                <p className="text-white/30 text-xs mt-0.5">
                  {new Date(item.created_at).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </main>
  );
}
