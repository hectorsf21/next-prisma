import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, nuevoStatus } = body;

  if (!id || !nuevoStatus) {
    return new Response(JSON.stringify({ error: "Faltan datos obligatorios" }), {
      status: 400,
    });
  }

  const tramite = await prisma.tramite.findUnique({ where: { id } });

  if (!tramite) {
    return new Response(JSON.stringify({ error: "Trámite no encontrado" }), {
      status: 404,
    });
  }

  const statusHistory =
    typeof tramite.statusHistory === "string"
      ? JSON.parse(tramite.statusHistory)
      : [];

  statusHistory.push({
    status: nuevoStatus,
    fecha: new Date().toISOString(),
  });

  const tramiteActualizado = await prisma.tramite.update({
    where: { id },
    data: {
      status: nuevoStatus,
      statusHistory: JSON.stringify(statusHistory),
    },
  });

  return new Response(
    JSON.stringify({
      mensaje: "Estado actualizado correctamente",
      tramite: tramiteActualizado,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
