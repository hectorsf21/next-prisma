/*
  Warnings:

  - You are about to alter the column `role` on the `User` table. The data in that column could be lost. The data in that column will be cast from `JsonB` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "permisosReportes" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "permisosSolicitudes" JSONB NOT NULL DEFAULT '{}',
ALTER COLUMN "role" DROP DEFAULT,
ALTER COLUMN "role" SET DATA TYPE VARCHAR(100);
