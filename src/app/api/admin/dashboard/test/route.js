import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔍 API de prueba iniciada');
    
    // Intentar importar Prisma
    let PrismaClient;
    try {
      const prismaModule = await import('../../../../../generated/prisma/index.js');
      PrismaClient = prismaModule.PrismaClient;
      console.log('✅ Prisma importado correctamente');
    } catch (importError) {
      console.error('❌ Error importando Prisma:', importError);
      return NextResponse.json(
        { error: 'Error importando Prisma', details: importError.message },
        { status: 500 }
      );
    }

    // Intentar crear instancia de Prisma
    let prisma;
    try {
      prisma = new PrismaClient();
      console.log('✅ Instancia de Prisma creada');
    } catch (prismaError) {
      console.error('❌ Error creando instancia de Prisma:', prismaError);
      return NextResponse.json(
        { error: 'Error creando instancia de Prisma', details: prismaError.message },
        { status: 500 }
      );
    }

    // Intentar una consulta simple
    try {
      const count = await prisma.producto.count();
      console.log('✅ Consulta exitosa, productos encontrados:', count);
      
      await prisma.$disconnect();
      
      return NextResponse.json({
        success: true,
        message: 'API funcionando correctamente',
        productosCount: count
      });
    } catch (queryError) {
      console.error('❌ Error en consulta:', queryError);
      await prisma.$disconnect();
      return NextResponse.json(
        { error: 'Error en consulta', details: queryError.message },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
    return NextResponse.json(
      { error: 'Error general', details: error.message },
      { status: 500 }
    );
  }
} 