"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText, Database, Cpu, Activity, UserCheck, ShieldAlert, ExternalLink, RefreshCw, Mail, Users } from "lucide-react";
import { useLang } from "@/app/i18n";

export default function PrivacyPage() {
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
            <ShieldCheck className="w-8 h-8" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight mb-4"
          >
            {isEs ? "POLÍTICA DE PRIVACIDAD" : "PRIVACY POLICY"}
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
              {isEs ? "1. Introducción" : "1. Introduction"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs 
                ? "En 3Tree Digital Sport IA, respetamos tu privacidad y estamos comprometidos a proteger la información personal que nos confías. Como empresa de Sports Intelligence (Inteligencia Deportiva), desarrollamos tecnología, software, aplicaciones, sistemas de Inteligencia Artificial, soluciones de datos, herramientas de automatización, agentes de IA, plataformas web y otras soluciones digitales para el ecosistema deportivo."
                : "At 3Tree Digital Sport IA, we respect your privacy and are committed to protecting personal information entrusted to us. As a Sports Intelligence Company, we develop technology, software, applications, Artificial Intelligence systems, data solutions, automation tools, AI agents, web platforms, and other digital solutions for the sports ecosystem."}
            </p>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Esta Política de Privacidad explica cómo podemos recopilar, utilizar, proteger y gestionar información personal cuando interactúas con nuestros sitios web, plataformas digitales, aplicaciones, servicios y canales de comunicación. La información que recopilamos depende del servicio o plataforma específica que utilices y de cómo interactúes con nosotros."
                : "This Privacy Policy explains how we may collect, use, protect, and manage personal information when you interact with our websites, digital platforms, applications, services, and communication channels. The information we collect depends on the specific service or platform you use and how you interact with us."}
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "2. Información que Recopilamos" : "2. Information We Collect"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Podemos recopilar información que proporcionas voluntariamente y cierta información técnica generada cuando interactúas con nuestros servicios digitales:"
                : "We may collect information that you voluntarily provide and certain technical information generated when you interact with our digital services:"}
            </p>

            {/* Information You Provide */}
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl space-y-3">
              <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-brandOrange" />
                {isEs ? "Información que Proporcionas" : "Information You Provide"}
              </h3>
              <ul className="space-y-2 text-white/60 text-sm font-light">
                <li>
                  <strong className="text-white">{isEs ? "Información de Contacto:" : "Contact Information:"}</strong> {isEs ? "Nombre, correo electrónico y otra información de contacto provista voluntariamente." : "Name, email address, and other contact information you voluntarily provide."}
                </li>
                <li>
                  <strong className="text-white">{isEs ? "Información de Comunicación:" : "Communication Information:"}</strong> {isEs ? "Información contenida en mensajes, consultas o solicitudes enviadas a nosotros." : "Information contained in messages, inquiries, requests, or communications sent to us."}
                </li>
                <li>
                  <strong className="text-white">{isEs ? "Información de Cuenta:" : "Account Information:"}</strong> {isEs ? "Información necesaria para crear y gestionar cuentas o perfiles de usuario cuando estén disponibles." : "When an account or user profile is available for a specific service, information necessary to create and manage that account."}
                </li>
                <li>
                  <strong className="text-white">{isEs ? "Información de Proyectos o Servicios:" : "Project or Service Information:"}</strong> {isEs ? "Información provista al solicitar o utilizar uno de nuestros servicios tecnológicos." : "Information voluntarily provided when requesting or using one of our technology services."}
                </li>
              </ul>
            </div>

            {/* Technical Information */}
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl space-y-3">
              <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-brandOrange" />
                {isEs ? "Información Técnica (Automática)" : "Technical Information (Automatic)"}
              </h3>
              <p className="text-white/60 text-sm font-light">
                {isEs
                  ? "Al acceder a nuestras plataformas, cierta información técnica puede recopilarse automáticamente:"
                  : "When you access our websites or digital services, certain technical information may be collected automatically, including:"}
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-white/50 text-sm font-light pl-2">
                <li className="flex items-center gap-2"><span className="text-brandOrange">•</span>{isEs ? "Dirección IP." : "IP address."}</li>
                <li className="flex items-center gap-2"><span className="text-brandOrange">•</span>{isEs ? "Tipo y versión del navegador." : "Browser type and version."}</li>
                <li className="flex items-center gap-2"><span className="text-brandOrange">•</span>{isEs ? "Tipo de dispositivo." : "Device type."}</li>
                <li className="flex items-center gap-2"><span className="text-brandOrange">•</span>{isEs ? "Sistema operativo." : "Operating system."}</li>
                <li className="flex items-center gap-2"><span className="text-brandOrange">•</span>{isEs ? "Fecha y hora de acceso." : "Date and time of access."}</li>
                <li className="flex items-center gap-2"><span className="text-brandOrange">•</span>{isEs ? "Páginas o secciones visitadas." : "Pages or sections visited."}</li>
                <li className="flex items-center gap-2"><span className="text-brandOrange">•</span>{isEs ? "Navegación general y uso." : "General navigation and usage information."}</li>
                <li className="flex items-center gap-2"><span className="text-brandOrange">•</span>{isEs ? "Métricas de seguridad y rendimiento." : "Technical info for security, functionality & performance."}</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "3. Datos Deportivos y Servicios Tecnológicos" : "3. Sports Data and Technology Services"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Ciertos productos o servicios desarrollados por 3Tree Digital Sport IA pueden involucrar información o datos deportivos. Según la tecnología o proyecto específico, esto puede incluir información estadística, de rendimiento, organizacional u otros datos provistos por atletas, entrenadores, organizaciones, clientes o usuarios autorizados."
                : "Certain products or services developed by 3Tree Digital Sport IA may involve sports-related information or data. Depending on the specific technology or project, this may include statistical information, performance information, organizational information, or other data provided by an athlete, coach, organization, client, or authorized user."}
            </p>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Cuando 3Tree Digital Sport IA procesa información en nombre de un cliente u organización, los derechos, responsabilidades y usos permitidos se rigen por el contrato o acuerdo de servicio correspondiente. No asumimos automáticamente la propiedad de los datos suministrados por clientes o usuarios por el simple hecho de que se procesen a través de nuestra tecnología."
                : "When 3Tree Digital Sport IA processes information on behalf of a client or organization, the rights, responsibilities, and permitted use of that information may be established through the applicable service agreement, contract, or other written arrangement. We do not automatically assume ownership of data provided by clients or users simply because that data is processed through our technology."}
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "4. Inteligencia Artificial y Sistemas Automatizados" : "4. Artificial Intelligence and Automated Systems"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Algunos de nuestros servicios pueden utilizar Inteligencia Artificial, aprendizaje automático, automatización, agentes de IA u otras tecnologías computacionales para:"
                : "Some of our services may use Artificial Intelligence, machine learning, automation, AI agents, or other computational technologies. These technologies may be used to:"}
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-white/60 text-sm font-light pl-2">
              <li className="flex items-center gap-2"><span className="text-brandOrange">•</span>{isEs ? "Organizar información." : "Organize information."}</li>
              <li className="flex items-center gap-2"><span className="text-brandOrange">•</span>{isEs ? "Procesar datos." : "Process data."}</li>
              <li className="flex items-center gap-2"><span className="text-brandOrange">•</span>{isEs ? "Analizar información deportiva." : "Analyze information."}</li>
              <li className="flex items-center gap-2"><span className="text-brandOrange">•</span>{isEs ? "Identificar patrones." : "Identify patterns."}</li>
              <li className="flex items-center gap-2"><span className="text-brandOrange">•</span>{isEs ? "Automatizar flujos de trabajo." : "Automate workflows."}</li>
              <li className="flex items-center gap-2"><span className="text-brandOrange">•</span>{isEs ? "Generar insights asistidos por tecnología." : "Generate technology-assisted insights."}</li>
              <li className="flex items-center gap-2 md:col-span-2"><span className="text-brandOrange">•</span>{isEs ? "Respaldar procesos operativos o analíticos." : "Support operational or analytical processes."}</li>
            </ul>
            <p className="text-white/50 text-xs italic pt-1">
              {isEs
                ? "*No declaramos que los resultados generados por IA sean infalibles. Según la aplicación, la revisión humana y el juicio profesional pueden seguir siendo necesarios. Cuando se procese información personal a través de un servicio con IA, se gestionará de acuerdo con los acuerdos aplicables y requisitos de privacidad."
                : "*We do not represent that AI-generated or automated results are infallible. Depending on the application, human review and professional judgment may remain necessary. Where personal information is processed through an AI-enabled service, such processing will be handled according to the applicable service configuration, agreements, and privacy requirements."}
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "5. Cómo Utilizamos la Información" : "5. How We Use Information"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Podemos utilizar la información recopilada a través de nuestros servicios para:"
                : "We may use information collected through our services to:"}
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-white/60 text-sm font-light pl-2">
              <li className="flex items-start gap-2"><span className="text-brandOrange mt-1">•</span>{isEs ? "Proveer y operar nuestros servicios digitales." : "Provide and operate our digital services."}</li>
              <li className="flex items-start gap-2"><span className="text-brandOrange mt-1">•</span>{isEs ? "Responder a consultas y solicitudes." : "Respond to inquiries and requests."}</li>
              <li className="flex items-start gap-2"><span className="text-brandOrange mt-1">•</span>{isEs ? "Comunicarnos con usuarios y clientes." : "Communicate with users and clients."}</li>
              <li className="flex items-start gap-2"><span className="text-brandOrange mt-1">•</span>{isEs ? "Mantener y optimizar sitios web, apps y software." : "Maintain and improve our websites, applications, and software."}</li>
              <li className="flex items-start gap-2"><span className="text-brandOrange mt-1">•</span>{isEs ? "Desarrollar y mejorar la tecnología." : "Develop and improve technology."}</li>
              <li className="flex items-start gap-2"><span className="text-brandOrange mt-1">•</span>{isEs ? "Mantener la seguridad de los sistemas." : "Maintain system security."}</li>
              <li className="flex items-start gap-2"><span className="text-brandOrange mt-1">•</span>{isEs ? "Detectar y prevenir actividad no autorizada o fraude." : "Detect and prevent unauthorized or fraudulent activity."}</li>
              <li className="flex items-start gap-2"><span className="text-brandOrange mt-1">•</span>{isEs ? "Analizar el rendimiento general y uso del servicio." : "Analyze general service performance and usage."}</li>
              <li className="flex items-start gap-2"><span className="text-brandOrange mt-1">•</span>{isEs ? "Solucionar problemas técnicos." : "Troubleshoot technical problems."}</li>
              <li className="flex items-start gap-2"><span className="text-brandOrange mt-1">•</span>{isEs ? "Cumplir con obligaciones legales aplicables." : "Comply with applicable legal obligations."}</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "6. Cookies y Tecnologías Similares" : "6. Cookies and Similar Technologies"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Nuestros sitios web y plataformas digitales pueden utilizar cookies y tecnologías similares para habilitar funciones esenciales, recordar preferencias, mejorar el rendimiento, entender patrones de navegación y respaldar la seguridad. Para mayor información, por favor consulta nuestra Política de Cookies."
                : "Our websites and digital platforms may use cookies and similar technologies to enable essential website functions, remember preferences, improve website performance, understand general navigation and usage patterns, monitor technical performance, and support security. For additional information, please review our Cookie Policy."}
            </p>
            <p>
              <Link href="/cookies" className="text-brandOrange hover:underline text-sm font-mono font-medium">
                ➔ {isEs ? "Ver Política de Cookies completa" : "View full Cookie Policy"}
              </Link>
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "7. Servicios de Terceros" : "7. Third-Party Services"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Nuestro ecosistema tecnológico puede apoyarse en proveedores externos para infraestructura, alojamiento, analítica, seguridad, comunicación, desarrollo u otras funciones técnicas. Cuando corresponda, estos proveedores pueden procesar información limitada necesaria para prestar sus servicios bajo sus propias políticas de privacidad y términos."
                : "Our technology ecosystem may rely on third-party providers for infrastructure, hosting, analytics, security, communication, development, or other technical functions. When applicable, these providers may process limited information necessary to provide their services. Third-party services operate according to their own privacy policies and terms."}
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "8. Divulgación de Información" : "8. Information Sharing"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "3Tree Digital Sport IA no vende ni alquila información personal. Podemos compartir información limitada cuando sea razonablemente necesario para:"
                : "3Tree Digital Sport IA does not sell or rent personal information. We may share limited information when reasonably necessary to:"}
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-white/50 text-sm font-light">
              <li>{isEs ? "Proveer nuestros servicios." : "Provide our services."}</li>
              <li>{isEs ? "Trabajar con proveedores de tecnología e infraestructura." : "Work with technology and infrastructure providers."}</li>
              <li>{isEs ? "Mantener la seguridad y prevenir fraudes o actividad no autorizada." : "Maintain security and prevent fraud or unauthorized activity."}</li>
              <li>{isEs ? "Cumplir con obligaciones legales aplicables." : "Comply with applicable legal obligations."}</li>
              <li>{isEs ? "Proteger nuestros derechos, propiedad, usuarios o sistemas." : "Protect our rights, property, users, or systems."}</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "9. Seguridad de los Datos" : "9. Data Security"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Implementamos medidas técnicas y organizativas razonables diseñadas para proteger la información bajo nuestro control y reducir el riesgo de acceso no autorizado, pérdida, mal uso, alteración o divulgación. Sin embargo, ninguna transmisión por Internet o sistema de almacenamiento electrónico puede garantizarse como 100% seguro."
                : "We use reasonable technical and organizational measures designed to protect information under our control. These measures are intended to reduce the risk of unauthorized access, loss, misuse, alteration, disclosure, or destruction. However, no Internet transmission or electronic storage system can be guaranteed to be completely secure."}
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "10. Retención de Datos" : "10. Data Retention"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Conservamos la información personal durante el tiempo que sea razonablemente necesario para cumplir con los fines para los cuales fue recopilada, prestar nuestros servicios, cumplir con obligaciones legales, resolver disputas y proteger nuestros intereses legítimos. Cuando la información ya no sea necesaria, procederemos a eliminarla, anonimizarla o disponer de ella de forma segura."
                : "We retain personal information for as long as reasonably necessary to fulfill the purposes for which it was collected, provide our services, maintain our operations, comply with legal obligations, resolve disputes, or protect our legitimate interests. Retention periods may vary depending on the type of information, the service involved, and applicable legal requirements. When information is no longer necessary, we may delete, anonymize, or otherwise dispose of it in accordance with applicable requirements."}
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "11. Tus Derechos de Privacidad" : "11. Your Privacy Rights"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Dependiendo de tu ubicación y la legislación aplicable, puedes tener derechos respecto a tu información personal, tales como:"
                : "Depending on your location and applicable law, you may have rights regarding your personal information. These rights may include:"}
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-white/50 text-sm font-light">
              <li>{isEs ? "Solicitar acceso a tu información personal." : "Requesting access to personal information."}</li>
              <li>{isEs ? "Solicitar la corrección de datos inexactos." : "Requesting correction of inaccurate information."}</li>
              <li>{isEs ? "Solicitar la eliminación definitiva cuando sea legalmente aplicable." : "Requesting deletion where legally applicable."}</li>
              <li>{isEs ? "Solicitar información sobre cómo se procesan tus datos." : "Requesting information about how personal information is processed."}</li>
              <li>{isEs ? "Oponerte o limitar ciertas actividades de procesamiento." : "Objecting to or limiting certain processing activities where applicable."}</li>
              <li>{isEs ? "Retirar el consentimiento otorgado previamente." : "Withdrawing consent where processing is based on consent."}</li>
            </ul>
            <p className="text-white/60 text-sm font-light pt-1">
              {isEs
                ? "Para enviar una solicitud sobre tu privacidad, contáctanos a través del correo indicado abajo. Podremos solicitar información razonable para verificar tu identidad antes de procesar la solicitud."
                : "To submit a privacy-related request, contact us using the information provided below. We may request reasonable information to verify your identity before processing certain requests."}
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "12. Privacidad de Menores" : "12. Children's Privacy"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Nuestros servicios no están diseñados intencionalmente para recopilar información personal de menores en circunstancias donde la legislación aplicable requiera autorización de los padres o tutores. Si consideras que un menor nos ha proporcionado información personal sin dicha autorización, contáctanos de inmediato para revisar la situación."
                : "Our services are not intentionally designed to collect personal information from children in circumstances where parental or guardian authorization is required by applicable law. If you believe that a child has provided personal information to us without the appropriate authorization, please contact us so that we can review the situation."}
            </p>
          </section>

          {/* Section 13 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "13. Enlaces Externos" : "13. External Links"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Nuestros sitios web y plataformas digitales pueden contener enlaces a sitios web o servicios de terceros. 3Tree Digital Sport IA no controla las prácticas de privacidad, seguridad o contenido de dichos sitios externos. Recomendamos revisar las políticas de privacidad de los servicios de terceros antes de suministrar datos personales."
                : "Our websites and digital platforms may contain links to third-party websites or services. 3Tree Digital Sport IA does not control the privacy practices, security, or content of third-party websites. We encourage users to review the applicable privacy policies before providing personal information to external services."}
            </p>
          </section>

          {/* Section 14 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "14. Cambios a esta Política de Privacidad" : "14. Changes to This Privacy Policy"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Podemos actualizar esta Política de Privacidad cuando sea necesario para reflejar cambios en nuestra tecnología, servicios, prácticas comerciales o requisitos legales. Cuando se realicen cambios, la versión actualizada se publicará en nuestro sitio web con la fecha revisada de Última Actualización."
                : "We may update this Privacy Policy when necessary to reflect changes in our technology, services, business practices, or legal requirements. When changes are made, the updated version will be published on our website with a revised Last Updated date."}
            </p>
          </section>

          {/* Section 15 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "15. Contáctanos" : "15. Contact Us"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Si tienes preguntas, inquietudes o solicitudes sobre esta Política de Privacidad o la forma en que 3Tree Digital Sport IA gestiona la información personal, por favor contáctanos:"
                : "If you have questions, concerns, or requests regarding this Privacy Policy or the way 3Tree Digital Sport IA handles personal information, please contact us:"}
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
