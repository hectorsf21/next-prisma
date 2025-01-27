/*
  Warnings:

  - You are about to drop the column `cantidad` on the `Tramite` table. All the data in the column will be lost.
  - You are about to drop the column `carrera` on the `Tramite` table. All the data in the column will be lost.
  - You are about to drop the column `monto` on the `Tramite` table. All the data in the column will be lost.
  - You are about to drop the column `nombreDocumento` on the `Tramite` table. All the data in the column will be lost.
  - You are about to drop the column `tipoDocumento` on the `Tramite` table. All the data in the column will be lost.
  - You are about to drop the column `tipoPapel` on the `Tramite` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Documento" ADD COLUMN     "cantidad" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "carrera" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "tramiteId" INTEGER;

-- AlterTable
ALTER TABLE "Tramite" DROP COLUMN "cantidad",
DROP COLUMN "carrera",
DROP COLUMN "monto",
DROP COLUMN "nombreDocumento",
DROP COLUMN "tipoDocumento",
DROP COLUMN "tipoPapel";

-- AddForeignKey
ALTER TABLE "Documento" ADD CONSTRAINT "Documento_tramiteId_fkey" FOREIGN KEY ("tramiteId") REFERENCES "Tramite"("id") ON DELETE SET NULL ON UPDATE CASCADE;
