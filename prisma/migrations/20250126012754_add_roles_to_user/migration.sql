-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPERUSUARIO', 'COORDINACION', 'FUNDEURG', 'SOLICITANTE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'SOLICITANTE';
