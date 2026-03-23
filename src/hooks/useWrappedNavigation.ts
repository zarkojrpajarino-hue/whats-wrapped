'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const TOTAL_SCREENS = 13;

export function useWrappedNavigation() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(0);

  const goNext = useCallback(() => {
    if (currentScreen < TOTAL_SCREENS - 1) {
      setDirection(1);
      setCurrentScreen((s) => s + 1);
    }
  }, [currentScreen]);

  const goPrev = useCallback(() => {
    if (currentScreen > 0) {
      setDirection(-1);
      setCurrentScreen((s) => s - 1);
    }
  }, [currentScreen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  // Touch/swipe handlers
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goNext();
        else goPrev();
      }
    },
    [goNext, goPrev]
  );

  // Click zones (left half = prev, right half = next)
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (x < rect.width / 3) goPrev();
      else goNext();
    },
    [goNext, goPrev]
  );

  return {
    currentScreen,
    direction,
    totalScreens: TOTAL_SCREENS,
    goNext,
    goPrev,
    onTouchStart,
    onTouchEnd,
    onClick,
  };
}
