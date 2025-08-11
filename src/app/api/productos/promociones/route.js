import { ProductosService } from '@/utils/services/productosService';

export async function GET() {
  try {
    const resultado = await ProductosService.obtenerEnPromocion();

    if (!resultado.success) {
      return new Response(JSON.stringify({ error: resultado.error }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(resultado.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Error al obtener productos en promoción', 
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
