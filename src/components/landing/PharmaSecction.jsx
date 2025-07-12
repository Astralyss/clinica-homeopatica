import Link from "next/link";
import React from "react";

export default function PharmaSection() {
  const [productos, setProductos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const fetchPrincipales = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/productos/principales");
      if (!res.ok) throw new Error("No se pudieron cargar los productos principales");
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPrincipales();
  }, []);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-green-900 mb-4">
          Productos Homeopáticos Destacados
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Descubre nuestra selección de productos homeopáticos de alta calidad, 
          cuidadosamente seleccionados para tu bienestar natural.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Cargando productos...</span>
        </div>
      ) : error ? (
        <div className="text-center py-10 bg-red-50 rounded-lg border border-red-200">
          <div className="text-red-600 font-medium">Error al cargar productos</div>
          <div className="text-red-500 text-sm mt-1">{error}</div>
          <button onClick={fetchPrincipales} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Reintentar</button>
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <div className="text-gray-500 text-lg">No hay productos destacados disponibles.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 flex flex-col h-full"
            >
              {/* Imagen del producto */}
              <div className="relative h-64 bg-white flex items-center justify-center p-4">
                <img
                  src={producto.imagenes && producto.imagenes[0] ? producto.imagenes[0].url : '/productos/placeholder.png'}
                  alt={producto.nombre}
                  className="max-h-56 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Contenido */}
              <div className="p-6 flex flex-col h-full">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-800 transition-colors line-clamp-2">
                  {producto.nombre}
                </h3>

                {/* Beneficios */}
                {producto.beneficios && producto.beneficios.length > 0 ? (
                  <div className="mb-4 flex-grow">
                    <h4 className="text-sm font-semibold text-green-700 mb-2 uppercase tracking-wide">
                      Beneficios principales
                    </h4>
                    <ul className="space-y-1">
                      {producto.beneficios.slice(0, 3).map((beneficio, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600">
                          <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          <span className="leading-relaxed">{beneficio}</span>
                        </li>
                      ))}
                      {producto.beneficios.length > 3 && (
                        <li className="text-xs text-green-600 font-medium pl-3">
                          +{producto.beneficios.length - 3} beneficios más
                        </li>
                      )}
                    </ul>
                  </div>
                ) : (
                  <div className="mb-4 flex-grow">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {producto.descripcion || "Producto homeopático de alta calidad"}
                    </p>
                  </div>
                )}

                {/* Precio y acción */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  {producto.precio ? (
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-green-700">
                        ${producto.precio}
                      </span>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        MXN
                      </span>
                    </div>
                  ) : (
                    <span className="text-green-600 font-medium">
                      Consultar precio
                    </span>
                  )}
                  
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md">
                    Ver detalles
                  </button>
                </div>
              </div>

              {/* Indicador de destacado */}
              <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                Destacado
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botón para ver tienda completa */}
      <div className="flex justify-center mt-12">
        <Link href="/farmacia">
          <button className="group px-8 py-4 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            <span className="flex items-center">
              Ver tienda completa
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>
        </Link>
      </div>
    </section>
  );
}