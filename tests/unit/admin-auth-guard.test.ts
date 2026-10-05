import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { proxy } from "../../src/proxy";
import { NextRequest } from "next/server";
import { createAdminSessionToken, verifyAdminSessionToken, ADMIN_SESSION_COOKIE } from "../../src/lib/auth-admin";
import { createJournalArticle } from "../../src/app/actions/journal";

async function runAdminAuthGuardTests() {
  console.log("=== INICIANDO PRUEBAS GAP-INFRA-11 (ADMIN AUTH GUARD & DEFENSE IN DEPTH - NEXT 16 PROXY) ===");

  let testsPassed = 0;
  let totalTests = 6;

  // PRUEBA 1: GET /admin/dashboard SIN COOKIE DE SESIÓN (REDIRECCIÓN A /admin)
  try {
    const reqSubRoute = new NextRequest("http://localhost:3000/admin/dashboard");
    const resSubRoute = await proxy(reqSubRoute);
    if (resSubRoute.status === 307 || resSubRoute.status === 302 || resSubRoute.headers.get("location")?.includes("/admin")) {
      console.log(`✅ TEST 1 PASSED: Subruta protegida GET /admin/dashboard redirigida exitosamente (HTTP ${resSubRoute.status}).`);
      testsPassed++;
    } else {
      console.error(`❌ TEST 1 FAILED: Se esperaba redirección 307/302 pero se recibió ${resSubRoute.status}.`);
    }
  } catch (err) {
    console.error("❌ TEST 1 ERROR:", err);
  }

  // PRUEBA 2: GET /admin/api/config SIN COOKIE DE SESIÓN (RECHAZO HTTP 401)
  try {
    const reqApiNoCookie = new NextRequest("http://localhost:3000/admin/api/config");
    const resApiNoCookie = await proxy(reqApiNoCookie);
    if (resApiNoCookie.status === 401) {
      console.log(`✅ TEST 2 PASSED: Endpoint API /admin/api/config bloqueado con HTTP 401.`);
      testsPassed++;
    } else {
      console.error(`❌ TEST 2 FAILED: Se esperaba status 401 pero se recibió ${resApiNoCookie.status}.`);
    }
  } catch (err) {
    console.error("❌ TEST 2 ERROR:", err);
  }

  // PRUEBA 3: GET /admin CON Y SIN COOKIE DE SESIÓN (ESTADO DE CABECERA X-ADMIN-AUTHENTICATED)
  try {
    const reqUnlockUI = new NextRequest("http://localhost:3000/admin");
    const resUnlockUI = await proxy(reqUnlockUI);
    const authHeaderUnauthenticated = resUnlockUI.headers.get("x-admin-authenticated");

    const validToken = await createAdminSessionToken();
    const reqAuthenticated = new NextRequest("http://localhost:3000/admin", {
      headers: { cookie: `${ADMIN_SESSION_COOKIE}=${validToken}` }
    });
    const resAuthenticated = await proxy(reqAuthenticated);
    const authHeaderAuthenticated = resAuthenticated.headers.get("x-admin-authenticated");

    if (authHeaderUnauthenticated === "false" && authHeaderAuthenticated === "true") {
      console.log(`✅ TEST 3 PASSED: Pantalla unlock /admin renderizada correctamente con cabeceras de autenticación (unauth: false, auth: true).`);
      testsPassed++;
    } else {
      console.error(`❌ TEST 3 FAILED: Cabeceras de autenticación no coinciden: unauth=${authHeaderUnauthenticated}, auth=${authHeaderAuthenticated}`);
    }
  } catch (err) {
    console.error("❌ TEST 3 ERROR:", err);
  }

  // PRUEBA 4: SERVER ACTION INVOCADO SIN COOKIE DE SESIÓN (RECHAZO INDEPENDIENTE)
  try {
    const formDataUnauthorized = new FormData();
    formDataUnauthorized.set("title", "Artículo de Prueba No Autorizado");
    formDataUnauthorized.set("author", "Hacker");
    formDataUnauthorized.set("content", "Contenido no permitido");

    const result = await createJournalArticle(formDataUnauthorized);
    if (!result.success && result.error?.includes("Acceso denegado")) {
      console.log("✅ TEST 4 PASSED: Server Action rechazó la solicitud no autorizada de forma independiente.");
      testsPassed++;
    } else {
      console.error("❌ TEST 4 FAILED: Server Action no rechazó adecuadamente la petición.", result);
    }
  } catch (err) {
    console.error("❌ TEST 4 ERROR:", err);
  }

  // PRUEBA 5: CRIPTOGRAFÍA DE SESIÓN WEB CRYPTO API (FIRMA, EXPIRACIÓN Y MANIPULACIÓN)
  try {
    const validToken = await createAdminSessionToken();
    const isValid = await verifyAdminSessionToken(validToken);
    const isBadValid = await verifyAdminSessionToken("admin:123:456.tamperedtoken");

    if (isValid && !isBadValid) {
      console.log("✅ TEST 5 PASSED: Web Crypto API verificó token legítimo y rechazó token manipulado.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 5 FAILED: Falló verificación de tokens. legítimo=${isValid}, tampered=${isBadValid}`);
    }
  } catch (err) {
    console.error("❌ TEST 5 ERROR:", err);
  }

  // PRUEBA 6: RUTAS PÚBLICAS LIBRES DE REGRESIONES
  try {
    const reqPublic = new NextRequest("http://localhost:3000/journal");
    const resPublic = await proxy(reqPublic);
    if (resPublic.status === 200 && !resPublic.headers.has("x-admin-authenticated")) {
      console.log("✅ TEST 6 PASSED: Rutas públicas libres de regresiones y accesibles normalmente.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 6 FAILED: Ruta pública alterada inesperadamente por el proxy. status=${resPublic.status}`);
    }
  } catch (err) {
    console.error("❌ TEST 6 ERROR:", err);
  }

  console.log(`\n=== RESULTADO FINAL SUITE GAP-INFRA-11: ${testsPassed}/${totalTests} TESTS PASSED ===\n`);
  if (testsPassed !== totalTests) {
    process.exit(1);
  }
}

runAdminAuthGuardTests();
