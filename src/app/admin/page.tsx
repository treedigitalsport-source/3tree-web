"use client";

import { useState } from "react";
import { createPodcastEpisode } from "@/app/actions/podcast";
import { createJournalArticle } from "@/app/actions/journal";
import { UploadCloud, CheckCircle2, Loader2, ArrowLeft, PenTool, Mic } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const [journalLoading, setJournalLoading] = useState(false);
  const [journalSuccess, setJournalSuccess] = useState(false);
  const [journalError, setJournalError] = useState("");
  
  const [activeTab, setActiveTab] = useState<"podcast" | "journal">("podcast");

  async function handlePodcastSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createPodcastEpisode(formData);

    if (result.success) {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } else {
      setError(result.error || "Ocurrió un error.");
    }
    setLoading(false);
  }

  async function handleJournalSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setJournalLoading(true);
    setJournalSuccess(false);
    setJournalError("");

    const formData = new FormData(e.currentTarget);
    const result = await createJournalArticle(formData);

    if (result.success) {
      setJournalSuccess(true);
      (e.target as HTMLFormElement).reset();
    } else {
      setJournalError(result.error || "Ocurrió un error.");
    }
    setJournalLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 md:p-20 font-sans">
      <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-12">
        <ArrowLeft className="w-4 h-4" /> Volver a la web
      </Link>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-display font-bold mb-2">Panel Administrativo</h1>
        <p className="text-white/50 mb-8">Sube contenido directamente a tu base de datos de Firebase.</p>

        <div className="flex gap-4 mb-8">
          <button onClick={() => setActiveTab("podcast")} className={`px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 transition-colors ${activeTab === "podcast" ? "bg-brandOrange text-white" : "bg-white/5 text-white/50 hover:bg-white/10"}`}>
            <Mic className="w-4 h-4" /> Podcast
          </button>
          <button onClick={() => setActiveTab("journal")} className={`px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 transition-colors ${activeTab === "journal" ? "bg-brandOrange text-white" : "bg-white/5 text-white/50 hover:bg-white/10"}`}>
            <PenTool className="w-4 h-4" /> Journal (Neil)
          </button>
        </div>

        {activeTab === "podcast" && (
          <form onSubmit={handlePodcastSubmit} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-12 space-y-8 backdrop-blur-xl">
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brandOrange">Título del Episodio</label>
            <input name="title" required type="text" className="w-full bg-transparent border-b border-white/20 pb-2 text-2xl focus:outline-none focus:border-brandOrange transition-colors" placeholder="Ej. El futuro del deporte..." />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brandOrange">Fecha</label>
              <input name="date" required type="text" className="w-full bg-transparent border-b border-white/20 pb-2 focus:outline-none focus:border-brandOrange transition-colors" placeholder="Ej. 12 Ago, 2026" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brandOrange">Duración</label>
              <input name="duration" type="text" className="w-full bg-transparent border-b border-white/20 pb-2 focus:outline-none focus:border-brandOrange transition-colors" placeholder="Ej. 45 min" />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brandOrange block">Archivo de Audio / Video</label>
            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-brandOrange/50 transition-colors bg-black/20">
              <UploadCloud className="w-8 h-8 mx-auto mb-4 text-white/40" />
              <input name="mediaFile" required type="file" accept="video/mp4,audio/mp3,audio/wav" className="block w-full text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brandOrange file:text-white hover:file:bg-brandOrange/80 cursor-pointer" />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brandOrange block">Imagen de Portada (Opcional)</label>
            <input name="thumbnailFile" type="file" accept="image/png,image/jpeg" className="block w-full text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer" />
          </div>

          <div className="pt-8 flex items-center gap-6">
            <button disabled={loading} type="submit" className="bg-brandOrange text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(242,101,34,0.4)] transition-all flex items-center gap-2 disabled:opacity-50">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Subiendo...</> : "Publicar Episodio"}
            </button>

            {success && <span className="text-green-400 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> ¡Episodio Publicado!</span>}
            {error && <span className="text-red-400 text-sm">{error}</span>}
          </div>

        </form>
        )}
        {activeTab === "journal" && (
          <form onSubmit={handleJournalSubmit} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-12 space-y-8 backdrop-blur-xl">
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brandOrange">Título del Artículo</label>
              <input name="title" required type="text" className="w-full bg-transparent border-b border-white/20 pb-2 text-2xl focus:outline-none focus:border-brandOrange transition-colors" placeholder="Ej. El futuro de la IA en el deporte..." />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brandOrange">Autor</label>
                <input name="author" required defaultValue="Neil Alvarado" type="text" className="w-full bg-transparent border-b border-white/20 pb-2 focus:outline-none focus:border-brandOrange transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brandOrange">Categoría</label>
                <input name="category" required type="text" className="w-full bg-transparent border-b border-white/20 pb-2 focus:outline-none focus:border-brandOrange transition-colors" placeholder="Ej. Biomecánica" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brandOrange">Contenido del Artículo</label>
              <textarea name="content" required rows={10} className="w-full bg-black/20 border border-white/20 rounded-xl p-4 focus:outline-none focus:border-brandOrange transition-colors resize-none mt-2" placeholder="Escribe el contenido aquí..."></textarea>
            </div>

            <div className="space-y-4 pt-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brandOrange block">Imagen Principal (Opcional)</label>
              <input name="imageFile" type="file" accept="image/png,image/jpeg" className="block w-full text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer" />
            </div>

            <div className="pt-8 flex items-center gap-6">
              <button disabled={journalLoading} type="submit" className="bg-brandOrange text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(242,101,34,0.4)] transition-all flex items-center gap-2 disabled:opacity-50">
                {journalLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Publicando...</> : "Publicar Artículo"}
              </button>

              {journalSuccess && <span className="text-green-400 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> ¡Artículo Publicado!</span>}
              {journalError && <span className="text-red-400 text-sm">{journalError}</span>}
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
