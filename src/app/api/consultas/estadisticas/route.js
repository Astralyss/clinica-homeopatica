import { NextResponse } from 'next/server';
import { consultasService } from '../../../../utils/services/consultasService';

// GET - Obtener estadísticas de consultas
export async function GET() {
  try {
    const resultado = await consultasService.obtenerEstadisticasConsultas();
    
    if (resultado.success) {
      return NextResponse.json(resultado.data);
    } else {
      return NextResponse.json(
        { error: resultado.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error en GET /api/consultas/estadisticas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 