"use client";

import { motion } from "framer-motion";
import Spline from "@splinetool/react-spline";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Dynamic Background / Spline 3D Integration */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-60">
        {/* We use Spline for interactive 3D background */}
        <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
      </div>

      {/* Radial Gradient Overlay for depth */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(0,113,227,0.15)_0%,transparent_60%)] pointer-events-none" />

      {/* Premium Glassmorphism Content */}
      <motion.div 
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className="relative z-10 glass px-10 py-16 md:px-16 md:py-20 rounded-[2.5rem] max-w-4xl mx-auto text-center shadow-2xl border border-white/10 backdrop-blur-2xl bg-black/20"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="inline-block mb-6 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md"
        >
          <span className="text-sm font-medium tracking-wide text-gray-300 uppercase">La Nueva Era del Diseño</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter mb-8 bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent leading-[1.1]">
          Experiencias<br />que Convierten
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
          Diseñamos y desarrollamos sitios web premium de alta conversión. Integraciones 3D, animaciones fluidas y un rendimiento inigualable para escalar tu negocio.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-medium tracking-wide hover:bg-gray-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            Agenda una Demo
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto px-8 py-4 bg-transparent text-white border border-white/30 rounded-full font-medium tracking-wide transition-colors"
          >
            Ver Trabajos
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
