"use server";

import { db, storage } from "@/lib/firebase-admin";

export async function createPodcastEpisode(formData: FormData) {
  try {
    // 🛡️ CAPA DE SEGURIDAD MILITAR: Autorización de Administrador
    const adminKey = formData.get("adminKey") as string;
    const expectedKey = process.env.ADMIN_SECRET_KEY || "3tree2026mil";
    if (!adminKey || adminKey !== expectedKey) {
      return { success: false, error: "Acceso denegado: Clave de administrador inválida." };
    }

    const title = formData.get("title") as string;
    const date = formData.get("date") as string;
    const duration = formData.get("duration") as string;
    const file = formData.get("mediaFile") as File;
    const thumbnailFile = formData.get("thumbnailFile") as File | null;

    if (!title || !date || !file) {
      return { success: false, error: "Missing required fields" };
    }

    // 🛡️ VALIDACIÓN DE ARCHIVO MULTIMEDIA: Máx 150MB y formatos de audio/video permitidos
    const allowedMediaTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/aac", "video/mp4", "video/webm"];
    if (!allowedMediaTypes.includes(file.type) || file.size > 150 * 1024 * 1024) {
      return { success: false, error: "Archivo multimedia no permitido o excede el límite de 150MB." };
    }

    const bucket = storage.bucket();
    let mediaUrl = "";
    let thumbnailUrl = "/hero-football.jpg"; // default

    // Upload media file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `podcasts/${Date.now()}_${file.name.replace(/\s/g, '_')}`;
    const fileUpload = bucket.file(fileName);
    
    await fileUpload.save(buffer, {
      metadata: { contentType: file.type }
    });
    
    // Make public and get URL
    await fileUpload.makePublic();
    mediaUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    // Upload thumbnail if provided
    if (thumbnailFile) {
      const thumbBuffer = Buffer.from(await thumbnailFile.arrayBuffer());
      const thumbName = `thumbnails/${Date.now()}_${thumbnailFile.name.replace(/\s/g, '_')}`;
      const thumbUpload = bucket.file(thumbName);
      await thumbUpload.save(thumbBuffer, {
        metadata: { contentType: thumbnailFile.type }
      });
      await thumbUpload.makePublic();
      thumbnailUrl = `https://storage.googleapis.com/${bucket.name}/${thumbName}`;
    }

    const docRef = await db.collection("podcasts").add({
      title,
      date,
      duration: duration || "0 min",
      mediaUrl,
      thumbnailUrl,
      createdAt: new Date().toISOString(),
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating episode:", error);
    return { success: false, error: "Failed to create episode" };
  }
}

import { QueryDocumentSnapshot } from "@google-cloud/firestore";

export async function getPodcastEpisodes() {
  try {
    if (!db) return { success: false, episodes: [] };
    const snapshot = await db.collection("podcasts").orderBy("createdAt", "desc").get();
    const episodes = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      ...doc.data()
    }));
    return { success: true, episodes };
  } catch (error) {
    console.error("Error fetching episodes:", error);
    return { success: false, episodes: [] };
  }
}

export async function createPodcastNews(formData: FormData) {
  try {
    // 🛡️ CAPA DE SEGURIDAD MILITAR: Autorización de Administrador
    const adminKey = formData.get("adminKey") as string;
    const expectedKey = process.env.ADMIN_SECRET_KEY || "3tree2026mil";
    if (!adminKey || adminKey !== expectedKey) {
      return { success: false, error: "Acceso denegado: Clave de administrador inválida." };
    }

    if (!db || !storage) return { success: false, error: "Database not connected" };
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const desc = formData.get("desc") as string;
    const videoFile = formData.get("videoFile") as File | null;

    if (!title || !category || !desc) {
      return { success: false, error: "Missing required fields" };
    }

    let videoUrl = "";

    if (videoFile && videoFile.size > 0) {
      // 🛡️ VALIDACIÓN DE VIDEO: Máx 150MB y formatos permitidos
      const allowedVideoTypes = ["video/mp4", "video/webm", "video/quicktime"];
      if (!allowedVideoTypes.includes(videoFile.type) || videoFile.size > 150 * 1024 * 1024) {
        return { success: false, error: "Archivo de video no permitido o excede el límite de 150MB." };
      }
      const bucket = storage.bucket();
      const arrayBuffer = await videoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileName = `news_videos/${Date.now()}_${videoFile.name.replace(/\s/g, '_')}`;
      const fileUpload = bucket.file(fileName);
      
      await fileUpload.save(buffer, {
        metadata: { contentType: videoFile.type }
      });
      
      await fileUpload.makePublic();
      videoUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    }

    const docRef = await db.collection("podcastNews").add({
      title,
      category,
      desc,
      videoUrl,
      createdAt: new Date().toISOString(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating podcast news:", error);
    return { success: false, error: "Failed to create podcast news" };
  }
}

export async function getPodcastNews() {
  try {
    if (!db) return { success: false, news: [] };
    const snapshot = await db.collection("podcastNews").orderBy("createdAt", "desc").get();
    const news = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      ...doc.data()
    }));
    return { success: true, news };
  } catch (error) {
    console.error("Error fetching podcast news:", error);
    return { success: false, news: [] };
  }
}
