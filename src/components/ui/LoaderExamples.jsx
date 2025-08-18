'use client';

import { useState } from 'react';
import Loader, { 
  FullScreenLoader, 
  PageLoader, 
  SectionLoader, 
  ButtonLoader 
} from './Loader';
import { useLoader, useMultiLoader } from '@/utils/hooks/useLoader';
import { useGlobalLoader } from '@/utils/context/LoaderContext';

export const LoaderExamples = () => {
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [showPage, setShowPage] = useState(false);
  const [showSection, setShowSection] = useState(false);
  
  // Hook local
  const { isLoading, startLoading, stopLoading, withLoader } = useLoader();
  
  // Hook para múltiples loaders
  const { 
    isLoading: isLoadingProducts, 
    startLoading: startLoadingProducts,
    stopLoading: stopLoadingProducts 
  } = useMultiLoader();
  
  // Hook global
  const { startLoading: startGlobalLoading, withLoader: withGlobalLoader } = useGlobalLoader();

  const handleLocalLoader = async () => {
    await withLoader(
      () => new Promise(resolve => setTimeout(resolve, 3000)),
      'Cargando datos localmente...'
    );
  };

  const handleProductsLoader = async () => {
    startLoadingProducts('products', 'Cargando productos...');
    setTimeout(() => stopLoadingProducts('products'), 3000);
  };

  const handleGlobalLoader = async () => {
    await withGlobalLoader(
      () => new Promise(resolve => setTimeout(resolve, 3000)),
      'Cargando datos globalmente...'
    );
  };

  const handleFullScreenLoader = () => {
    setShowFullScreen(true);
    setTimeout(() => setShowFullScreen(false), 3000);
  };

  const handlePageLoader = () => {
    setShowPage(true);
    setTimeout(() => setShowPage(false), 3000);
  };

  const handleSectionLoader = () => {
    setShowSection(true);
    setTimeout(() => setShowSection(false), 3000);
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Ejemplos de Loaders
      </h1>

      {/* Loaders básicos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <h3 className="font-semibold mb-2">Pequeño</h3>
          <Loader size="small" />
        </div>
        <div className="text-center">
          <h3 className="font-semibold mb-2">Default</h3>
          <Loader size="default" />
        </div>
        <div className="text-center">
          <h3 className="font-semibold mb-2">Grande</h3>
          <Loader size="large" />
        </div>
        <div className="text-center">
          <h3 className="font-semibold mb-2">Extra Grande</h3>
          <Loader size="xl" />
        </div>
      </div>

      {/* Loader de botón */}
      <div className="text-center">
        <h3 className="font-semibold mb-4">Loader de Botón</h3>
        <button 
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          disabled={isLoading}
          onClick={handleLocalLoader}
        >
          {isLoading ? <ButtonLoader /> : 'Cargar Datos'}
        </button>
      </div>

      {/* Loader de productos */}
      <div className="text-center">
        <h3 className="font-semibold mb-4">Loader de Productos</h3>
        <button 
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
          disabled={isLoadingProducts('products')}
          onClick={handleProductsLoader}
        >
          {isLoadingProducts('products') ? <ButtonLoader /> : 'Cargar Productos'}
        </button>
      </div>

      {/* Loader global */}
      <div className="text-center">
        <h3 className="font-semibold mb-4">Loader Global</h3>
        <button 
          className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
          onClick={handleGlobalLoader}
        >
          Cargar Globalmente
        </button>
      </div>

      {/* Loaders de pantalla completa */}
      <div className="text-center space-y-4">
        <h3 className="font-semibold">Loaders de Pantalla Completa</h3>
        <div className="space-x-4">
          <button 
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
            onClick={handleFullScreenLoader}
          >
            Mostrar FullScreen
          </button>
          <button 
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
            onClick={handlePageLoader}
          >
            Mostrar Page
          </button>
          <button 
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600"
            onClick={handleSectionLoader}
          >
            Mostrar Section
          </button>
        </div>
      </div>

      {/* Loaders condicionales */}
      {showFullScreen && <FullScreenLoader text="Cargando pantalla completa..." />}
      {showPage && <PageLoader text="Cargando página..." />}
      {showSection && <SectionLoader text="Cargando sección..." />}
    </div>
  );
};

export default LoaderExamples;
