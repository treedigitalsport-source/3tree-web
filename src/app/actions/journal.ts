"use server";

import { db, storage } from "@/lib/firebase-admin";

export async function createJournalArticle(formData: FormData) {
  try {
    // 🛡️ CAPA DE SEGURIDAD MILITAR: Autorización de Administrador
    const adminKey = formData.get("adminKey") as string;
    const expectedKey = process.env.ADMIN_SECRET_KEY || "3tree2026mil";
    if (!adminKey || adminKey !== expectedKey) {
      return { success: false, error: "Acceso denegado: Clave de administrador inválida." };
    }

    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const file = formData.get("imageFile") as File | null;

    if (!title || !author || !content) {
      return { success: false, error: "Faltan campos obligatorios" };
    }

    let imageUrl = "/hero-football.jpg";

    if (file && file.size > 0) {
      // 🛡️ VALIDACIÓN DE ARCHIVO: Solo imágenes seguras de máx 10MB
      const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!allowedImageTypes.includes(file.type) || file.size > 10 * 1024 * 1024) {
        return { success: false, error: "Archivo no permitido. Solo se admiten imágenes JPG, PNG o WEBP menores a 10MB." };
      }
      const bucket = storage.bucket();
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileName = `journal/${Date.now()}_${file.name.replace(/\s/g, '_')}`;
      const fileUpload = bucket.file(fileName);
      
      await fileUpload.save(buffer, {
        metadata: { contentType: file.type }
      });
      
      await fileUpload.makePublic();
      imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    }

    const docRef = await db.collection("articles").add({
      title,
      author,
      content,
      category: category || "General",
      imageUrl,
      readTime: "5 min",
      createdAt: new Date().toISOString(),
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating article:", error);
    return { success: false, error: "Error al publicar el artículo" };
  }
}

import { QueryDocumentSnapshot } from "@google-cloud/firestore";

export async function getJournalArticles() {
  try {
    if (!db) return { success: false, articles: [] };
    const snapshot = await db.collection("articles").orderBy("createdAt", "desc").get();
    const articles = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      ...doc.data()
    }));
    return { success: true, articles };
  } catch (error) {
    console.error("Error fetching articles:", error);
    return { success: false, articles: [] };
  }
}
