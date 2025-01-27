import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Obtener todos los documentos (GET)
export async function GET(req: NextRequest) {
  try {
    const documentos = await prisma.documento.findMany();
    return NextResponse.json(documentos, { status: 200 });
  } catch (error) {
    console.error("Error al obtener documentos:", error);
    return NextResponse.json({ error: "Error al obtener documentos" }, { status: 500 });
  }
}

// Crear un nuevo documento (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, tipoDocumento, tipoPapel, precio } = body;

    if (!nombre || !tipoDocumento || !tipoPapel || precio === undefined) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    const documento = await prisma.documento.create({
      data: {
        nombre,
        tipoDocumento,
        tipoPapel,
        precio: parseFloat(precio),
      },
    });

    return NextResponse.json(documento, { status: 201 });
  } catch (error) {
    console.error("Error al crear documento:", error);
    return NextResponse.json({ error: "Error al crear documento" }, { status: 500 });
  }
}

// Actualizar un documento (PUT)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, nombre, tipoDocumento, tipoPapel, precio } = body;

    if (!id || !nombre || !tipoDocumento || !tipoPapel || precio === undefined) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    const documento = await prisma.documento.update({
      where: { id },
      data: {
        nombre,
        tipoDocumento,
        tipoPapel,
        precio: parseFloat(precio),
      },
    });

    return NextResponse.json(documento, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar documento:", error);
    return NextResponse.json({ error: "Error al actualizar documento" }, { status: 500 });
  }
}

// Eliminar un documento (DELETE)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id") || "", 10);

    if (!id) {
      return NextResponse.json({ error: "ID del documento es obligatorio" }, { status: 400 });
    }

    await prisma.documento.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Documento eliminado con éxito" }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar documento:", error);
    return NextResponse.json({ error: "Error al eliminar documento" }, { status: 500 });
  }
}
