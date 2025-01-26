import prisma from '../../../lib/prisma';
; // Importa el cliente de Prisma

// GET: Obtener todos los usuarios
export async function GET() {
  const users = await prisma.user.findMany(); // Consulta todos los usuarios
  return new Response(JSON.stringify(users), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// POST: Crear un nuevo usuario
export async function POST(req: Request) {
  const body = await req.json(); // Parseamos el cuerpo de la solicitud
  const { name, email, password } = body;

  // Valida que todos los campos necesarios estén presentes
  if (!name || !email || !password) {
    return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Crea el nuevo usuario en la base de datos
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password, // NOTA: Hashea esta contraseña antes de almacenarla en producción
    },
  });

  return new Response(JSON.stringify(user), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// DELETE: Eliminar un usuario por ID
export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = Number(url.searchParams.get('id')); // Obtén el ID desde los parámetros de la URL

  if (!id) {
    return new Response(JSON.stringify({ error: 'Falta el ID del usuario' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await prisma.user.delete({ where: { id } });

  return new Response(JSON.stringify({ message: 'Usuario eliminado' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// PUT: Actualizar un usuario por ID
export async function PUT(req: Request) {
  const url = new URL(req.url);
  const id = Number(url.searchParams.get('id')); // Obtén el ID desde los parámetros de la URL
  const body = await req.json();
  const { name, email, password } = body;

  if (!id || !name || !email) {
    return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      password, // NOTA: Hashea la contraseña si es necesario
    },
  });

  return new Response(JSON.stringify(updatedUser), {
    headers: { 'Content-Type': 'application/json' },
  });
}
