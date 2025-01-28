/*
  Warnings:

  - You are about to drop the column `monto` on the `Documento` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Documento" DROP COLUMN "monto";

-- AlterTable
ALTER TABLE "Tramite" ADD COLUMN     "monto" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
