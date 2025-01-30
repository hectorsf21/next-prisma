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

    // Verificar si body es un array o un solo objeto
    const documentosArray = Array.isArray(body) ? body : [body];

    // Validar que cada documento tenga los campos necesarios
    for (const doc of documentosArray) {
      if (!doc.nombre) {
        return NextResponse.json({ error: "El campo 'nombre' es obligatorio" }, { status: 400 });
      }
      if (!doc.tipoPapel) {
        return NextResponse.json({ error: "El campo 'tipoPapel' es obligatorio" }, { status: 400 });
      }
      if (doc.precio === undefined) {
        return NextResponse.json({ error: "El campo 'precio' es obligatorio" }, { status: 400 });
      }
    }

    // Transformar la data
    const documentosData = documentosArray.map(doc => ({
      nombre: doc.nombre,
      tipoDocumento: doc.tipoPapel === "PAPEL SIMPLE" ? "NACIONAL" : "INTERNACIONAL",
      tipoPapel: doc.tipoPapel,
      precio: parseFloat(doc.precio)
    }));

    // Si solo hay un documento, usa `create`, si hay varios, usa `createMany`
    if (documentosData.length === 1) {
      const documento = await prisma.documento.create({ data: documentosData[0] });
      return NextResponse.json(documento, { status: 201 });
    } else {
      const documentos = await prisma.documento.createMany({ data: documentosData });
      return NextResponse.json(documentos, { status: 201 });
    }

  } catch (error) {
    console.error("Error al crear documento(s):", error);
    return NextResponse.json({ error: "Error al crear documento(s)" }, { status: 500 });
  }
}


// Actualizar un documento (PUT)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, nombre, tipoPapel, precio } = body; // Eliminamos tipoDocumento del body

    if (!id || !nombre || !tipoPapel || precio === undefined) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    // Determinar el tipo de documento automáticamente según el tipo de papel
    const tipoDocumento = tipoPapel === "PAPEL SIMPLE" ? "NACIONAL" : "INTERNACIONAL";

    const documento = await prisma.documento.update({
      where: { id },
      data: {
        nombre,
        tipoDocumento, // Se asigna automáticamente
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
