// apps/web/context/AppContext.tsx
'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface AppContextType {
  // your context values
}

const AppContext = createContext<AppContextType | null>(null);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const value: AppContextType = {
    // context value
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppContextProvider');
  return context;
};
