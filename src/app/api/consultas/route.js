import { NextResponse } from 'next/server';
import { consultasService } from '../../../utils/services/consultasService';

// GET - Obtener todas las consultas (con filtros opcionales)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get('estado');
    const fechaDesde = searchParams.get('fechaDesde');
    const fechaHasta = searchParams.get('fechaHasta');
    
    const filtros = {};
    if (estado) filtros.estado = estado;
    if (fechaDesde) filtros.fechaDesde = fechaDesde;
    if (fechaHasta) filtros.fechaHasta = fechaHasta;
    
    const resultado = await consultasService.obtenerConsultas(filtros);
    
    if (resultado.success) {
      return NextResponse.json(resultado.data);
    } else {
      return NextResponse.json(
        { error: resultado.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error en GET /api/consultas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear una nueva consulta
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    const camposRequeridos = ['nombre', 'apellido', 'correo', 'telefono', 'fechaSeleccionada', 'horaSeleccionada'];
    const camposFaltantes = camposRequeridos.filter(campo => !body[campo]);
    
    if (camposFaltantes.length > 0) {
      return NextResponse.json(
        { error: `Campos requeridos faltantes: ${camposFaltantes.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Verificar disponibilidad del horario
    const disponibilidad = await consultasService.verificarDisponibilidad(
      body.fechaSeleccionada,
      body.horaSeleccionada
    );
    
    if (!disponibilidad.success) {
      return NextResponse.json(
        { error: 'Error al verificar disponibilidad' },
        { status: 500 }
      );
    }
    
    if (!disponibilidad.disponible) {
      return NextResponse.json(
        { error: 'El horario seleccionado no está disponible' },
        { status: 409 }
      );
    }
    
    // Crear la consulta
    const resultado = await consultasService.crearConsulta(body);
    
    if (resultado.success) {
      return NextResponse.json(
        { 
          message: 'Consulta creada exitosamente',
          data: resultado.data 
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: resultado.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error en POST /api/consultas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 