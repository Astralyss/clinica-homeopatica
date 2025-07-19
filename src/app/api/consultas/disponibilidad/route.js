import { NextResponse } from 'next/server';
import { consultasService } from '../../../../utils/services/consultasService';

// GET - Verificar disponibilidad de un horario específico
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fecha = searchParams.get('fecha');
    const hora = searchParams.get('hora');
    
    if (!fecha || !hora) {
      return NextResponse.json(
        { error: 'Se requieren los parámetros fecha y hora' },
        { status: 400 }
      );
    }
    
    const resultado = await consultasService.verificarDisponibilidad(fecha, hora);
    
    if (resultado.success) {
      return NextResponse.json({
        disponible: resultado.disponible,
        fecha,
        hora
      });
    } else {
      return NextResponse.json(
        { error: resultado.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error en GET /api/consultas/disponibilidad:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 