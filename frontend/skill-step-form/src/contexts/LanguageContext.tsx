import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: any) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n, t } = useTranslation();
  
  // Function to detect browser language
  const detectBrowserLanguage = (): Language => {
    // Check if user has a saved preference first
    const savedLanguage = localStorage.getItem('i18nextLng') as Language;
    if (savedLanguage === 'en' || savedLanguage === 'de') {
      return savedLanguage;
    }
    
    // Detect from browser language
    const browserLang = navigator.language || (navigator as any).userLanguage || 'en';
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    // Set German for German users, English for everyone else
    return langCode === 'de' ? 'de' : 'en';
  };

  const [language, setLanguageState] = useState<Language>(() => {
    // Initialize with detected language on first render
    return detectBrowserLanguage();
  });

  useEffect(() => {
    // Initialize language from localStorage or browser on mount
    const detectedLang = detectBrowserLanguage();
    
    // Update state and i18n
    setLanguageState(detectedLang);
    i18n.changeLanguage(detectedLang);
    
    // Save to localStorage if not already saved
    if (!localStorage.getItem('i18nextLng')) {
      localStorage.setItem('i18nextLng', detectedLang);
    }
  }, [i18n]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

