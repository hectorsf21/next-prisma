import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Validar los datos requeridos
    if (!email || !password) {
      return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 });
    }

    // Buscar al usuario por email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Verificar si el usuario existe
    if (!user) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    // Comparar la contraseña ingresada con la almacenada
    if (user.password !== password) {
      return NextResponse.json({ message: "Contraseña incorrecta" }, { status: 401 });
    }

    // Determinar la redirección según el rol del usuario
    let redirectUrl = "/";
    switch (user.role) {
      case "SUPERUSUARIO":
        redirectUrl = "/superusuario";
        break;
      case "COORDINACION":
        redirectUrl = "/coordinacion";
        break;
      case "FUNDEURG":
        redirectUrl = "/fundesurg";
        break;
      case "SOLICITANTE":
        redirectUrl = "/egresados";
        break;
      default:
        redirectUrl = "/"; // Página por defecto si no se reconoce el rol
        break;
    }

    // Respuesta de éxito con la redirección
    return NextResponse.json({
      message: "Inicio de sesión exitoso",
      redirect: redirectUrl,
    });
  } catch (error) {
    console.error("Error al verificar la contraseña:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
