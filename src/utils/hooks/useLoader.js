'use client';

import { useState, useCallback } from 'react';

export const useLoader = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [loadingText, setLoadingText] = useState('Cargando...');

  const startLoading = useCallback((text = 'Cargando...') => {
    setLoadingText(text);
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingText('Cargando...');
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

  return {
    isLoading,
    loadingText,
    startLoading,
    stopLoading,
    withLoader
  };
};

// Hook para múltiples estados de carga
export const useMultiLoader = () => {
  const [loaders, setLoaders] = useState({});

  const startLoading = useCallback((key, text = 'Cargando...') => {
    setLoaders(prev => ({
      ...prev,
      [key]: { isLoading: true, text }
    }));
  }, []);

  const stopLoading = useCallback((key) => {
    setLoaders(prev => ({
      ...prev,
      [key]: { isLoading: false, text: 'Cargando...' }
    }));
  }, []);

  const isLoading = useCallback((key) => {
    return loaders[key]?.isLoading || false;
  }, [loaders]);

  const getLoadingText = useCallback((key) => {
    return loaders[key]?.text || 'Cargando...';
  }, [loaders]);

  const withLoader = useCallback(async (key, asyncFunction, text = 'Cargando...') => {
    try {
      startLoading(key, text);
      const result = await asyncFunction();
      return result;
    } finally {
      stopLoading(key);
    }
  }, [startLoading, stopLoading]);

  return {
    loaders,
    isLoading,
    getLoadingText,
    startLoading,
    stopLoading,
    withLoader
  };
};
