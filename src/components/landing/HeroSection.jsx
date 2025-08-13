import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, CalendarClock, Leaf, Heart, Shield, Users } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative py-0 overflow-hidden" aria-label="Clínica Homeopática - Bienestar Integral">

      <div className="relative max-w-4xl mx-auto text-center px-4">
        {/* Badge de confianza */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-green-200 rounded-full px-4 py-2 mb-8 shadow-sm"
        >
          <Leaf className="w-5 h-5 text-green-600 shrink-0" />
          <span className="text-sm font-medium text-green-700 leading-tight">
            Medicina natural · Más de 20 años de experiencia
          </span>
        </motion.div>

        {/* Título principal */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6"
        >
          Clínica Homeopática: Bienestar físico y{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">
            emocional
          </span>{' '}
          en armonía
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-gray-600 text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Consultorio homeopático especializado en medicina natural e integral. Acompañamos cada paso con ética, empatía y un enfoque holístico para tu salud y bienestar. Tienda homeopática con productos de alta calidad.
        </motion.p>

        {/* Botones principales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
        >
          <motion.a
            href="/farmacia"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-white bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            aria-label="Visitar tienda homeopática"
          >
            <ShoppingBag className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Ir a la farmacia homeopática
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </motion.a>

          <motion.a
            href="/agendarConsulta"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group inline-flex items-center justify-center px-8 py-4 border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            aria-label="Agendar consulta homeopática"
          >
            <CalendarClock className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Reservar consulta homeopática
          </motion.a>
        </motion.div>

        {/* Valores/características */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto"
        >
          <div className="group text-center">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl mb-4 group-hover:shadow-lg transition-all duration-300"
            >
              <Heart className="w-8 h-8 text-green-600" />
            </motion.div>
            <h3 className="font-bold text-gray-900 mb-2">Atención Personalizada</h3>
            <p className="text-gray-600 text-sm">Tratamiento homeopático adaptado a cada paciente</p>
          </div>

          <div className="group text-center">
            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl mb-4 group-hover:shadow-lg transition-all duration-300"
            >
              <Shield className="w-8 h-8 text-green-600" />
            </motion.div>
            <h3 className="font-bold text-gray-900 mb-2">Métodos Seguros</h3>
            <p className="text-gray-600 text-sm">Medicina homeopática natural sin efectos secundarios</p>
          </div>

          <div className="group text-center">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl mb-4 group-hover:shadow-lg transition-all duration-300"
            >
              <Users className="w-8 h-8 text-green-600" />
            </motion.div>
            <h3 className="font-bold text-gray-900 mb-2">Experiencia Comprobada</h3>
            <p className="text-gray-600 text-sm">Miles de pacientes satisfechos en nuestro consultorio</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}