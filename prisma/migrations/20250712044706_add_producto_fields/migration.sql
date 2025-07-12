/*
  Warnings:

  - You are about to drop the column `destacadoEnLanding` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `idProducto` on the `Producto` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_producto]` on the table `Producto` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_producto` to the `Producto` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Producto_idProducto_key";

-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "destacadoEnLanding",
DROP COLUMN "idProducto",
ADD COLUMN     "cantidad" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "es_principal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "id_producto" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Producto_id_producto_key" ON "Producto"("id_producto");
