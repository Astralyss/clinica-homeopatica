'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { FullScreenLoader } from '@/components/ui/Loader';

const LoaderContext = createContext();

export const useGlobalLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useGlobalLoader debe ser usado dentro de LoaderProvider');
  }
  return context;
};

export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Cargando...');
  const [loadingStack, setLoadingStack] = useState(0);

  const startLoading = useCallback((text = 'Cargando...') => {
    setLoadingText(text);
    setLoadingStack(prev => prev + 1);
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setLoadingStack(prev => {
      const newStack = prev - 1;
      if (newStack <= 0) {
        setIsLoading(false);
        setLoadingText('Cargando...');
        return 0;
      }
      return newStack;
    });
  }, []);

  const withLoader = useCallback(async (asyncFunction, text = 'Cargando...') => {
    try {
      startLoading(text);
      const result = await asyncFunction();
      return result;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  const value = {
    isLoading,
    loadingText,
    startLoading,
    stopLoading,
    withLoader
  };

  return (
    <LoaderContext.Provider value={value}>
      {children}
      {isLoading && <FullScreenLoader text={loadingText} />}
    </LoaderContext.Provider>
  );
};
