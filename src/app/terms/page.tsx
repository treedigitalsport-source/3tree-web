"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLang } from "@/app/i18n";
import CustomCursor from "@/components/CustomCursor";

export default function TermsPage() {
  const { lang } = useLang();
  const isEs = lang === "es";

  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-brandOrange selection:text-white relative overflow-x-hidden font-sans">
      <CustomCursor />
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-screen">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      <nav className="relative z-50 w-full px-6 py-6 border-b border-white/10 flex justify-between items-center bg-[#020617]/80 backdrop-blur-md">
        <div className="font-display font-black text-2xl tracking-widest uppercase">
          3tree digital <span className="text-brandOrange">Sport IA</span>
        </div>
        <Link href="/" className="hoverable group flex items-center gap-4 text-white hover:text-brandOrange transition-colors">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] hidden md:inline">{isEs ? "Volver al Inicio" : "Back to Home"}</span>
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-brandOrange bg-[#020617]">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </div>
        </Link>
      </nav>

      <div className="relative z-10 container mx-auto px-6 max-w-4xl py-24 md:py-32">
        <div className="mb-16">
          <h1 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tight mb-6">
            {isEs ? "Términos de " : "Terms of "} <span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.3)' }}>{isEs ? "Servicio" : "Service"}</span>
          </h1>
          <p className="font-mono text-sm text-brandOrange tracking-widest uppercase">
            {isEs ? "Última actualización: Agosto 2026" : "Last updated: August 2026"}
          </p>
        </div>

        <div className="prose prose-invert prose-orange max-w-none font-mono text-sm leading-relaxed text-white/70">
          {isEs ? (
            <>
              <h2 className="text-white font-display text-2xl font-bold uppercase mt-12 mb-4">1. Aceptación de los Términos</h2>
              <p>Al acceder y utilizar el ecosistema tecnológico de 3Tree Digital (incluyendo Kinebase Pro, Scouting AI y servicios de análisis de datos), aceptas estar sujeto a estos Términos de Servicio. Si no estás de acuerdo con alguna parte de los términos, no podrás acceder a nuestras plataformas.</p>

              <h2 className="text-white font-display text-2xl font-bold uppercase mt-12 mb-4">2. Descripción de los Servicios Tecnológicos</h2>
              <p>3Tree Digital es una agencia especializada en tecnología deportiva, enfocada en análisis biomecánico sin marcadores (Markerless Biomechanics), modelado predictivo mediante Inteligencia Artificial y automatización de datos (LLMs). Nuestras herramientas están diseñadas para optimizar el rendimiento atlético y el descubrimiento de talento, dirigidas tanto a atletas individuales como a instituciones deportivas.</p>

              <h2 className="text-white font-display text-2xl font-bold uppercase mt-12 mb-4">3. Procesamiento de Datos Biomecánicos y de Rendimiento</h2>
              <p>El núcleo de nuestra tecnología implica el análisis profundo de métricas físicas y tácticas. Al utilizar nuestros servicios, autorizas a 3Tree Digital a procesar datos de video y extraer modelos biomecánicos anonimizados para el entrenamiento de nuestra Inteligencia Artificial. Garantizamos que el uso de esta información se limita estrictamente a fines de análisis deportivo y mejora tecnológica, respetando siempre la privacidad e integridad del atleta.</p>

              <h2 className="text-white font-display text-2xl font-bold uppercase mt-12 mb-4">4. Propiedad Intelectual y Licenciamiento</h2>
              <p>Todos los algoritmos, modelos de IA generativa, interfaces de usuario y el diseño arquitectónico de Kinebase Pro y Scouting AI son propiedad intelectual exclusiva de 3Tree Digital. Se prohíbe estrictamente la ingeniería inversa, copia o distribución comercial no autorizada de nuestras herramientas tecnológicas.</p>

              <h2 className="text-white font-display text-2xl font-bold uppercase mt-12 mb-4">5. Limitación de Responsabilidad (Scouting y Contratación)</h2>
              <p>Nuestras plataformas proporcionan análisis predictivo y métricas de élite. Sin embargo, 3Tree Digital no garantiza que el uso de nuestra tecnología resulte en la contratación profesional, reclutamiento por parte de scouts, obtención de becas universitarias o éxito atlético asegurado. Los datos provistos son herramientas de evaluación y optimización, no promesas contractuales de rendimiento futuro.</p>

              <h2 className="text-white font-display text-2xl font-bold uppercase mt-12 mb-4">6. Modificaciones al Ecosistema</h2>
              <p>Dado que la tecnología de IA evoluciona rápidamente, 3Tree Digital se reserva el derecho de actualizar, modificar o descontinuar algoritmos específicos, modelos predictivos o características del servicio en cualquier momento, siempre en la búsqueda de ofrecer los análisis más precisos posibles del mercado.</p>
            </>
          ) : (
            <>
              <h2 className="text-white font-display text-2xl font-bold uppercase mt-12 mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and using the 3Tree Digital technology ecosystem (including Kinebase Pro, Scouting AI, and data analysis services), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our platforms.</p>

              <h2 className="text-white font-display text-2xl font-bold uppercase mt-12 mb-4">2. Description of Technology Services</h2>
              <p>3Tree Digital is a specialized sports technology agency focused on markerless biomechanical analysis, predictive modeling using Artificial Intelligence, and data automation (LLMs). Our tools are designed to optimize athletic performance and talent discovery, catering to both individual athletes and sports institutions.</p>

              <h2 className="text-white font-display text-2xl font-bold uppercase mt-12 mb-4">3. Processing of Biomechanical and Performance Data</h2>
              <p>The core of our technology involves deep analysis of physical and tactical metrics. By using our services, you authorize 3Tree Digital to process video data and extract anonymized biomechanical models for the training of our Artificial Intelligence. We guarantee that the use of this information is strictly limited to sports analysis and technological improvement, always respecting the athlete&apos;s privacy and integrity.</p>

              <h2 className="text-white font-display text-2xl font-bold uppercase mt-12 mb-4">4. Intellectual Property and Licensing</h2>
              <p>All algorithms, generative AI models, user interfaces, and the architectural design of Kinebase Pro and Scouting AI are the exclusive intellectual property of 3Tree Digital. Reverse engineering, copying, or unauthorized commercial distribution of our technological tools is strictly prohibited.</p>

              <h2 className="text-white font-display text-2xl font-bold uppercase mt-12 mb-4">5. Limitation of Liability (Scouting and Recruitment)</h2>
              <p>Our platforms provide predictive analysis and elite metrics. However, 3Tree Digital does not guarantee that the use of our technology will result in professional hiring, recruitment by scouts, obtaining university scholarships, or guaranteed athletic success. The data provided are evaluation and optimization tools, not contractual promises of future performance.</p>

              <h2 className="text-white font-display text-2xl font-bold uppercase mt-12 mb-4">6. Modifications to the Ecosystem</h2>
              <p>As AI technology evolves rapidly, 3Tree Digital reserves the right to update, modify, or discontinue specific algorithms, predictive models, or service features at any time, always in pursuit of offering the most accurate analyses possible in the market.</p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
