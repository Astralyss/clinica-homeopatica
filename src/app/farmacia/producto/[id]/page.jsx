"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { use } from "react";

// Utilidad para obtener producto por ID (puedes reemplazar por fetch real)
async function fetchProducto(id) {
  const res = await fetch(`/api/productos/${id}`);
  if (!res.ok) throw new Error("No se pudo cargar el producto");
  return res.json();
}

export default function ProductoPage({ params }) {
  const { id } = use(params);
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const router = useRouter();
  const [imagenPrincipal, setImagenPrincipal] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchProducto(id)
      .then(setProducto)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (producto) {
      const imagenes = producto.imagenes && producto.imagenes.length > 0
        ? producto.imagenes
        : [{ url: "/placeholder.png" }];
      setImagenPrincipal(imagenes[0].url);
    }
  }, [producto]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-emerald-600" size={32} />
        <span className="ml-3 text-gray-600">Cargando producto...</span>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Producto no encontrado</h2>
        <p className="text-gray-600 mb-6">{error || "No se encontró el producto solicitado."}</p>
        <button
          onClick={() => router.back()}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
        >
          Volver
        </button>
      </div>
    );
  }

  // Formatear precio
  const formatPrice = (price) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

  // Agregar al carrito (placeholder)
  const handleAgregarCarrito = () => {
    // Aquí iría la lógica real
    alert(`Agregado ${cantidad} unidad(es) de ${producto.nombre} al carrito`);
  };

  // Comprar ahora (placeholder)
  const handleComprarAhora = () => {
    // Aquí iría la lógica real
    alert(`Comprar ahora: ${cantidad} unidad(es) de ${producto.nombre}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-8 mb-20 bg-white rounded-2xl shadow-xl flex flex-col md:flex-row gap-10">
      {/* Galería de imágenes */}
      <div className="flex flex-col gap-4 md:w-1/2">
        <div className="relative w-full h-80 bg-gray-100 rounded-xl overflow-hidden">
          <Image
            src={imagenPrincipal || "/placeholder.png"}
            alt={producto.nombre}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="flex gap-2 mt-2">
          {producto.imagenes && producto.imagenes.length > 0 ? (
            producto.imagenes.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setImagenPrincipal(img.url)}
                className={`w-16 h-16 rounded-lg border-2 ${imagenPrincipal === img.url ? "border-emerald-600" : "border-gray-200"} overflow-hidden`}
              >
                <Image src={img.url} alt={producto.nombre} width={64} height={64} className="object-cover w-full h-full" />
              </button>
            ))
          ) : (
            <button className="w-16 h-16 rounded-lg border-2 border-gray-200 overflow-hidden">
              <Image src="/placeholder.png" alt="Placeholder" width={64} height={64} className="object-cover w-full h-full" />
            </button>
          )}
        </div>
      </div>

      {/* Información del producto */}
      <div className="flex-1 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{producto.nombre}</h1>
        <p className="text-lg text-emerald-700 font-semibold">{formatPrice(producto.precio)}</p>
        <p className="text-gray-600 mb-2">{producto.descripcion}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">{producto.categoria}</span>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{producto.presentacion}</span>
        </div>
        <div className="mb-2">
          <span className="text-gray-700 font-medium">Beneficios:</span>
          <ul className="list-disc list-inside text-gray-600 mt-1">
            {producto.beneficios && producto.beneficios.length > 0 ? (
              producto.beneficios.map((b, i) => <li key={i}>{b}</li>)
            ) : (
              <li>No especificados</li>
            )}
          </ul>
        </div>
        <div className="mb-2">
          <span className="text-gray-700 font-medium">Stock:</span>
          <span className={`ml-2 font-bold ${producto.cantidad > 0 ? "text-emerald-600" : "text-red-600"}`}>
            {producto.cantidad > 0 ? `${producto.cantidad} disponibles` : "Sin stock"}
          </span>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <label className="text-gray-700 font-medium">Cantidad:</label>
          <input
            type="number"
            min={1}
            max={producto.cantidad}
            value={cantidad}
            onChange={e => setCantidad(Math.max(1, Math.min(producto.cantidad, Number(e.target.value))))}
            className="w-20 px-2 py-1 border rounded-lg text-center"
            disabled={producto.cantidad === 0}
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleAgregarCarrito}
            disabled={producto.cantidad === 0}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium shadow-md disabled:opacity-50"
          >
            Agregar al carrito
          </button>
          <button
            onClick={handleComprarAhora}
            disabled={producto.cantidad === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-md disabled:opacity-50"
          >
            Comprar ahora
          </button>
        </div>
      </div>
    </div>
  );
} 