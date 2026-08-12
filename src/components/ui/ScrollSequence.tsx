"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

interface ScrollSequenceProps {
  frameCount: number;
  framePrefix: string; // e.g., "/frames/watch_"
  frameExtension?: string; // default: ".png"
}

export default function ScrollSequence({
  frameCount,
  framePrefix,
  frameExtension = ".png",
}: ScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const { scrollYProgress } = useScroll({
    target: isMounted ? containerRef : undefined,
    offset: ["start start", "end end"],
  });

  // Map scroll progress (0 to 1) to frame index (0 to frameCount - 1)
  const currentIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      // Pad index with leading zeros if needed (e.g., 000, 001, ..., 100)
      const paddedIndex = i.toString().padStart(3, "0");
      img.src = `${framePrefix}${paddedIndex}${frameExtension}`;
      
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          setImages(loadedImages);
          setImagesLoaded(true);
        }
      };
      
      loadedImages.push(img);
    }
  }, [frameCount, framePrefix, frameExtension]);

  // Draw the initial frame once images are loaded
  useEffect(() => {
    if (imagesLoaded && canvasRef.current && images.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw first frame
        ctx.drawImage(images[0], 0, 0, canvas.width, canvas.height);
      }
    }
  }, [imagesLoaded, images]);

  // Update canvas when scroll changes
  useMotionValueEvent(currentIndex, "change", (latest) => {
    if (!imagesLoaded || !canvasRef.current || images.length === 0) return;
    
    const frameIndex = Math.round(latest);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (ctx && images[frameIndex]) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
    }
  });

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-black">
      {/* Sticky container that holds the canvas */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Placeholder text that fades in/out based on scroll */}
        <motion.div 
          className="absolute left-10 md:left-32 top-1/2 -translate-y-1/2 z-10 max-w-sm"
          style={{ 
            opacity: useTransform(scrollYProgress, [0, 0.2, 0.4], [0, 1, 0]),
            y: useTransform(scrollYProgress, [0, 0.2, 0.4], [50, 0, -50])
          }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Precisión Absoluta
          </h2>
          <p className="text-gray-400 text-lg">
            Cada pixel es renderizado con exactitud milimétrica. Inspirado en el diseño Apple, sin modelos WebGL pesados.
          </p>
        </motion.div>

        <motion.div 
          className="absolute right-10 md:right-32 top-1/2 -translate-y-1/2 z-10 max-w-sm text-right"
          style={{ 
            opacity: useTransform(scrollYProgress, [0.6, 0.8, 1], [0, 1, 0]),
            y: useTransform(scrollYProgress, [0.6, 0.8, 1], [50, 0, -50])
          }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-l from-white to-gray-400 bg-clip-text text-transparent">
            Rendimiento Extremo
          </h2>
          <p className="text-gray-400 text-lg">
            Control de frames vía Scroll Scrubbing para una experiencia inmersiva fluida a 60 FPS.
          </p>
        </motion.div>

        {/* 
          IMPORTANT: You need to replace the canvas fallback styling with actual frames 
          The canvas draws a sequence of images (e.g., from an AI-generated video via FFmpeg).
        */}
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className="w-full h-full object-cover max-w-6xl opacity-80"
        />
        
        {!imagesLoaded && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-white/30 font-mono text-sm border border-white/10 px-4 py-2 rounded-full glass">
              Waiting for Frame Assets (/public/frames/)...
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
