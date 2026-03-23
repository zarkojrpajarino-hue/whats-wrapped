'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { WrappedData } from './types';

interface WrappedContextType {
  data: WrappedData | null;
  setData: (data: WrappedData) => void;
}

const WrappedContext = createContext<WrappedContextType>({
  data: null,
  setData: () => {},
});

export function WrappedProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<WrappedData | null>(null);
  return (
    <WrappedContext.Provider value={{ data, setData }}>
      {children}
    </WrappedContext.Provider>
  );
}

export function useWrappedData() {
  return useContext(WrappedContext);
}
