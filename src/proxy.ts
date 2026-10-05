import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "./lib/auth-admin";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/admin")) {
    const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const isValid = await verifyAdminSessionToken(sessionToken);

    // 🛡️ SUBRUTAS DE API DE ADMINISTRACIÓN: Rechazo estricto con HTTP 401 si no hay sesión
    if (pathname.startsWith("/admin/api") && !isValid) {
      return NextResponse.json(
        { error: "Acceso denegado: Sesión de administración no autorizada.", status: 401 },
        { status: 401 }
      );
    }

    // 🛡️ SUBRUTAS INTERNAS PROTEGIDAS BAJO /admin/*: Redirección a la pantalla de login /admin si no hay sesión
    if (pathname.startsWith("/admin/") && pathname !== "/admin" && pathname !== "/admin/login" && !isValid) {
      const redirectUrl = new URL("/admin", request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // 🛡️ RUTA RENDERIZADA /admin: Pasa cabecera de estado para permitir la pantalla de login o la consola administrativa
    const response = NextResponse.next();
    response.headers.set("x-admin-authenticated", isValid ? "true" : "false");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
