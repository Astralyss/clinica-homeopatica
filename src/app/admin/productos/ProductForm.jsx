import React from 'react';
import MultipleImageUpload from '@/components/forms/MultipleImageUpload';

export default function ProductForm({
  form,
  setForm,
  onSubmit,
  imagenesProducto,
  setImagenesProducto,
  subiendoImagenes,
  loading,
  modo
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block font-semibold">Nombre</label>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-semibold">Categoría</label>
        <input
          type="text"
          name="categoria"
          value={form.categoria}
          onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block font-semibold">Precio</label>
        <input
          type="number"
          name="precio"
          value={form.precio}
          onChange={e => setForm(f => ({ ...f, precio: e.target.value }))}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-semibold">Presentación</label>
        <input
          type="text"
          name="presentacion"
          value={form.presentacion}
          onChange={e => setForm(f => ({ ...f, presentacion: e.target.value }))}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block font-semibold">Descripción</label>
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block font-semibold">Beneficios (separados por coma)</label>
        <input
          type="text"
          name="beneficios"
          value={form.beneficios}
          onChange={e => setForm(f => ({ ...f, beneficios: e.target.value }))}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block font-semibold">
          Imágenes {imagenesProducto.length > 0 && `(${imagenesProducto.length})`}
        </label>
        <MultipleImageUpload
          imagenes={imagenesProducto}
          setImagenes={setImagenesProducto}
          subiendo={subiendoImagenes}
        />
        {imagenesProducto.length === 0 && (
          <p className="text-sm text-gray-500 mt-1">
            Las imágenes son opcionales. Puedes agregar hasta 5 imágenes por producto.
          </p>
        )}
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading || subiendoImagenes}
      >
        {modo === 'editar' ? 'Actualizar' : 'Agregar'} producto
      </button>
    </form>
  );
} 