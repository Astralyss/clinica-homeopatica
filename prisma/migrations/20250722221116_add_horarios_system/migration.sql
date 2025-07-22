/*
  Warnings:

  - A unique constraint covering the columns `[horario_disponible_id]` on the table `consultas` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "consultas" DROP CONSTRAINT "consultas_usuario_id_fkey";

-- AlterTable
ALTER TABLE "consultas" ADD COLUMN     "horario_disponible_id" INTEGER,
ALTER COLUMN "usuario_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "horarios" (
    "id" SERIAL NOT NULL,
    "hora" TEXT NOT NULL,
    "hora_formato" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "horarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "horarios_disponibles" (
    "id" SERIAL NOT NULL,
    "fecha" DATE NOT NULL,
    "horario_id" INTEGER NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "horarios_disponibles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "horarios_hora_key" ON "horarios"("hora");

-- CreateIndex
CREATE UNIQUE INDEX "horarios_disponibles_fecha_horario_id_key" ON "horarios_disponibles"("fecha", "horario_id");

-- CreateIndex
CREATE UNIQUE INDEX "consultas_horario_disponible_id_key" ON "consultas"("horario_disponible_id");

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_horario_disponible_id_fkey" FOREIGN KEY ("horario_disponible_id") REFERENCES "horarios_disponibles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horarios_disponibles" ADD CONSTRAINT "horarios_disponibles_horario_id_fkey" FOREIGN KEY ("horario_id") REFERENCES "horarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
