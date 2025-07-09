"use client";
import React from 'react';
import { ChevronRight, Heart, Stethoscope, Shield, Sparkles } from 'lucide-react';

const Padecimientos = () => {
  const categorias = [
    {
      id: 1,
      titulo: "Bienestar General",
      descripcion: "Cuidado de la mente, Debilidad general, Bienestar sexual, Cuidado respiratorio",
      imagen: "/images/salud.jpg",
      icon: Heart,
      color: "from-emerald-500 to-teal-800",
      ruta: "/padecimientos/bienestarGeneral"
    },
    {
      id: 2,
      titulo: "Salud Digestiva y Nutrición",
      descripcion: "Cuidado del estómago, Control de peso, Diabetes, Cuidado cardiaco, Estreñimiento y hemorroides",
      imagen: "/images/digestiva.jpg",
      icon: Stethoscope,
      color: "from-emerald-500 to-teal-800",
      ruta: "/padecimientos/saludDigestiva"
    },
    {
      id: 3,
      titulo: "Cuidado Personal y Equilibrio Corporal",
      descripcion: "Cuidado de la piel, Cuidado del cabello, Higiene, Cuidado de ojos y oídos",
      imagen: "/images/dos.jpg",
      icon: Sparkles,
      color: "from-emerald-500 to-teal-800",
      ruta: "/padecimientos/cuidadoPersonal"
    },
    {
      id: 4,
      titulo: "Cuidado Terapéutico y Especializado",
      descripcion: "Infecciones virales, Tos y resfriado, Cuidado de huesos, articulaciones y músculos",
      imagen: "/images/terapeutico.jpg",
      icon: Shield,
      color: "from-emerald-500 to-teal-800",
      ruta: "/padecimientos/cuidadoTerapeutico"
    }
  ];

  const handleCategoryClick = (categoria) => {
    // Redireccionar a la ruta correspondiente
    window.location.href = categoria.ruta;
  };

  const CategoryCard = ({ categoria, onClick }) => {
    const IconComponent = categoria.icon;
    
    return (
      <div 
        className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden"
        onClick={() => onClick(categoria)}
      >
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${categoria.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
        
        {/* Card content */}
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-lg bg-gradient-to-br ${categoria.color} text-white shadow-lg`}>
              <IconComponent size={24} />
            </div>
            <ChevronRight className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" size={20} />
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">
            {categoria.titulo}
          </h3>
          
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {categoria.descripcion}
          </p>
          
          <div className="flex items-center text-sm font-medium text-emerald-600 group-hover:text-emerald-700 transition-colors">
            <span>Ver Mas</span>
            <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Padecimientos y Tratamientos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre nuestros tratamientos homeopáticos especializados para cada área de tu salud
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {categorias.map((categoria) => (
            <CategoryCard
              key={categoria.id}
              categoria={categoria}
              onClick={handleCategoryClick}
            />
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              ¿Por qué elegir la Homeopatía?
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Nuestros tratamientos homeopáticos están diseñados para tratar la raíz del problema, 
              no solo los síntomas. Cada tratamiento es personalizado según las necesidades específicas 
              de cada paciente, promoviendo la curación natural del organismo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Padecimientos;