

// function PharmaSecction() {
//   return (
//     <div>PharmaSecction</div>
//   )
// }

// export default PharmaSecction


import Link from "next/link";

export default function PharmaSecction() {
  const productos = [
    {
      id: 1,
      nombre: "Citrato de magnesio, 133 mg",
      descripcion: "Alivio natural para golpes y moretones.",
      precio: "$120 MXN",
      imagen: "/productos/8.avif",
    },
    {
      id: 2,
      nombre: "Nature's Way, Maca, Extracto prémium, 350 mg",
      descripcion: "Ideal para problemas digestivos y estrés.",
      precio: "$110 MXN",
      imagen: "/productos/maca.avif",
    },
    {
      id: 3,
      nombre: "Swanson, Ginseng indio Full Spectrum®, 100 cápsulas veganas",
      descripcion: "Tratamiento para fiebre e inflamación.",
      precio: "$130 MXN",
      imagen: "/productos/swanson.avif",
    },
    {
      id: 4,
      nombre: "NutraChamps, Colágeno, 90 cápsulas",
      descripcion: "Tratamiento para fiebre e inflamación.",
      precio: "$130 MXN",
      imagen: "/productos/colageno.avif",
    },
    {
      id: 5,
      nombre: "Nature's Way, Equinácea, 500 mg, 30 ml",
      descripcion: "Tratamiento para fiebre e inflamación.",
      precio: "$130 MXN",
      imagen: "/productos/equinacea.avif",
    },
    {
      id: 6,
      nombre: "Vitamina D",
      descripcion: "Tratamiento para fiebre e inflamación.",
      precio: "$130 MXN",
      imagen: "/productos/vitaminaD.avif",
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-center text-green-900 mb-6">
        Productos Homeopáticos Destacados
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="h-48 w-full bg-white flex items-center justify-center p-4">
    <img
      src={producto.imagen}
      alt={producto.nombre}
      className="max-h-full max-w-full object-contain"
    />
  </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {producto.nombre}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {producto.descripcion}
              </p>
              <span className="text-green-700 font-semibold">
                {producto.precio}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Botón */}
      <div className="flex justify-center mt-10">
        <Link href="/farmacia">
          <button className="px-6 py-3 rounded-full bg-emerald-800 text-white font-medium hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base">
            Ver tienda completa
          </button>
        </Link>
      </div>
    </section>
  );
}
