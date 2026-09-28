import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LOCALES, LocaleTranslations, getTranslation } from '../locales';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof LocaleTranslations | string, fallback?: string) => string;
  formatDate: (dateStr: string | Date | undefined) => string;
  formatCurrency: (amount: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'tribal_scholar_lang';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'hi' || saved === 'en') {
      return saved as Language;
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    return getTranslation(language, key as keyof LocaleTranslations, fallback);
  };

  const formatDate = (dateStr: string | Date | undefined): string => {
    if (!dateStr) return '';
    try {
      const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
      if (isNaN(date.getTime())) return String(dateStr);
      return new Intl.DateTimeFormat(language === 'hi' ? 'hi-IN' : 'en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch {
      return String(dateStr);
    }
  };

  const formatCurrency = (amount: number): string => {
    try {
      return new Intl.NumberFormat(language === 'hi' ? 'hi-IN' : 'en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(amount);
    } catch {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatDate, formatCurrency }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
