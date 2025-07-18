import { NextResponse } from 'next/server';
import { getProductoById } from '@/utils/services/productosService';

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const producto = await getProductoById(id);
    if (!producto) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    return NextResponse.json(producto);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 