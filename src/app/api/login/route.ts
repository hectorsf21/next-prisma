import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;

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

    // Comparar la contraseña ingresada con la almacenada (sin hashear)
    if (user.password !== password) {
      return NextResponse.json({ message: "Contraseña incorrecta" }, { status: 401 });
    }

    // Generar el token con el rol del usuario
    const token = jwt.sign(
      { id: user.id, role: user.role }, // Payload con el ID y el rol
      JWT_SECRET, // Clave secreta
      { expiresIn: "1h" } // Expiración del token
    );

    // Serializar el token como una cookie
    const cookie = serialize("mytoken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Solo seguro en producción
      sameSite: "strict", // Proteger contra ataques CSRF
      path: "/", // Válido en todo el dominio
      maxAge: 3600, // Expira en 1 hora
    });

    // Configurar el encabezado de respuesta con la cookie
    const response = NextResponse.json({
      message: "Inicio de sesión exitoso",
      redirectUrl: getRedirectUrl(user.role), // Obtener la URL de redirección según el rol
    });
    response.headers.set("Set-Cookie", cookie);

    return response;
  } catch (error) {
    console.error("Error al verificar la contraseña:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}

// Función para obtener la URL de redirección según el rol
function getRedirectUrl(role: string) {
  switch (role) {
    case "SUPERUSUARIO":
      return "/superusuario";
    case "COORDINACION":
      return "/coordinacion";
    case "FUNDEURG":
      return "/fundesurg";
    case "SOLICITANTE":
      return "/egresados";
    default:
      return "/"; // Página por defecto si no se reconoce el rol
  }
}
