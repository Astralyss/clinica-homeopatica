import { ProductosService } from '@/utils/services/productosService';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const termino = searchParams.get('search');
    const categoria = searchParams.get('categoria');

    let resultado;
    
    if (termino || categoria) {
      resultado = await ProductosService.buscar(termino || '', categoria);
    } else {
      resultado = await ProductosService.obtenerTodos();
    }

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
    return new Response(JSON.stringify({ error: 'Error al obtener productos', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const resultado = await ProductosService.crear(body);

    if (!resultado.success) {
      return new Response(JSON.stringify({ error: resultado.error }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(resultado.data), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al crear producto', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID requerido' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const resultado = await ProductosService.actualizar(id, body);

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
    return new Response(JSON.stringify({ error: 'Error al actualizar producto', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID requerido' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resultado = await ProductosService.eliminar(id);

    if (!resultado.success) {
      return new Response(JSON.stringify({ error: resultado.error }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al eliminar producto', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 