import Image from "next/image";

interface ArticleMediaFrameProps {
  src: string;
  alt: string;
  priority?: boolean;
  aspect?: "square" | "video" | "auto";
  className?: string;
  innerClassName?: string;
}

/**
 * Normativa Corporativa de Imagen 3Tree Digital:
 * - Cero recortes de cabeceras, títulos o banderas (Zero Cropping).
 * - Ajuste siempre en `object-contain` anclado arriba (`object-top`).
 * - Contenedor con relación de aspecto cuadrada o proporción de infografía nativa (`aspect-square`).
 * - Marco protegido con acolchado de seguridad contra radios de curvatura (`p-3 sm:p-5 bg-black/95`).
 */
export function ArticleMediaFrame({
  src,
  alt,
  priority = false,
  aspect = "square",
  className = "",
  innerClassName = "",
}: ArticleMediaFrameProps) {
  const aspectClass =
    aspect === "square"
      ? "aspect-square"
      : aspect === "video"
      ? "aspect-[16/9]"
      : "aspect-auto";

  return (
    <div
      className={`relative w-full ${aspectClass} overflow-hidden bg-black/95 p-3 sm:p-4 flex items-center justify-center rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl group ${className}`}
    >
      <div className={`relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden ${innerClassName}`}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-contain object-top transition-transform duration-700 group-hover:scale-[1.01]"
        />
      </div>
    </div>
  );
}
