"use server";

import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  isAuthorizedAdminKey,
  createAdminSessionToken,
} from "@/lib/auth-admin";

export async function loginAdminAction(formData: FormData) {
  try {
    const key = formData.get("adminKey") as string;
    if (!isAuthorizedAdminKey(key)) {
      return { success: false, error: "Clave de administrador inválida." };
    }

    const token = await createAdminSessionToken();
    if (!token) {
      return { success: false, error: "Servidor de autenticación no disponible." };
    }

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 8 * 60 * 60,
    });

    return { success: true };
  } catch (error) {
    console.error("[ADMIN LOGIN ERROR]", error);
    return { success: false, error: "Error al iniciar sesión de administración." };
  }
}

export async function logoutAdminAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_SESSION_COOKIE);
    return { success: true };
  } catch (error) {
    console.error("[ADMIN LOGOUT ERROR]", error);
    return { success: false, error: "Error al cerrar sesión." };
  }
}
