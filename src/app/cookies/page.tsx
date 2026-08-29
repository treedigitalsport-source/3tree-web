"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Cookie, ShieldCheck, Sliders, Cpu, Activity, RefreshCw, Mail } from "lucide-react";
import { useLang } from "@/app/i18n";

export default function CookiesPage() {
  const { lang, toggleLang } = useLang();
  const isEs = lang === "es";

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-brandOrange selection:text-white font-sans overflow-x-hidden relative">
      
      {/* Background Animated Gradient & Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(242,101,34,0.12),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,255,255,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay"></div>
      </div>
      <div className="fixed inset-0 z-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

      {/* Nav Bar */}
      <nav className="relative z-50 w-full p-8 md:px-16 flex justify-between items-center">
        <Link href="/" className="hoverable group flex items-center gap-2 text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{isEs ? "Volver al Inicio" : "Back to Home"}</span>
        </Link>
        <button
          onClick={toggleLang}
          className="font-mono text-xs font-extrabold px-3 py-1.5 rounded-full border border-white/20 bg-white/5 hover:border-brandOrange hover:text-brandOrange transition-all cursor-pointer uppercase tracking-wider text-white"
        >
          {lang === "es" ? "EN" : "ES"}
        </button>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 max-w-4xl pt-10 pb-32">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 rounded-2xl bg-brandOrange/10 border border-brandOrange/20 flex items-center justify-center mx-auto mb-6 text-brandOrange"
          >
            <Cookie className="w-8 h-8" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight mb-4"
          >
            {isEs ? "POLÍTICA DE COOKIES" : "COOKIE POLICY"}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm font-mono tracking-widest text-brandOrange font-bold uppercase"
          >
            {isEs ? "ÚLTIMA ACTUALIZACIÓN: AGOSTO 2026 · 3TREEDIGITAL.COM" : "LAST UPDATED: AUGUST 2026 · 3TREEDIGITAL.COM"}
          </motion.p>
        </div>

        {/* Content Body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-12 bg-white/[0.01] border border-white/5 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-md relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brandOrange/5 blur-[80px] rounded-full pointer-events-none" />

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "1. ¿Qué son las Cookies?" : "1. What Are Cookies?"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs 
                ? "Las cookies son pequeños archivos de texto o tecnologías similares que pueden almacenarse en tu ordenador, tablet, dispositivo móvil u otro dispositivo cuando visitas un sitio web. Permiten a los sitios web reconocer un dispositivo, mantener ciertas funciones, recordar preferencias, mejorar el rendimiento y recopilar información técnica sobre cómo se utiliza el sitio."
                : "Cookies are small text files or similar technologies that may be stored on your computer, tablet, mobile device, or other device when you visit a website. They allow websites to recognize a device, maintain certain functions, remember preferences, improve performance, and collect technical information about how a website is used."}
            </p>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "En 3Tree Digital Sport IA, las cookies y tecnologías similares pueden utilizarse como parte de la operación, seguridad, funcionalidad y mejora de nuestro ecosistema digital."
                : "At 3Tree Digital Sport IA, cookies and similar technologies may be used as part of the operation, security, functionality, and improvement of our digital ecosystem."}
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "2. ¿Cómo Usamos las Cookies?" : "2. How We Use Cookies"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Dependiendo del sitio web, aplicación o servicio digital que estés utilizando, podemos emplear diferentes tipos de cookies:"
                : "Depending on the website, application, or digital service you are using, we may use different types of cookies:"}
            </p>

            {/* Essential Cookies */}
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl space-y-3">
              <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brandOrange" />
                {isEs ? "Cookies Esenciales" : "Essential Cookies"}
              </h3>
              <p className="text-white/60 text-sm font-light">
                {isEs
                  ? "Estas cookies pueden ser necesarias para el funcionamiento básico y la seguridad de nuestro sitio web. Pueden soportar funciones tales como:"
                  : "These cookies may be necessary for the basic operation and security of our website. They can support functions such as:"}
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-white/50 text-sm font-light">
                <li>{isEs ? "Navegación segura." : "Secure navigation."}</li>
                <li>{isEs ? "Gestión de sesiones." : "Session management."}</li>
                <li>{isEs ? "Funcionalidad general del sitio web." : "Website functionality."}</li>
                <li>{isEs ? "Mecanismos de seguridad." : "Security mechanisms."}</li>
                <li>{isEs ? "Operaciones técnicas requeridas para que el sitio funcione correctamente." : "Technical operations required for the site to function correctly."}</li>
              </ul>
              <p className="text-white/40 text-xs italic pt-1">
                {isEs
                  ? "*Las cookies esenciales no siempre pueden deshabilitarse a través del sitio web debido a que ciertas características podrían no operar adecuadamente sin ellas."
                  : "*Essential cookies cannot always be disabled through the website because certain features may not operate properly without them."}
              </p>
            </div>

            {/* Preference Cookies */}
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl space-y-3">
              <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-brandOrange" />
                {isEs ? "Cookies de Preferencias" : "Preference Cookies"}
              </h3>
              <p className="text-white/60 text-sm font-light">
                {isEs
                  ? "Las cookies de preferencias permiten a nuestros sitios web o aplicaciones recordar las elecciones realizadas por los usuarios. Estas pueden incluir:"
                  : "Preference cookies may allow our websites or applications to remember choices made by users. These may include:"}
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-white/50 text-sm font-light">
                <li>{isEs ? "Preferencias de idioma." : "Language preferences."}</li>
                <li>{isEs ? "Preferencias de interfaz." : "Interface preferences."}</li>
                <li>{isEs ? "Otras elecciones de configuración." : "Other configuration choices."}</li>
              </ul>
              <p className="text-white/50 text-xs font-light pt-1">
                {isEs
                  ? "Por ejemplo, cuando esté disponible, el sistema puede recordar si el usuario prefiere navegar en inglés o español."
                  : "For example, when available, the system may remember whether the user prefers to navigate the website in English or Spanish."}
              </p>
            </div>

            {/* Performance and Analytics Cookies */}
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl space-y-3">
              <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-brandOrange" />
                {isEs ? "Cookies de Rendimiento y Análisis" : "Performance and Analytics Cookies"}
              </h3>
              <p className="text-white/60 text-sm font-light">
                {isEs
                  ? "Donde estén habilitadas, estas cookies nos ayudan a comprender cómo los visitantes interactúan con nuestros sitios web y plataformas digitales. Pueden proporcionar información sobre:"
                  : "Where enabled, these cookies may help us understand how visitors interact with our websites and digital platforms. They may provide information about:"}
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-white/50 text-sm font-light">
                <li>{isEs ? "Patrones generales de navegación." : "General navigation patterns."}</li>
                <li>{isEs ? "Páginas visitadas." : "Pages visited."}</li>
                <li>{isEs ? "Rendimiento del sitio web." : "Website performance."}</li>
                <li>{isEs ? "Errores técnicos." : "Technical errors."}</li>
                <li>{isEs ? "Comportamiento de carga." : "Loading behavior."}</li>
                <li>{isEs ? "Estadísticas generales de uso." : "General usage statistics."}</li>
              </ul>
              <p className="text-white/50 text-xs font-light pt-1">
                {isEs
                  ? "Esta información nos ayuda a mejorar el rendimiento, la usabilidad y la confiabilidad de nuestros servicios digitales."
                  : "This information may help us improve the performance, usability, and reliability of our digital services."}
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "3. Cookies de Terceros" : "3. Third-Party Cookies"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Ciertas tecnologías o servicios integrados en nuestros sitios web pueden ser proporcionados por terceros. Estos proveedores pueden utilizar cookies o tecnologías similares de acuerdo con sus propias políticas de privacidad. Las tecnologías de terceros pueden utilizarse para fines tales como:"
                : "Certain technologies or services integrated into our websites may be provided by third parties. These providers may use cookies or similar technologies according to their own privacy policies. Third-party technologies may be used for purposes such as:"}
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-white/50 text-sm font-light">
              <li>{isEs ? "Análisis del sitio web." : "Website analytics."}</li>
              <li>{isEs ? "Seguridad." : "Security."}</li>
              <li>{isEs ? "Alojamiento e infraestructura." : "Hosting and infrastructure."}</li>
              <li>{isEs ? "Rendimiento técnico." : "Technical performance."}</li>
              <li>{isEs ? "Comunicación u otras funciones digitales." : "Communication or other digital functions."}</li>
            </ul>
            <p className="text-white/50 text-xs font-light">
              {isEs
                ? "Las tecnologías de terceros específicas utilizadas pueden variar según el sitio web o servicio."
                : "The specific third-party technologies used may vary depending on the website or service."}
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "4. Las Cookies y Nuestro Ecosistema de Tecnología Deportiva" : "4. Cookies and Our Sports Technology Ecosystem"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "3Tree Digital Sport IA desarrolla tecnología para el ecosistema deportivo, incluyendo software, aplicaciones, Inteligencia Artificial, soluciones de datos, automatización, agentes de IA, plataformas web, tecnologías relacionadas con drones, branding y experiencias digitales."
                : "3Tree Digital Sport IA develops technology for the sports ecosystem, including software, applications, Artificial Intelligence, data solutions, automation, AI agents, web platforms, drone-related technologies, branding, and digital experiences."}
            </p>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Las cookies utilizadas por un sitio web o aplicación en particular dependerán de la funcionalidad y la tecnología efectivamente implementada en dicho servicio. La presencia de esta Política de Cookies no significa que cada tipo de cookie descrito anteriormente esté necesariamente activo en cada sitio web o aplicación de 3Tree Digital Sport IA."
                : "The cookies used by a particular website or application will depend on the functionality and technology actually implemented on that service. The presence of this Cookie Policy does not mean that every type of cookie described above is necessarily active on every 3Tree Digital Sport IA website or application."}
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "5. Gestión de Cookies" : "5. Cookie Management"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Puedes controlar, bloquear o eliminar cookies a través de la configuración de tu navegador web o dispositivo. La mayoría de los navegadores te permiten:"
                : "You can control, block, or delete cookies through the settings of your web browser or device. Most browsers allow you to:"}
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-white/50 text-sm font-light">
              <li>{isEs ? "Ver las cookies almacenadas." : "View stored cookies."}</li>
              <li>{isEs ? "Eliminar cookies existentes." : "Delete existing cookies."}</li>
              <li>{isEs ? "Bloquear ciertas categorías de cookies." : "Block certain categories of cookies."}</li>
              <li>{isEs ? "Bloquear todas las cookies." : "Block all cookies."}</li>
              <li>{isEs ? "Recibir notificaciones antes de que se almacenen cookies." : "Receive notifications before cookies are stored."}</li>
            </ul>
            <p className="text-white/50 text-xs italic">
              {isEs
                ? "Ten en cuenta que deshabilitar las cookies esenciales puede afectar la funcionalidad, la seguridad o el rendimiento de ciertas partes de un sitio web."
                : "Please note that disabling essential cookies may affect the functionality, security, or performance of certain parts of a website."}
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "6. Cambios a esta Política de Cookies" : "6. Changes to This Cookie Policy"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Podemos actualizar esta Política de Cookies cuando cambien nuestros sitios web, aplicaciones, tecnologías o requisitos legales. Cuando se realicen actualizaciones, publicaremos la versión revisada en esta página y actualizaremos la fecha de Última Actualización."
                : "We may update this Cookie Policy when our websites, applications, technologies, or legal requirements change. When updates are made, we will publish the revised version on this page and update the Last Updated date."}
            </p>
            <p className="text-white/60 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Recomendamos a los usuarios revisar periódicamente esta política para mantenerse informados sobre cómo se utilizan las cookies y tecnologías similares."
                : "We encourage users to periodically review this policy to remain informed about how cookies and similar technologies are used."}
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "7. Contáctanos" : "7. Contact Us"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Si tienes preguntas sobre esta Política de Cookies o el uso de cookies y tecnologías similares por parte de 3Tree Digital Sport IA, por favor contáctanos:"
                : "If you have questions about this Cookie Policy or the use of cookies and similar technologies by 3Tree Digital Sport IA, please contact us:"}
            </p>
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl space-y-2 text-sm font-mono text-white/80">
              <p className="font-bold text-white text-base">3Tree Digital Sport IA</p>
              <p>Email: <a href="mailto:treedigitalsport@gmail.com" className="text-brandOrange hover:underline">treedigitalsport@gmail.com</a></p>
              <p className="text-white/40 text-xs pt-1">{isEs ? "Última Actualización: Agosto 2026" : "Last Updated: August 2026"}</p>
            </div>
          </section>

        </motion.div>

        {/* Footer Contact Callout */}
        <div className="mt-12 text-center text-white/40 text-xs">
          <p>
            {isEs 
              ? "© 2026 3Tree Digital Sport IA. Todos los derechos reservados · " 
              : "© 2026 3Tree Digital Sport IA. All rights reserved · "}
            <a href="https://3treedigital.com" target="_blank" rel="noopener noreferrer" className="text-brandOrange hover:underline font-medium">3treedigital.com</a>
          </p>
        </div>

      </main>
    </div>
  );
}
