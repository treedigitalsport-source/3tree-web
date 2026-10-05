import { config } from "dotenv";
config({ path: ".env.local" });

import { POST } from "../../src/app/api/webhooks/leads/route";
import { createHmac } from "crypto";

async function runGapInfra10Tests() {
  console.log("=== INICIANDO PRUEBAS GAP-INFRA-10 (WEBHOOK HMAC AUTH) ===");

  const secret = process.env.ADMIN_SECRET_KEY;
  if (!secret) {
    console.error("❌ ERROR CRÍTICO: process.env.ADMIN_SECRET_KEY no está configurada.");
    process.exit(1);
  }

  const validPayload = JSON.stringify({
    name: "Test Prospective Lead",
    email: "test.lead@3treedigital.com",
    organization: "Test Athletic Corp",
    message: "Inquiry regarding performance analytics platform",
    sentiment: "HIGH_INTENT",
    source: "API_DIRECT"
  });

  let testsPassed = 0;
  let totalTests = 3;

  // PRUEBA 1: PETICIÓN SIN FIRMA
  try {
    const reqNoSig = new Request("http://localhost:3000/api/webhooks/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: validPayload,
    });
    const resNoSig = await POST(reqNoSig);
    if (resNoSig.status === 401) {
      console.log("✅ TEST 1 PASSED: Petición SIN FIRMA rechazada correctamente con HTTP 401 Unauthorized.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 1 FAILED: Se esperaba status 401 pero se recibió status ${resNoSig.status}.`);
    }
  } catch (err) {
    console.error("❌ TEST 1 ERROR:", err);
  }

  // PRUEBA 2: PETICIÓN CON FIRMA INVÁLIDA
  try {
    const reqInvalidSig = new Request("http://localhost:3000/api/webhooks/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-signature": "badsignature1234567890abcdef1234567890abcdef1234567890abcdef12345678"
      },
      body: validPayload,
    });
    const resInvalidSig = await POST(reqInvalidSig);
    if (resInvalidSig.status === 401) {
      console.log("✅ TEST 2 PASSED: Petición con FIRMA INVÁLIDA rechazada correctamente con HTTP 401 Unauthorized.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 2 FAILED: Se esperaba status 401 pero se recibió status ${resInvalidSig.status}.`);
    }
  } catch (err) {
    console.error("❌ TEST 2 ERROR:", err);
  }

  // PRUEBA 3: PETICIÓN CON FIRMA HMAC-SHA256 VÁLIDA
  try {
    const validHmacHex = createHmac("sha256", secret).update(validPayload).digest("hex");
    const reqValidSig = new Request("http://localhost:3000/api/webhooks/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-signature": `sha256=${validHmacHex}`
      },
      body: validPayload,
    });
    const resValidSig = await POST(reqValidSig);
    if (resValidSig.status >= 200 && resValidSig.status < 300) {
      console.log(`✅ TEST 3 PASSED: Petición con FIRMA VÁLIDA aceptada correctamente con HTTP ${resValidSig.status}.`);
      testsPassed++;
    } else {
      console.error(`❌ TEST 3 FAILED: Se esperaba status 2xx pero se recibió status ${resValidSig.status}.`);
    }
  } catch (err) {
    console.error("❌ TEST 3 ERROR:", err);
  }

  console.log(`\n=== RESULTADO FINAL SUITE GAP-INFRA-10: ${testsPassed}/${totalTests} TESTS PASSED ===`);
  if (testsPassed !== totalTests) {
    process.exit(1);
  }
}

runGapInfra10Tests();
