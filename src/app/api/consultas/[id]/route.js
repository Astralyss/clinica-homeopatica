import { NextResponse } from 'next/server';
import { consultasService } from '../../../../utils/services/consultasService';

// GET - Obtener una consulta específica por ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'ID de consulta inválido' },
        { status: 400 }
      );
    }
    
    const resultado = await consultasService.obtenerConsultaPorId(id);
    
    if (resultado.success) {
      if (!resultado.data) {
        return NextResponse.json(
          { error: 'Consulta no encontrada' },
          { status: 404 }
        );
      }
      return NextResponse.json(resultado.data);
    } else {
      return NextResponse.json(
        { error: resultado.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error en GET /api/consultas/[id]:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar una consulta
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'ID de consulta inválido' },
        { status: 400 }
      );
    }
    
    // Validar que al menos un campo se esté actualizando
    const camposPermitidos = ['estado', 'notas', 'fechaConsulta', 'horaConsulta'];
    const camposActualizados = Object.keys(body).filter(campo => 
      camposPermitidos.includes(campo) && body[campo] !== undefined
    );
    
    if (camposActualizados.length === 0) {
      return NextResponse.json(
        { error: 'No se proporcionaron campos válidos para actualizar' },
        { status: 400 }
      );
    }
    
    // Si se está actualizando la fecha/hora, verificar disponibilidad
    if (body.fechaConsulta || body.horaConsulta) {
      const consultaActual = await consultasService.obtenerConsultaPorId(id);
      if (!consultaActual.success || !consultaActual.data) {
        return NextResponse.json(
          { error: 'Consulta no encontrada' },
          { status: 404 }
        );
      }
      
      const fechaNueva = body.fechaConsulta || consultaActual.data.fechaConsulta;
      const horaNueva = body.horaConsulta || consultaActual.data.horaConsulta;
      
      const disponibilidad = await consultasService.verificarDisponibilidad(
        fechaNueva,
        horaNueva
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
    }
    
    // Actualizar la consulta
    const resultado = await consultasService.actualizarEstadoConsulta(
      id,
      body.estado,
      body.notas
    );
    
    if (resultado.success) {
      return NextResponse.json({
        message: 'Consulta actualizada exitosamente',
        data: resultado.data
      });
    } else {
      return NextResponse.json(
        { error: resultado.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error en PUT /api/consultas/[id]:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar una consulta (marcar como cancelada o eliminar permanentemente)
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json().catch(() => ({}));
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'ID de consulta inválido' },
        { status: 400 }
      );
    }
    
    // Si se solicita eliminación permanente
    if (body.eliminar) {
      const resultado = await consultasService.eliminarConsulta(id);
      
      if (resultado.success) {
        return NextResponse.json({
          message: 'Consulta eliminada permanentemente',
          data: resultado.data
        });
      } else {
        return NextResponse.json(
          { error: resultado.error },
          { status: 500 }
        );
      }
    } else {
      // Cancelar consulta y liberar horario
      const resultado = await consultasService.cancelarConsulta(id);
      
      if (resultado.success) {
        return NextResponse.json({
          message: 'Consulta cancelada exitosamente',
          data: resultado.data
        });
      } else {
        return NextResponse.json(
          { error: resultado.error },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('Error en DELETE /api/consultas/[id]:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 