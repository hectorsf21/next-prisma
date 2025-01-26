-- CreateTable
CREATE TABLE "Tramite" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(5) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'EN_REVISION',
    "nombreSolicitante" VARCHAR(255) NOT NULL,
    "nombreDocumento" VARCHAR(255) NOT NULL,
    "tipoDocumento" VARCHAR(100) NOT NULL,
    "tipoPapel" VARCHAR(100) NOT NULL,
    "carrera" VARCHAR(100) NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "numeroTransferencia" VARCHAR(255) NOT NULL,
    "statusHistory" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tramite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tramite_codigo_key" ON "Tramite"("codigo");
