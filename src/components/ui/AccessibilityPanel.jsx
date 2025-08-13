"use client";
import { useState, useEffect } from 'react';
import { Accessibility, Type, Eye, Volume2, VolumeX } from 'lucide-react';

export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100); // Porcentaje del tamaño base
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Aplicar cambios de accesibilidad
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }, [fontSize, highContrast, reducedMotion]);

  // Guardar preferencias en localStorage
  useEffect(() => {
    localStorage.setItem('accessibility-fontSize', fontSize.toString());
    localStorage.setItem('accessibility-highContrast', highContrast.toString());
    localStorage.setItem('accessibility-reducedMotion', reducedMotion.toString());
  }, [fontSize, highContrast, reducedMotion]);

  // Cargar preferencias guardadas
  useEffect(() => {
    const savedFontSize = localStorage.getItem('accessibility-fontSize');
    const savedHighContrast = localStorage.getItem('accessibility-highContrast');
    const savedReducedMotion = localStorage.getItem('accessibility-reducedMotion');

    if (savedFontSize) setFontSize(parseInt(savedFontSize));
    if (savedHighContrast) setHighContrast(savedHighContrast === 'true');
    if (savedReducedMotion) setReducedMotion(savedReducedMotion === 'true');
  }, []);

  const resetAccessibility = () => {
    setFontSize(100);
    setHighContrast(false);
    setReducedMotion(false);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Aquí podrías implementar la lógica para silenciar/activar sonidos
  };

  return (
    <>
      {/* Botón flotante de accesibilidad */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2"
        aria-label="Abrir panel de accesibilidad"
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
      >
        <Accessibility className="w-6 h-6" />
      </button>

      {/* Panel de accesibilidad */}
      {isOpen && (
        <div
          id="accessibility-panel"
          className="fixed bottom-20 right-6 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-6 w-80 max-w-sm"
          role="dialog"
          aria-labelledby="accessibility-title"
          aria-describedby="accessibility-description"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 
              id="accessibility-title"
              className="text-lg font-semibold text-gray-900"
            >
              Opciones de Accesibilidad
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300 rounded"
              aria-label="Cerrar panel de accesibilidad"
            >
              ×
            </button>
          </div>

          <p 
            id="accessibility-description"
            className="text-sm text-gray-600 mb-4"
          >
            Personaliza la experiencia de navegación según tus necesidades de accesibilidad.
          </p>

          {/* Control de tamaño de fuente */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Type className="w-4 h-4" />
              Tamaño de texto
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontSize(Math.max(80, fontSize - 10))}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                aria-label="Reducir tamaño de texto"
              >
                A-
              </button>
              <span className="text-sm text-gray-600 min-w-[3rem] text-center">
                {fontSize}%
              </span>
              <button
                onClick={() => setFontSize(Math.min(200, fontSize + 10))}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                aria-label="Aumentar tamaño de texto"
              >
                A+
              </button>
            </div>
          </div>

          {/* Control de contraste */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Eye className="w-4 h-4" />
              Alto contraste
            </label>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors ${
                highContrast
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-green-300`}
              aria-pressed={highContrast}
            >
              {highContrast ? 'Activado' : 'Desactivado'}
            </button>
          </div>

          {/* Control de movimiento reducido */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Accessibility className="w-4 h-4" />
              Movimiento reducido
            </label>
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors ${
                reducedMotion
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-green-300`}
              aria-pressed={reducedMotion}
            >
              {reducedMotion ? 'Activado' : 'Desactivado'}
            </button>
          </div>

          {/* Control de sonido */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              Sonido
            </label>
            <button
              onClick={toggleMute}
              className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors ${
                isMuted
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-green-300`}
              aria-pressed={isMuted}
            >
              {isMuted ? 'Silenciado' : 'Activado'}
            </button>
          </div>

          {/* Botón de reset */}
          <div className="flex gap-2">
            <button
              onClick={resetAccessibility}
              className="flex-1 py-2 px-3 bg-gray-500 text-white rounded text-sm font-medium hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Restablecer todas las opciones de accesibilidad"
            >
              Restablecer
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2 px-3 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Overlay para cerrar al hacer clic fuera */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
