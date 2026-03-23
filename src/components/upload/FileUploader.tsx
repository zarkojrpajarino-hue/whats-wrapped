'use client';

import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { parseWhatsApp } from '@/lib/parser';
import { analyzeChat } from '@/lib/analyzer';
import { useWrappedData } from '@/lib/context';
import { useRouter } from 'next/navigation';

export function FileUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setData } = useWrappedData();
  const router = useRouter();

  const processFile = useCallback(
    async (file: File) => {
      setError(null);
      setIsProcessing(true);

      try {
        const text = await file.text();
        const chat = parseWhatsApp(text);

        if (chat.messages.length === 0) {
          setError('No se encontraron mensajes. Asegúrate de que es un export de WhatsApp válido.');
          setIsProcessing(false);
          return;
        }

        if (chat.participants.length < 2) {
          setError('Se necesitan al menos 2 participantes en la conversación.');
          setIsProcessing(false);
          return;
        }

        const analysis = analyzeChat(chat);
        setData(analysis);

        // Small delay for the processing animation
        await new Promise((r) => setTimeout(r, 500));
        router.push('/wrapped');
      } catch {
        setError('Error al procesar el archivo. Inténtalo de nuevo.');
        setIsProcessing(false);
      }
    },
    [setData, router]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  if (isProcessing) {
    return (
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="text-white/70 text-lg font-medium">Analizando vuestra historia...</p>
        <p className="text-white/40 text-sm">Todo se procesa en tu dispositivo</p>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <motion.div
        className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-colors cursor-pointer ${
          isDragging
            ? 'border-white bg-white/10'
            : 'border-white/30 hover:border-white/60 hover:bg-white/5'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.zip"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="text-5xl mb-4">💬</div>
        <p className="text-white text-lg font-bold mb-2">
          Sube tu chat de WhatsApp
        </p>
        <p className="text-white/50 text-sm">
          Arrastra el archivo .txt aquí o toca para seleccionar
        </p>
      </motion.div>

      {error && (
        <motion.p
          className="text-red-400 text-sm text-center mt-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}

      <div className="mt-8 flex items-center gap-3 justify-center">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <p className="text-white/40 text-xs">
          100% privado · Tu chat nunca sale de tu dispositivo
        </p>
      </div>

      <div className="mt-6 text-center">
        <p className="text-white/30 text-xs">
          WhatsApp → Chat → Más opciones → Exportar chat → Sin archivos multimedia
        </p>
      </div>
    </div>
  );
}
