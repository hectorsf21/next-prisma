import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

// Crear un trámite (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      nombreSolicitante,
      nombreDocumento,
      tipoDocumento,
      tipoPapel,
      carrera,
      cantidad,
      numeroTransferencia,
      monto, // Nuevo campo para monto
    } = body;

    if (
      !nombreSolicitante ||
      !nombreDocumento ||
      !tipoDocumento ||
      !tipoPapel ||
      !carrera ||
      !cantidad ||
      !numeroTransferencia ||
      monto === undefined
    ) {
      return new Response(
        JSON.stringify({ error: "Todos los campos son obligatorios" }),
        { status: 400 }
      );
    }

    // Generar un código único (5 dígitos)
    const codigoUnico = Math.floor(10000 + Math.random() * 90000).toString();

    // Crear el trámite con el estado inicial y el historial
    const tramite = await prisma.tramite.create({
      data: {
        codigo: codigoUnico,
        nombreSolicitante,
        nombreDocumento,
        tipoDocumento,
        tipoPapel,
        carrera,
        cantidad,
        numeroTransferencia,
        monto, // Campo nuevo
        status: "EN_REVISION",
        statusHistory: [
          {
            status: "EN_REVISION",
            fecha: new Date().toISOString(),
          },
        ], // Guardar como JSON
      },
    });

    return new Response(JSON.stringify(tramite), { status: 201 });
  } catch (error) {
    console.error("Error al crear trámite:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 }
    );
  }
}

// Obtener todos los trámites (GET)
export async function GET() {
  try {
    const tramites = await prisma.tramite.findMany();
    return new Response(JSON.stringify(tramites), { status: 200 });
  } catch (error) {
    console.error("Error al obtener trámites:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 }
    );
  }
}

// Cambiar el estado de un trámite (PUT)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, nuevoStatus } = body;

    if (!id || !nuevoStatus) {
      return new Response(
        JSON.stringify({ error: "ID y nuevoStatus son obligatorios" }),
        { status: 400 }
      );
    }

    // Obtener el trámite actual para actualizar el historial
    const tramite = await prisma.tramite.findUnique({
      where: { id },
    });

    if (!tramite) {
      return new Response(
        JSON.stringify({ error: "Trámite no encontrado" }),
        { status: 404 }
      );
    }

    // Manejar statusHistory
    let historialActual: { status: string; fecha: string }[] = [];

    if (Array.isArray(tramite.statusHistory)) {
      historialActual = tramite.statusHistory;
    } else if (typeof tramite.statusHistory === "string") {
      try {
        historialActual = JSON.parse(tramite.statusHistory);
      } catch (e) {
        console.error("Error al parsear statusHistory:", e);
        historialActual = [];
      }
    }

    // Agregar el nuevo estado al historial
    historialActual.push({
      status: nuevoStatus,
      fecha: new Date().toISOString(),
    });

    // Actualizar el estado y el historial del trámite
    const tramiteActualizado = await prisma.tramite.update({
      where: { id },
      data: {
        status: nuevoStatus,
        statusHistory: historialActual, // Guardar como JSON
      },
    });

    return new Response(
      JSON.stringify({
        id: tramiteActualizado.id,
        estadoActualizado: tramiteActualizado.status,
        historial: tramiteActualizado.statusHistory,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al cambiar estado del trámite:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 }
    );
  }
}
