import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    // Obtener token de las cookies
    const token = req.cookies.get("mytoken")?.value;

    if (!token) {
      console.error("❌ No se encontró ningún token en las cookies.");
      return NextResponse.json({ error: "No autorizado y no hay cookies" }, { status: 401 });
    }

    // Clave secreta del token
    const secret = process.env.NEXT_PUBLIC_JWT_SECRET as string;

    // Verificar token
    const decoded = jwt.verify(token, secret);
    console.log("✅ Token válido:", decoded);

    return NextResponse.json({ message: "Token válido" });
  } catch (error) {
    console.error("❌ Token inválido o expirado:", error);
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}
