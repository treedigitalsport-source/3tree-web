"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Scale, Shield, Cpu, Lock, AlertCircle, FileText, Layers, Sparkles } from "lucide-react";
import { useLang } from "@/app/i18n";

export default function TermsPage() {
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
            <Scale className="w-8 h-8" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight mb-4"
          >
            {isEs ? "TÉRMINOS DE SERVICIO" : "TERMS OF SERVICE"}
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
              {isEs ? "1. Aceptación de los Términos" : "1. Acceptance of Terms"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs 
                ? "Al acceder o utilizar el ecosistema digital, sitios web, aplicaciones, sistemas inteligentes y servicios tecnológicos provistos por 3Tree Digital Sport IA, aceptas estar sujeto a estos Términos de Servicio. Estos términos rigen el uso de nuestra tecnología y servicios digitales, incluyendo soluciones y sistemas inteligentes, aplicaciones, sistemas de Inteligencia Artificial, servicios relacionados con datos, herramientas de automatización, agentes de IA, plataformas web y otras soluciones de tecnología deportiva ofrecidas por 3Tree Digital Sport IA."
                : "By accessing or using the digital ecosystem, websites, applications, intelligent systems, and technology services provided by 3Tree Digital Sport IA, you agree to be bound by these Terms of Service. These terms govern the use of our technology and digital services, including intelligent system solutions, applications, Artificial Intelligence systems, data-related services, automation tools, AI agents, web platforms, and other sports technology solutions offered by 3Tree Digital Sport IA."}
            </p>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Si no estás de acuerdo con estos términos, no debes utilizar el servicio o plataforma correspondiente. Ciertos productos o servicios especializados pueden tener términos adicionales aplicables específicamente a su uso. Cuando corresponda, dichos términos complementarán estos Términos de Servicio."
                : "If you do not agree with these terms, you should not use the applicable service or platform. Certain products or specialized services may have additional terms that apply specifically to their use. When applicable, those terms will supplement these Terms of Service."}
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "2. Descripción de los Servicios Tecnológicos" : "2. Description of Technology Services"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "3Tree Digital Sport IA es una compañía de Sports Intelligence (Inteligencia Deportiva) enfocada en desarrollar e integrar tecnología para el ecosistema deportivo. Nuestros servicios pueden incluir:"
                : "3Tree Digital Sport IA is a Sports Intelligence company focused on developing and integrating technology for the sports ecosystem. Our services may include:"}
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-white/60 text-sm font-light pl-2">
              <li className="flex items-start gap-2">
                <span className="text-brandOrange mt-1">•</span>
                {isEs ? "Sistemas inteligentes deportivos y plataformas digitales." : "Sports intelligent systems and digital platforms."}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brandOrange mt-1">•</span>
                {isEs ? "Aplicaciones móviles." : "Mobile applications."}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brandOrange mt-1">•</span>
                {isEs ? "Soluciones de datos y analítica deportiva." : "Sports data solutions and analytics."}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brandOrange mt-1">•</span>
                {isEs ? "Sistemas de Inteligencia Artificial." : "Artificial Intelligence systems."}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brandOrange mt-1">•</span>
                {isEs ? "Agentes de IA autónomos." : "AI agents."}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brandOrange mt-1">•</span>
                {isEs ? "Automatización inteligente de flujos." : "Intelligent automation."}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brandOrange mt-1">•</span>
                {isEs ? "Soluciones de organización y procesamiento de datos." : "Data organization and processing solutions."}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brandOrange mt-1">•</span>
                {isEs ? "Tecnología y servicios relacionados con drones para aplicaciones deportivas." : "Drone-related technology and services for sports applications."}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brandOrange mt-1">•</span>
                {isEs ? "Soluciones de branding e identidad deportiva." : "Branding and sports identity solutions."}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brandOrange mt-1">•</span>
                {isEs ? "Diseño y desarrollo web de vanguardia." : "Web design and development."}
              </li>
              <li className="flex items-start gap-2 md:col-span-2">
                <span className="text-brandOrange mt-1">•</span>
                {isEs ? "Otras soluciones tecnológicas desarrolladas para organizaciones, proyectos o clientes deportivos específicos." : "Other technology solutions developed for specific sports organizations, projects, or clients."}
              </li>
            </ul>
            <p className="text-white/60 text-sm font-light pt-2">
              {isEs
                ? "La disponibilidad, características y alcance de cada servicio pueden variar según el producto, proyecto o acuerdo específico. Nuestra tecnología está diseñada para apoyar a atletas, entrenadores, academias, clubes, ligas, organizaciones y otros participantes del ecosistema deportivo mediante herramientas digitales, información, automatización y capacidades asistidas por tecnología."
                : "The availability, characteristics, and scope of each service may vary depending on the specific product, project, or agreement. Our technology is designed to support athletes, coaches, academies, clubs, leagues, organizations, and other participants in the sports ecosystem by providing digital tools, information, automation, and technology-assisted capabilities."}
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "3. Datos, Inteligencia Artificial y Sports Intelligence" : "3. Data, Artificial Intelligence, and Sports Intelligence"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Ciertos servicios de 3Tree Digital Sport IA pueden involucrar la recopilación, organización, procesamiento, análisis o visualización de información deportiva y otros datos provistos a través del servicio correspondiente. Según el producto o proyecto, esto puede incluir información de rendimiento, datos estadísticos, datos organizacionales u otra información necesaria para la operación técnica."
                : "Certain 3Tree Digital Sport IA services may involve the collection, organization, processing, analysis, or visualization of sports-related information and other data provided through the applicable service. Depending on the product or project, this may include performance information, statistical information, organizational data, or other information necessary for the operation of the technology."}
            </p>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Cuando se trate de información personal, su tratamiento se regirá por nuestra Política de Privacidad y, cuando corresponda, por los acuerdos adicionales establecidos con clientes o usuarios. La Inteligencia Artificial y los sistemas automatizados pueden utilizarse para asistir en:"
                : "Where personal information is involved, its processing will be governed by our Privacy Policy and, where applicable, by additional agreements established with clients or users. Artificial Intelligence and automated systems may be used to assist with:"}
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-white/60 text-sm font-light pl-2">
              <li className="flex items-start gap-2"><span className="text-brandOrange mt-1">•</span>{isEs ? "Análisis de datos." : "Data analysis."}</li>
              <li className="flex items-start gap-2"><span className="text-brandOrange mt-1">•</span>{isEs ? "Procesamiento de información." : "Information processing."}</li>
              <li className="flex items-start gap-2"><span className="text-brandOrange mt-1">•</span>{isEs ? "Identificación de patrones." : "Pattern identification."}</li>
              <li className="flex items-start gap-2"><span className="text-brandOrange mt-1">•</span>{isEs ? "Automatización de flujos de trabajo." : "Workflow automation."}</li>
              <li className="flex items-start gap-2"><span className="text-brandOrange mt-1">•</span>{isEs ? "Generación de insights o recomendaciones." : "Generation of insights or recommendations."}</li>
              <li className="flex items-start gap-2"><span className="text-brandOrange mt-1">•</span>{isEs ? "Organización e interpretación de información." : "Organization and interpretation of information."}</li>
              <li className="flex items-start gap-2 md:col-span-2"><span className="text-brandOrange mt-1">•</span>{isEs ? "Otras funciones específicas de la tecnología aplicable." : "Other functions specific to the applicable technology."}</li>
            </ul>
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl text-xs text-white/50 leading-relaxed italic">
              {isEs
                ? "*Los resultados generados por IA o sistemas automatizados deben considerarse productos asistidos por tecnología y pueden requerir revisión humana, juicio profesional o verificación adicional. 3Tree Digital Sport IA no declara que un sistema automatizado pueda eliminar toda incertidumbre, error, sesgo o limitación asociada con los datos y el análisis deportivo."
                : "*AI-generated or automated results should be considered technology-assisted outputs and may require human review, professional judgment, or additional verification. 3Tree Digital Sport IA does not represent that an automated system can eliminate all uncertainty, errors, bias, or limitations associated with sports data and analysis."}
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "4. Propiedad Intelectual y Licenciamiento" : "4. Intellectual Property and Licensing"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "A menos que se establezca expresamente lo contrario en un acuerdo por escrito, los sistemas inteligentes, la tecnología, el código fuente, los algoritmos, la arquitectura de sistemas, las interfaces, los diseños, las marcas, los elementos de branding, la documentación y otros materiales patentados desarrollados o propiedad de 3Tree Digital Sport IA pertenecen a 3Tree Digital Sport IA o a sus respectivos licenciantes."
                : "Unless expressly stated otherwise in a written agreement, the intelligent systems, technology, source code, algorithms, system architecture, interfaces, designs, trademarks, branding elements, documentation, and other proprietary materials developed or owned by 3Tree Digital Sport IA remain the property of 3Tree Digital Sport IA or its respective licensors."}
            </p>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Nada en estos Términos de Servicio otorga a los usuarios la propiedad de nuestra tecnología subyacente. Los usuarios no pueden, sin autorización previa:"
                : "Nothing in these Terms of Service grants users ownership of our underlying technology. Users may not, without prior authorization:"}
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-white/50 text-sm font-light">
              <li>{isEs ? "Copiar o reproducir nuestra tecnología patentada." : "Copy or reproduce our proprietary technology."}</li>
              <li>{isEs ? "Realizar ingeniería inversa o intentar extraer el código fuente de nuestros sistemas." : "Reverse engineer or attempt to extract source code from our systems."}</li>
              <li>{isEs ? "Modificar o crear obras derivadas no autorizadas." : "Modify or create unauthorized derivative works."}</li>
              <li>{isEs ? "Redistribuir o revender comercialmente nuestra tecnología." : "Redistribute or commercially resell our technology."}</li>
              <li>{isEs ? "Eludir las medidas de seguridad tecnológica." : "Circumvent technological security measures."}</li>
              <li>{isEs ? "Utilizar nuestra propiedad intelectual de manera que infrinja nuestros derechos." : "Use our intellectual property in a manner that infringes our rights."}</li>
            </ul>
            <p className="text-white/50 text-xs font-light pt-1">
              {isEs
                ? "Cuando un proyecto se desarrolla específicamente para un cliente, los derechos de propiedad y licenciamiento pueden establecerse por separado mediante una propuesta, contrato, declaración de trabajo u otro acuerdo por escrito."
                : "When a project is developed specifically for a client, ownership and licensing rights may be established separately through a proposal, contract, statement of work, or other written agreement."}
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "5. Limitación de Responsabilidad y Resultados Asistidos por Tecnología" : "5. Limitation of Liability and Technology-Assisted Results"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "Nuestra tecnología está diseñada para proporcionar herramientas, información, automatización, análisis y capacidades de soporte en la toma de decisiones. Sin embargo, 3Tree Digital Sport IA no garantiza resultados atléticos, comerciales, de reclutamiento, financieros, competitivos u organizacionales específicos derivados del uso de su tecnología."
                : "Our technology is designed to provide tools, information, automation, analysis, and decision-support capabilities. However, 3Tree Digital Sport IA does not guarantee specific athletic, commercial, recruitment, financial, competitive, or organizational results from the use of its technology."}
            </p>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs ? "Nuestros servicios no garantizan:" : "Our services do not guarantee:"}
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-white/60 text-sm font-light pl-2">
              <li className="flex items-start gap-2"><span className="text-brandOrange mt-1">•</span>{isEs ? "Reclutamiento profesional." : "Professional recruitment."}</li>
              <li className="flex items-start gap-2"><span className="text-brandOrange mt-1">•</span>{isEs ? "Selección por parte de scouts." : "Selection by scouts."}</li>
              <li className="flex items-start gap-2"><span className="text-brandOrange mt-1">•</span>{isEs ? "Becas atléticas universitarias." : "Athletic scholarships."}</li>
              <li className="flex items-start gap-2"><span className="text-brandOrange mt-1">•</span>{isEs ? "Contratos deportivos." : "Contracts."}</li>
              <li className="flex items-start gap-2"><span className="text-brandOrange mt-1">•</span>{isEs ? "Selección en equipos." : "Team selection."}</li>
              <li className="flex items-start gap-2"><span className="text-brandOrange mt-1">•</span>{isEs ? "Éxito competitivo." : "Competitive success."}</li>
              <li className="flex items-start gap-2"><span className="text-brandOrange mt-1">•</span>{isEs ? "Mejoras de rendimiento específicas." : "Specific performance improvements."}</li>
              <li className="flex items-start gap-2"><span className="text-brandOrange mt-1">•</span>{isEs ? "Resultados financieros." : "Financial results."}</li>
              <li className="flex items-start gap-2 md:col-span-2"><span className="text-brandOrange mt-1">•</span>{isEs ? "Cualquier otro resultado particular." : "Any other particular outcome."}</li>
            </ul>
            <p className="text-white/60 text-sm font-light pt-1">
              {isEs
                ? "Los datos, las recomendaciones generadas por IA y los resultados analíticos no deben considerarse un sustituto del juicio profesional calificado. Los usuarios y organizaciones son responsables de las decisiones que tomen utilizando la información generada o presentada a través de nuestra tecnología."
                : "Data, Artificial Intelligence outputs, automated recommendations, and analytical results should not be considered a substitute for qualified professional judgment. Users and organizations remain responsible for decisions made using information generated, processed, or presented through our technology."}
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
              <span className="w-6 h-[1px] bg-brandOrange inline-block"></span>
              {isEs ? "6. Modificaciones al Ecosistema Tecnológico" : "6. Modifications to the Technology Ecosystem"}
            </h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs
                ? "La tecnología, la Inteligencia Artificial, los sistemas inteligentes y los sistemas de datos evolucionan continuamente. 3Tree Digital Sport IA se reserva el derecho de actualizar, modificar, mejorar, reemplazar, suspender o descontinuar características específicas, tecnologías, algoritmos, interfaces, aplicaciones o servicios cuando sea razonablemente necesario."
                : "Technology, Artificial Intelligence, intelligent systems, and data systems evolve continuously. 3Tree Digital Sport IA reserves the right to update, modify, improve, replace, suspend, or discontinue specific features, technologies, algorithms, interfaces, applications, or services when reasonably necessary."}
            </p>
            <p className="text-white/70 leading-relaxed text-sm md:text-base font-light">
              {isEs ? "Estos cambios pueden realizarse para:" : "These changes may be made to:"}
            </p>
            <ul className="list-disc pl-6 space-y-1 text-white/50 text-sm font-light">
              <li>{isEs ? "Mejorar la funcionalidad." : "Improve functionality."}</li>
              <li>{isEs ? "Incrementar la seguridad." : "Increase security."}</li>
              <li>{isEs ? "Corregir errores técnicos." : "Correct errors."}</li>
              <li>{isEs ? "Adaptarse a avances tecnológicos." : "Adapt to technological developments."}</li>
              <li>{isEs ? "Mejorar el rendimiento de la plataforma." : "Improve performance."}</li>
              <li>{isEs ? "Introducir nuevas capacidades." : "Introduce new capabilities."}</li>
              <li>{isEs ? "Cumplir con requisitos legales u operativos." : "Meet legal or operational requirements."}</li>
            </ul>
            <p className="text-white/60 text-sm font-light pt-2">
              {isEs
                ? "Cuando corresponda, los cambios significativos en estos Términos de Servicio se reflejarán actualizando la fecha mostrada en la parte superior. El uso continuado de un servicio tras la entrada en vigor de los términos actualizados constituye la aceptación de los mismos."
                : "Where appropriate, significant changes to these Terms of Service will be reflected by updating the date displayed at the top of this document. Continued use of an applicable service after updated terms become effective may constitute acceptance of the revised terms, to the extent permitted by applicable law."}
            </p>
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl space-y-1 text-sm font-mono text-white/80 mt-6">
              <p className="font-bold text-white text-base">3Tree Digital Sport IA</p>
              <p className="text-brandOrange text-xs uppercase tracking-wider font-semibold">AI Sports Intelligence Company</p>
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
