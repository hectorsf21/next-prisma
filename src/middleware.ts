import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Determinamos la clave secreta dependiendo del entorno
const JWT_SECRET = process.env.JWT_SECRET ?? process.env.NEXT_PUBLIC_JWT_SECRET;

export async function middleware(req: NextRequest) {
  if (!JWT_SECRET) {
    console.error("❌ JWT_SECRET no está definido en las variables de entorno.");
    return NextResponse.next();
  }

  const token = req.cookies.get("mytoken")?.value;

  if (!token) {
    console.warn("❌ Token no encontrado en cookies.");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    console.log("✅ Token válido:", payload);

    const userRole = payload.role as UserRole | undefined; // Convertimos el rol a un tipo seguro

    if (!userRole || !Object.keys(roleRoutes).includes(userRole)) {
      console.warn("⚠️ El token no contiene un rol válido.");
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Definimos los roles posibles con un tipo específico
    type UserRole = "SUPERUSUARIO" | "COORDINACION" | "SOLICITANTE" | "FUNDESURG";
    
    // Definimos las rutas según el rol
    const roleRoutes: Record<UserRole, string> = {
      SUPERUSUARIO: "ALL", // Permite acceso a todo
      COORDINACION: "/coordinacion",
      SOLICITANTE: "/egresados",
      FUNDESURG: "/fundesurg",
    };

    // Si es SUPERUSUARIO, le permitimos el acceso sin restricción
    if (userRole === "SUPERUSUARIO") {
      return NextResponse.next();
    }

    // Obtener la ruta asignada al rol
    const allowedRoute = roleRoutes[userRole] ?? "/login"; // Usa nullish coalescing operator (??) para valores no definidos

    // Verifica si la ruta actual pertenece al usuario
    const currentPath = req.nextUrl.pathname;
    if (!currentPath.startsWith(allowedRoute)) {
      console.warn(`🔄 Redirigiendo a ${allowedRoute} según el rol.`);
      return NextResponse.redirect(new URL(allowedRoute, req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("❌ Token inválido o expirado:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

// Configurar las rutas protegidas
export const config = {
  matcher: ["/superusuario/:path*", "/coordinacion/:path*", "/fundesurg/:path*", "/egresados/:path*"],
};
