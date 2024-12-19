"use client";

import { createContext, useContext } from 'react';
import { translations } from './translations';

interface LanguageContextType {
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations['gr'];
    for (const k of keys) {
      value = value[k];
    }
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 