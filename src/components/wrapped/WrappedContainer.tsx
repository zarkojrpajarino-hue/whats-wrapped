'use client';

import { AnimatePresence } from 'framer-motion';
import { useWrappedNavigation } from '@/hooks/useWrappedNavigation';
import { ProgressBar } from '../ui/ProgressBar';
import { WrappedData } from '@/lib/types';

import { Screen01FirstMessage } from './Screen01FirstMessage';
import { Screen02TotalMessages } from './Screen02TotalMessages';
import { Screen03LongestStreak } from './Screen03LongestStreak';
import { Screen04PeakDay } from './Screen04PeakDay';
import { Screen05ResponseTimes } from './Screen05ResponseTimes';
import { Screen06HourlyDistribution } from './Screen06HourlyDistribution';
import { Screen07WhoTalksMore } from './Screen07WhoTalksMore';
import { Screen08TopWords } from './Screen08TopWords';
import { Screen09MediaCount } from './Screen09MediaCount';
import { Screen10Eras } from './Screen10Eras';
import { Screen11InflectionPoint } from './Screen11InflectionPoint';
import { Screen12LongestMessage } from './Screen12LongestMessage';
import { Screen13Summary } from './Screen13Summary';

interface WrappedContainerProps {
  data: WrappedData;
}

const screens = [
  Screen01FirstMessage,
  Screen02TotalMessages,
  Screen03LongestStreak,
  Screen04PeakDay,
  Screen05ResponseTimes,
  Screen06HourlyDistribution,
  Screen07WhoTalksMore,
  Screen08TopWords,
  Screen09MediaCount,
  Screen10Eras,
  Screen11InflectionPoint,
  Screen12LongestMessage,
  Screen13Summary,
];

export function WrappedContainer({ data }: WrappedContainerProps) {
  const { currentScreen, direction, totalScreens, onTouchStart, onTouchEnd, onClick } =
    useWrappedNavigation();

  const ScreenComponent = screens[currentScreen];

  return (
    <div
      className="fixed inset-0 overflow-hidden select-none cursor-pointer"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClick={onClick}
    >
      <ProgressBar current={currentScreen} total={totalScreens} />
      <AnimatePresence mode="wait" custom={direction}>
        <ScreenComponent key={currentScreen} data={data} direction={direction} />
      </AnimatePresence>
    </div>
  );
}
