'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

const Loader = ({ 
  size = 'default', 
  text = 'Cargando...', 
  showText = true,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Tamaños predefinidos
  const sizeClasses = {
    small: 'w-8 h-8',
    default: 'w-16 h-16',
    large: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  const logoSize = {
    small: 24,
    default: 48,
    large: 72,
    xl: 96
  };

  const circleSize = {
    small: 32,
    default: 64,
    large: 96,
    xl: 128
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Círculo giratorio */}
        <div 
          className={`absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin`}
          style={{
            width: circleSize[size],
            height: circleSize[size],
            top: `calc(50% - ${circleSize[size] / 2}px)`,
            left: `calc(50% - ${circleSize[size] / 2}px)`
          }}
        />
        
        {/* Logo centrado */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/logo.svg"
            alt="Logo Clínica Homeopática"
            width={logoSize[size]}
            height={logoSize[size]}
            className="animate-pulse"
          />
        </div>
      </div>
      
      {showText && (
        <p className="mt-4 text-gray-600 text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

// Loader de pantalla completa
export const FullScreenLoader = ({ text = 'Cargando...' }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
      <Loader size="large" text={text} />
    </div>
  );
};

// Loader de página
export const PageLoader = ({ text = 'Cargando página...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader size="large" text={text} />
    </div>
  );
};

// Loader de sección
export const SectionLoader = ({ text = 'Cargando...' }) => {
  return (
    <div className="py-20 flex items-center justify-center">
      <Loader size="default" text={text} />
    </div>
  );
};

// Loader de botón
export const ButtonLoader = ({ size = 'small', className = '' }) => {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <Loader size={size} showText={false} />
    </div>
  );
};

export default Loader;
