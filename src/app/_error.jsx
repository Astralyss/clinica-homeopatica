'use client' // Error components must be Client Components

import Link from "next/link"
import { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log del error para debugging
    console.error(error)
  }, [error])

  return (
    <section className="min-h-screen bg-white">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        {/* Icono de error */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-6xl md:text-7xl font-bold text-green-600 mb-4">
          ¡Oops!
        </h1>

        <h2 className="text-2xl md:text-3xl font-semibold text-green-700 mb-4 text-center">
          Algo salió mal
        </h2>

        {/* Mensaje */}
        <p className="text-lg text-green-600 mb-8 text-center max-w-md">
          Estamos experimentando dificultades técnicas temporales. 
          Nuestro equipo ya ha sido notificado del problema.
        </p>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => reset()}
            className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Intentar de nuevo
          </button>
          
          <Link 
            href="/" 
            className="px-8 py-3 border-2 border-green-600 text-green-600 font-medium rounded-lg hover:bg-green-50 transition-colors duration-200 text-center"
          >
            Volver al Inicio
          </Link>
        </div>

        {/* Información de desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg max-w-2xl">
            <h3 className="font-semibold text-gray-800 mb-2">Error de desarrollo:</h3>
            <pre className="text-sm text-gray-600 overflow-auto">
              {error.message}
            </pre>
          </div>
        )}
      </div>
    </section>
  )
}