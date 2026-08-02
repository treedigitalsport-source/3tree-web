"use server";

import { db } from "@/lib/firebase-admin";

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !message) {
      return { success: false, error: "Todos los campos son obligatorios" };
    }

    await db.collection("leads").add({
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
      status: "new"
    });

    return { success: true };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { success: false, error: "Error al enviar el mensaje" };
  }
}
