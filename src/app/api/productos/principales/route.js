import { NextResponse } from 'next/server';
import { ProductosService } from '@/utils/services/productosService';

export async function GET() {
  const resultado = await ProductosService.obtenerPrincipales();
  if (resultado.success) {
    return NextResponse.json(resultado.data, { status: 200 });
  } else {
    return NextResponse.json({ error: resultado.error }, { status: 500 });
  }
} 