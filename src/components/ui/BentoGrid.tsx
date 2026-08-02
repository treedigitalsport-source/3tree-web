"use client";

import { motion } from "framer-motion";
import { Zap, Layers, BarChart3, Smartphone } from "lucide-react";
import { ReactNode } from "react";

interface BentoItemProps {
  title: string;
  description: string;
  icon: ReactNode;
  className?: string;
  delay?: number;
}

function BentoItem({ title, description, icon, className = "", delay = 0 }: BentoItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
      whileHover={{ scale: 0.98 }}
      className={`group relative overflow-hidden rounded-[2rem] bg-zinc-900/50 border border-white/5 p-8 glass hover:border-white/20 transition-colors duration-500 ${className}`}
    >
      {/* Hover glow effect */}
      <div className="absolute -inset-px bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 h-full flex flex-col justify-between gap-12">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md border border-white/10">
          {icon}
        </div>
        
        <div>
          <h3 className="text-2xl font-semibold mb-3 text-white">{title}</h3>
          <p className="text-gray-400 font-light leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function BentoGrid() {
  return (
    <section className="py-32 px-6 md:px-12 bg-black min-h-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto w-full">
        
        <div className="mb-20 text-center md:text-left">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent"
          >
            Arquitectura de Alto Nivel
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl font-light"
          >
            Cada componente está diseñado con propósito. Utilizamos las últimas tecnologías para garantizar una experiencia de usuario perfecta.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          <BentoItem 
            title="Rendimiento Instantáneo" 
            description="Optimizamos cada asset y línea de código. Tu web cargará en milisegundos, reduciendo la tasa de rebote."
            icon={<Zap size={24} />}
            className="md:col-span-2"
            delay={0.1}
          />
          
          <BentoItem 
            title="Diseño Modular" 
            description="Arquitectura de componentes escalable que permite crecer y adaptar tu sitio sin reescribir código."
            icon={<Layers size={24} />}
            delay={0.2}
          />
          
          <BentoItem 
            title="Adaptabilidad Total" 
            description="Una experiencia fluida en cualquier dispositivo, desde monitores ultra-wide hasta el smartphone más pequeño."
            icon={<Smartphone size={24} />}
            delay={0.3}
          />
          
          <BentoItem 
            title="Conversión Basada en Datos" 
            description="Estructuramos la información y los CTA basándonos en neuro-marketing y mapas de calor para maximizar leads."
            icon={<BarChart3 size={24} />}
            className="md:col-span-2"
            delay={0.4}
          />
        </div>

      </div>
    </section>
  );
}
