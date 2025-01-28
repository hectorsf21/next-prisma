import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

// Crear un trámite con documentos relacionados (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombreSolicitante, numeroTransferencia, monto, documentos } = body;

    if (
      !nombreSolicitante ||
      !numeroTransferencia ||
      monto === undefined 
      // !documentos ||
      // !Array.isArray(documentos) ||
      // documentos.length === 0
    ) {
      return new Response(
        JSON.stringify({
          error: "Todos los campos son obligatorios, incluyendo documentos.",
        }),
        { status: 400 }
      );
    }

    // Generar un código único para el trámite
    const codigoUnico = Math.floor(10000 + Math.random() * 90000).toString();

    // Crear el trámite con los documentos relacionados
    const tramite = await prisma.tramite.create({
      data: {
        codigo: codigoUnico,
        nombreSolicitante,
        numeroTransferencia,
        monto, // Nuevo campo monto
        status: "EN_REVISION",
        statusHistory: [
          {
            status: "EN_REVISION",
            fecha: new Date().toISOString(),
          },
        ],
        documentos: {
          create: documentos.map((doc: any) => ({
            nombre: doc.nombre,
            tipoDocumento: doc.tipoDocumento,
            tipoPapel: doc.tipoPapel,
            precio: doc.precio,
            cantidad: doc.cantidad,
            carrera: doc.carrera,
          })),
        },
      },
      include: {
        documentos: true, // Incluir documentos en la respuesta
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

// Obtener todos los trámites con documentos relacionados (GET)
export async function GET() {
  try {
    const tramites = await prisma.tramite.findMany({
      include: {
        documentos: true, // Incluir documentos relacionados
      },
    });

    return new Response(JSON.stringify(tramites), { status: 200 });
  } catch (error) {
    console.error("Error al obtener trámites:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 }
    );
  }
}

// Actualizar un trámite (PUT)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, nuevoStatus, numeroTransferencia, monto } = body;

    if (!id || !nuevoStatus || !numeroTransferencia || monto === undefined) {
      return new Response(
        JSON.stringify({
          error: "ID, nuevoStatus, numeroTransferencia y monto son obligatorios.",
        }),
        { status: 400 }
      );
    }

    // Obtener el trámite actual para actualizar el historial
    const tramite = await prisma.tramite.findUnique({
      where: { id },
    });

    if (!tramite) {
      return new Response(
        JSON.stringify({ error: "Trámite no encontrado." }),
        { status: 404 }
      );
    }

    // Actualizar el historial de estados
    const historialActualizado = Array.isArray(tramite.statusHistory)
      ? [...tramite.statusHistory, { status: nuevoStatus, fecha: new Date().toISOString() }]
      : [{ status: nuevoStatus, fecha: new Date().toISOString() }];

    // Actualizar el trámite
    const tramiteActualizado = await prisma.tramite.update({
      where: { id },
      data: {
        status: nuevoStatus,
        numeroTransferencia,
        monto, // Actualizar el monto
        statusHistory: historialActualizado,
      },
      include: {
        documentos: true, // Incluir documentos en la respuesta
      },
    });

    return new Response(JSON.stringify(tramiteActualizado), { status: 200 });
  } catch (error) {
    console.error("Error al actualizar trámite:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 }
    );
  }
}

// Eliminar un trámite y sus documentos relacionados (DELETE)
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID es obligatorio para eliminar un trámite." }),
        { status: 400 }
      );
    }

    // Eliminar el trámite y sus documentos relacionados
    await prisma.tramite.delete({
      where: { id },
    });

    return new Response(
      JSON.stringify({ message: "Trámite eliminado correctamente." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar trámite:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 }
    );
  }
}
