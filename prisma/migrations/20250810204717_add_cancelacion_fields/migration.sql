-- AlterTable
ALTER TABLE "compras" ADD COLUMN     "cancelado_por" TEXT,
ADD COLUMN     "fecha_cancelacion" TIMESTAMP(3),
ADD COLUMN     "motivo_cancelacion" TEXT;
