import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Crear un trámite (POST)
export async function POST(req: Request) {
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
      monto, // Nuevo campo
    } = body;

    if (
      !nombreSolicitante ||
      !nombreDocumento ||
      !tipoDocumento ||
      !tipoPapel ||
      !carrera ||
      !cantidad ||
      !numeroTransferencia ||
      monto === undefined // Validación del nuevo campo
    ) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // Generar un código único (5 dígitos)
    const codigoUnico = Math.floor(10000 + Math.random() * 90000).toString();

    // Crear el trámite con el estado inicial y el historial en formato JSON
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
        monto, // Nuevo campo agregado
        status: "EN_REVISION",
        statusHistory: JSON.stringify([
          {
            status: "EN_REVISION",
            fecha: new Date().toISOString(),
          },
        ]),
      },
    });

    return NextResponse.json(tramite, { status: 201 });
  } catch (error) {
    console.error("Error al crear trámite:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Obtener todos los trámites (GET)
export async function GET() {
  try {
    const tramites = await prisma.tramite.findMany();
    return NextResponse.json(tramites, { status: 200 });
  } catch (error) {
    console.error("Error al obtener trámites:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Cambiar el estado de un trámite (PUT)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, nuevoStatus } = body;

    if (!id || !nuevoStatus) {
      return NextResponse.json(
        { error: "ID y nuevoStatus son obligatorios" },
        { status: 400 }
      );
    }

    // Obtener el trámite actual para actualizar el historial
    const tramite = await prisma.tramite.findUnique({
      where: { id },
    });

    if (!tramite) {
      return NextResponse.json(
        { error: "Trámite no encontrado" },
        { status: 404 }
      );
    }

    // Actualizar el historial de estados
    const historialActual = JSON.parse(tramite.statusHistory || "[]");
    historialActual.push({
      status: nuevoStatus,
      fecha: new Date().toISOString(),
    });

    // Actualizar el estado y el historial del trámite
    const tramiteActualizado = await prisma.tramite.update({
      where: { id },
      data: {
        status: nuevoStatus,
        statusHistory: JSON.stringify(historialActual),
      },
    });

    return NextResponse.json(tramiteActualizado, { status: 200 });
  } catch (error) {
    console.error("Error al cambiar estado del trámite:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
