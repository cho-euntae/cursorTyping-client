// apps/web/app/ClientProvider.tsx
'use client';

import { AppContextProvider } from '@/context/AppContext';

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return <AppContextProvider>{children}</AppContextProvider>;
}
