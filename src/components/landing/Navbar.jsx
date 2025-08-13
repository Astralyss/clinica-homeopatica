"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";  // IMPORTANTE

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Ruta actual

  // Determina el href para "Nosotros"
  const nosotrosHref = pathname === "/" ? "#AboutUs" : "/#AboutUs";

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50" aria-label="Navegación principal de la clínica homeopática">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 nav-link" aria-label="Inicio - Clínica Homeopática">
            <img src="/logo.svg" className="h-10 w-10" alt="Logo clínica homeopática consultorio homeopático" />
            <span className="text-sm font-bold text-gray-900 hover:text-green-800 transition-colors duration-300">
              Clínica Homeopática
            </span>
          </Link>
        </div>

        {/* Ícono hamburguesa (solo en móviles) */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Abrir menú de navegación">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Menú en pantallas grandes */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="nav-link">Inicio</Link>
          <Link href="/farmacia" className="nav-link">Farmacia Homeopática</Link>
          <Link href="/padecimientos" className="nav-link">Padecimientos</Link>
          <Link href={nosotrosHref} className="nav-link">Nosotros</Link>
        </div>

        {/* Botón Agendar (desktop) */}
        <div className="hidden md:block">
          <Link href="/agendarConsulta" aria-label="Agendar consulta homeopática">
            <button className="px-5 py-2 rounded-full bg-emerald-800 text-white font-semibold hover:bg-green-700 transition-colors duration-300 shadow-sm">
              Agendar Consulta
            </button>
          </Link>
        </div>
      </div>

      {/* Menú desplegable móvil */}
      {isOpen && (
        <div
          className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-md z-40 shadow-md md:hidden 
                     animate-fadeIn transform origin-top transition-all duration-300 rounded-b-3xl"
        >
          <div className="px-4 py-4 flex flex-col space-y-3">
            <Link href="/" className="nav-link" onClick={() => setIsOpen(false)}>Inicio</Link>
            <Link href="/farmacia" className="nav-link" onClick={() => setIsOpen(false)}>Farmacia Homeopática</Link>
            <Link href="/padecimientos" className="nav-link" onClick={() => setIsOpen(false)}>Padecimientos</Link>
            <Link href={nosotrosHref} className="nav-link" onClick={() => setIsOpen(false)}>Nosotros</Link>
            <Link href="/agendarConsulta" onClick={() => setIsOpen(false)} aria-label="Agendar consulta homeopática">
              <button
                className="mt-2 px-5 py-2 rounded-full bg-green-900 text-white font-semibold hover:bg-green-700 transition-colors duration-300 shadow-sm w-full"
              >
                Agendar Consulta
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;