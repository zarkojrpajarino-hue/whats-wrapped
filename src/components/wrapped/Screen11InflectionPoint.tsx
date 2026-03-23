'use client';

import { motion } from 'framer-motion';
import { ScreenLayout } from './ScreenLayout';
import { WrappedData } from '@/lib/types';

export function Screen11InflectionPoint({ data, direction }: { data: WrappedData; direction: number }) {
  const ip = data.inflectionPoint;
  const formatDate = (d: Date) =>
    d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  // Create simple chart data around inflection point
  const prev = ip.previousCount;
  const curr = ip.count;
  const points = [
    prev * 0.7,
    prev * 0.9,
    prev,
    curr,
    curr * 0.9,
    curr * 0.85,
    curr * 0.8,
  ];
  const maxVal = Math.max(...points);

  return (
    <ScreenLayout gradient="bg-gradient-to-b from-red-950 via-rose-900 to-pink-950" direction={direction}>
      <motion.p
        className="text-white/70 text-lg font-medium mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        El punto de inflexión
      </motion.p>
      <motion.p
        className="text-white/50 text-sm mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        La semana que todo cambió
      </motion.p>

      {/* SVG Chart */}
      <motion.svg
        viewBox="0 0 300 120"
        className="w-full max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((pct) => (
          <line
            key={pct}
            x1="10"
            x2="290"
            y1={100 - pct * 90}
            y2={100 - pct * 90}
            stroke="white"
            strokeOpacity="0.1"
          />
        ))}

        {/* Line */}
        <motion.polyline
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points
            .map((v, i) => `${10 + i * 46.6},${100 - (v / maxVal) * 85}`)
            .join(' ')}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.8, duration: 1.5 }}
        />

        {/* Spike dot */}
        <motion.circle
          cx={10 + 3 * 46.6}
          cy={100 - (curr / maxVal) * 85}
          r="5"
          fill="#f43f5e"
          stroke="white"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, type: 'spring' }}
        />

        {/* Label at spike */}
        <motion.text
          x={10 + 3 * 46.6}
          y={100 - (curr / maxVal) * 85 - 12}
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          {curr} msgs
        </motion.text>
      </motion.svg>

      <motion.p
        className="text-white font-bold text-base mt-6 capitalize"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        {formatDate(ip.weekStart)}
      </motion.p>

      <motion.p
        className="text-white/40 text-sm mt-4 italic text-center max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.3 }}
      >
        ¿Qué pasó esa semana? Solo vosotros lo sabéis.
      </motion.p>
    </ScreenLayout>
  );
}
