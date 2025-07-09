// Función para agregar un producto
export async function addProducto(producto) {
  const res = await fetch('/api/productos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto),
  });
  if (!res.ok) throw new Error('Error al agregar producto');
  return await res.json();
}

// Función para editar un producto
export async function editProducto(id, producto) {
  const res = await fetch(`/api/productos?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto),
  });
  if (!res.ok) throw new Error('Error al editar producto');
  return await res.json();
} 