import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, nuevoStatus } = body; // Recibir el nuevo estado desde el frontend

  // Obtener el trámite actual para acceder al historial existente
  const tramite = await prisma.tramite.findUnique({
    where: { id },
  });

  if (!tramite) {
    return NextResponse.json({ error: "Trámite no encontrado" }, { status: 404 });
  }

  // Parsear el historial existente
  const statusHistory = typeof tramite.statusHistory === "string"
    ? JSON.parse(tramite.statusHistory) // Validación de tipo
    : [];

  // Agregar el nuevo estado al historial
  statusHistory.push({
    status: nuevoStatus, // Usar el estado recibido
    fecha: new Date().toISOString(),
  });

  // Actualizar el estado y el historial
  const tramiteActualizado = await prisma.tramite.update({
    where: { id },
    data: {
      status: nuevoStatus, // Actualizar al nuevo estado
      statusHistory: JSON.stringify(statusHistory),
    },
  });

  return NextResponse.json({
    id: tramiteActualizado.id,
    estadoActualizado: tramiteActualizado.status,
    historial: tramiteActualizado.statusHistory,
  });
}
