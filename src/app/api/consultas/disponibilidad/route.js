import { NextResponse } from 'next/server';
import { HorariosService } from '../../../../utils/services/horariosService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fecha = searchParams.get('fecha');

    if (!fecha) {
      return NextResponse.json(
        { error: 'La fecha es requerida' },
        { status: 400 }
      );
    }

    // Validar formato de fecha
    const fechaObj = new Date(fecha);
    if (isNaN(fechaObj.getTime())) {
      return NextResponse.json(
        { error: 'Formato de fecha inválido' },
        { status: 400 }
      );
    }

    // Verificar que no sea sábado o domingo
    const diaSemana = fechaObj.getDay();
    if (diaSemana === 0 || diaSemana === 6) {
      return NextResponse.json({
        disponibles: [],
        mensaje: 'No se atiende sábados y domingos'
      });
    }

    // Obtener horarios disponibles
    const horariosDisponibles = await HorariosService.getHorariosDisponibles(fecha);

    return NextResponse.json({
      disponibles: horariosDisponibles,
      fecha: fecha,
      diaSemana: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][diaSemana]
    });

  } catch (error) {
    console.error('Error al obtener horarios disponibles:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 