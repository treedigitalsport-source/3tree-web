export interface Article {
  id: number;
  slug: string;
  author: string;
  authorRoleEs: string;
  authorRoleEn: string;
  image: string;
  titleEs: string;
  titleEn: string;
  categoryEs: string;
  categoryEn: string;
  timeEs: string;
  timeEn: string;
  descEs: string;
  descEn: string;
  execSummaryEs: string;
  execSummaryEn: string;
  insightsEs: string[];
  insightsEn: string[];
  contentEs: string;
  contentEn: string;
}

export const aiArticles: Article[] = [
  {
    id: 1,
    slug: "el-partido-invisible-big-data-ia",
    author: "Ali Zapata",
    authorRoleEs: "26 años como preparador físico y especialista en Sport Tech",
    authorRoleEn: "26 years as Strength & Conditioning Coach and Sport Tech Specialist",
    image: "/images/articles/el_partido_invisible_1788755675644.jpg",
    titleEs: "El partido invisible: cómo el Big Data y la IA están cambiando el deporte",
    titleEn: "The Invisible Game: How Big Data and AI Are Changing Sports",
    categoryEs: "Columna del Fundador",
    categoryEn: "Founder's Column",
    timeEs: "8 min de lectura",
    timeEn: "8 min read",
    descEs: "En 2026, un preparador físico puede detectar el riesgo de lesión de un deportista antes de que el propio deportista lo sienta. El dato ya no acompaña la decisión: la anticipa.",
    descEn: "In 2026, a strength & conditioning coach can detect injury risk before the athlete even feels it. Data no longer merely accompanies the decision: it anticipates it.",
    execSummaryEs: "En 2026, un preparador físico puede detectar el riesgo de lesión de un deportista antes de que el propio deportista lo sienta. El dato ya no acompaña la decisión: la anticipa. La gran pregunta no es cuántos datos tenemos, sino si sabemos convertirlos en mejores decisiones.",
    execSummaryEn: "In 2026, a strength & conditioning coach can detect injury risk before the athlete even feels it. Data no longer merely accompanies the decision: it anticipates it. The crucial question is not how much data we gather, but whether we know how to convert it into superior decisions.",
    insightsEs: [
      "De la intuición a la anticipación algorítmica: el dato aislado no gana partidos, el contexto y la velocidad de interpretación sí.",
      "La IA entra al vestuario: no dicta sentencias absolutas; formula preguntas críticas al staff técnico en segundos.",
      "Agentes de IA en la cancha: una arquitectura de agentes coordinados para ingesta, análisis histórico, reporte ejecutivo y seguimiento de recuperación.",
      "El valor insustituible sigue siendo humano: Experiencia Deportiva + Datos de Calidad + Inteligencia Artificial Supervisada."
    ],
    insightsEn: [
      "From intuition to algorithmic anticipation: isolated data wins no games; contextual interpretation does.",
      "AI enters the locker room: it issues no dogma; it poses actionable questions to the coaching staff in seconds.",
      "AI agents on the field: a multi-agent framework for ingestion, historical load comparison, executive reporting, and recovery tracking.",
      "The irreplaceable core remains human: Athletic Expertise + Quality Data + Supervised Artificial Intelligence."
    ],
    contentEs: `# El partido invisible: cómo el Big Data y la IA están cambiando el deporte

*Por Ali Zapata — 26 años como preparador físico y especialista en Sport Tech*

> En 2026, un preparador físico puede detectar el riesgo de lesión de un deportista antes de que el propio deportista lo sienta. El dato ya no acompaña la decisión: la anticipa.

Durante décadas, el deporte se decidió con intuición, experiencia y sensaciones. Hoy, los datos han entrado en el vestuario. Pero después de tres décadas trabajando junto a deportistas, tengo claro que la gran pregunta no es cuántos datos tenemos, sino si sabemos convertirlos en mejores decisiones.

---

## Del cronómetro al algoritmo

Un preparador físico ya no trabaja únicamente con un cronómetro, una libreta y su experiencia. Ahora puede conocer la carga de entrenamiento, la velocidad, la distancia recorrida, la calidad del sueño, la percepción de esfuerzo y la recuperación del deportista.

Relojes inteligentes, GPS, cámaras y sensores producen miles de datos cada día. Pero aquí aparece el verdadero desafío: un dato aislado no gana partidos. Lo importante es entender qué significa, compararlo con el contexto y usarlo para tomar una decisión a tiempo.

---

## Qué es realmente el Big Data deportivo

El Big Data aplicado al deporte consiste en recoger, ordenar y analizar grandes volúmenes de información para comprender mejor el rendimiento y anticipar escenarios. No se trata solo de medir cuánto corre un futbolista o cuántos kilómetros recorre un ciclista, sino de saber cómo responde su cuerpo, qué carga acumula y cómo evoluciona respecto a sí mismo.

### La Evolución del Rendimiento

| Antes | Ahora |
| :--- | :--- |
| *"Hoy lo veo cansado"* | *"Su carga ha aumentado y su recuperación ha disminuido"* |
| Decisiones basadas solo en sensaciones | Decisiones apoyadas en datos y experiencia |
| Informes puntuales | Seguimiento continuo |
| Información dispersa | Datos integrados y comparables |

El objetivo no es sustituir al entrenador. Es ayudarle a observar mejor, detectar antes los cambios y dedicar más tiempo a lo verdaderamente importante: **decidir**.

---

## La inteligencia artificial entra en el vestuario

La IA está cambiando la forma de interpretar los datos deportivos. Un sistema inteligente puede analizar miles de registros, encontrar patrones invisibles a simple vista y presentar una recomendación en segundos — por ejemplo, identificar que un deportista acumula sesiones exigentes, duerme peor de lo habitual y declara una fatiga superior a su media.

La máquina no dicta una sentencia. Plantea una pregunta: *¿conviene mantener la planificación prevista o revisar la carga de la próxima sesión?*

La decisión final sigue en manos del profesional. La IA ordena, compara y alerta. La experiencia humana aporta lo que ningún algoritmo conoce por completo: la conversación con el deportista, el momento de la temporada y las circunstancias personales.

---

## Agentes de IA: de la teoría a la cancha

Aquí es donde el discurso suele quedarse abstracto — *"un agente puede hacer esto, otro puede hacer aquello"* — sin bajarlo a la realidad. En la práctica, esto ya funciona así:

- **Agente de Ingesta y Organización:** Recoge y organiza los datos de cada sesión de entrenamiento en tiempo real.
- **Agente de Análisis Histórico:** Compara la evolución de la carga contra el histórico del deportista y detecta desviaciones.
- **Agente de Reporte Ejecutivo:** Traduce ese análisis en un informe breve para el cuerpo técnico, sin jerga innecesaria.
- **Agente de Seguimiento de Recuperación:** Monitorea la recuperación diaria, preguntando directamente al deportista y cruzando su respuesta con los datos objetivos.

No es ciencia ficción: es la misma lógica con la que hoy se automatiza el análisis biomecánico o el scouting deportivo. La clave está en que cada agente tenga una función clara y que sus conclusiones puedan revisarse siempre. La tecnología debe ayudar a pensar mejor, no convertir el entrenamiento en una caja negra.

---

## El error de enamorarse de la tecnología

En el deporte existe una tentación evidente: comprar más dispositivos, acumular más métricas y usar palabras como inteligencia artificial o machine learning para parecer innovador.

Pero el deportista y el entrenador no necesitan cien gráficos. Necesitan respuestas útiles:

- ¿Está preparado el deportista para entrenar hoy?
- ¿Qué ha cambiado respecto a la semana anterior?
- ¿Qué situación debemos vigilar?
- ¿Qué decisión podemos tomar ahora?

El futuro no será de quien tenga más datos, sino de quien sepa convertirlos en acciones simples y comprensibles.

---

## El verdadero valor sigue siendo humano

Un algoritmo puede detectar una variación; el profesional debe comprenderla. Puede señalar una tendencia; el entrenador debe decidir si exige cambiar la sesión. Puede generar una recomendación; la persona junto al deportista debe valorar si tiene sentido aplicarla.

El modelo más potente combina tres elementos:
**Experiencia Deportiva + Datos de Calidad + Inteligencia Artificial Supervisada.**

El Big Data deportivo no es una moda pasajera: permitirá personalizar entrenamientos, mejorar la recuperación y comprender al deportista con una profundidad antes inalcanzable. Pero los datos no entrenan solos, y ningún algoritmo sustituye el criterio de un profesional que lleva años observando y decidiendo.

> El deporte del futuro no enfrentará al ser humano contra la tecnología. Pondrá la tecnología al servicio del conocimiento humano.

La pregunta ya no es si el Big Data cambiará el deporte. La pregunta es si estamos preparados para usarlo con inteligencia y responsabilidad.`,
    contentEn: `# The Invisible Game: How Big Data and AI Are Changing Sports

*By Ali Zapata — 26 years as Strength & Conditioning Coach and Sport Tech Specialist*

> In 2026, a strength & conditioning coach can detect injury risk before the athlete even feels it. Data no longer merely accompanies the decision: it anticipates it.

For decades, sports were governed by intuition, empirical experience, and gut feeling. Today, data has entered the locker room. But after nearly three decades working alongside elite athletes, one truth is clear: the crucial question is not how much data we gather, but whether we know how to convert it into superior decisions.

---

## From the Stopwatch to the Algorithm

A strength & conditioning coach no longer works solely with a stopwatch, a notebook, and empirical experience. Today, they can track training load, velocity, distance covered, sleep quality, rate of perceived exertion (RPE), and athlete recovery.

Smartwatches, GPS units, cameras, and optical sensors generate thousands of data points daily. Yet here lies the real challenge: isolated data does not win matches. What truly matters is understanding what that data signifies, contextualizing it, and using it to make decisive calls in real time.

---

## What Sports Big Data Really Is

Big Data applied to sports consists of harvesting, structuring, and analyzing large volumes of information to better understand performance and forecast scenarios. It is not merely about measuring how far a soccer player runs or how many kilometers a cyclist pedals, but understanding how their physiology responds, what internal and external load accumulates, and how they evolve relative to their baseline.

### The Evolution of Performance Analysis

| Before | Now |
| :--- | :--- |
| *"He looks tired today"* | *"His load increased while recovery capacity dropped"* |
| Decisions driven purely by sensation | Decisions backed by integrated data and expertise |
| Sporadic, isolated reports | Continuous, uninterrupted monitoring |
| Fragmented and siloed information | Fully integrated and comparable datasets |

The goal is never to replace the coach. It is to empower them to observe with greater clarity, detect shifts sooner, and dedicate time to what truly matters: **deciding**.

---

## Artificial Intelligence Enters the Locker Room

AI is fundamentally altering how sports data is interpreted. An intelligent system can analyze thousands of historical records, uncover patterns invisible to the naked eye, and deliver actionable recommendations in seconds — for instance, identifying that an athlete has accumulated intense sessions, suffered degraded sleep quality, and reported fatigue higher than their baseline.

The machine does not issue an absolute verdict. It poses the crucial question: *Is it advisable to proceed with the planned session, or should we modify today's training load?*

The final decision remains strictly in human hands. AI organizes, compares, and alerts. Human experience provides what no algorithm fully possesses: direct dialogue with the athlete, season timing, and personal context.

---

## AI Agents: From Theory to the Field

This is where industry discourse often remains abstract — *"one agent can do this, another can do that"* — without grounding it in field reality. In practice, this is how our multi-agent architecture operates today:

- **Ingestion & Organization Agent:** Collects and structures data from every training session instantly.
- **Historical Load Analysis Agent:** Compares load progression against the athlete's multi-year baseline and detects micro-deviations.
- **Executive Staff Dispatcher Agent:** Translates complex analytical models into clear, concise briefings for the coaching staff without technical jargon.
- **Daily Recovery & Readiness Agent:** Tracks daily recovery trends, checking in directly with the athlete and cross-referencing subjective feedback with biometric telemetry.

This is not science fiction: it is the exact same operational logic automating biomechanical analysis and sports scouting today. The key is giving every agent a precise mission and ensuring their outputs are always fully auditable by human experts. Technology must sharpen human intellect, not turn training into an unexplainable black box.

---

## The Trap of Falling in Love with Technology

In the sports tech world, there is an obvious temptation: purchasing more gadgets, hoarding metrics, and scattering buzzwords like artificial intelligence or machine learning merely to appear innovative.

Yet athletes and coaches do not need a hundred charts. They need actionable clarity:

- Is the athlete ready to train at full intensity today?
- What has shifted compared to last week?
- What risk factor must we monitor right now?
- What concrete decision should we make immediately?

The future will not belong to whoever hoards the most data, but to whoever translates data into simple, decisive actions.

---

## The True Value Remains Human

An algorithm can detect a fluctuation; the professional must interpret its meaning. It can signal an emerging trend; the coach must determine whether to alter the session. It can generate a recommendation; the mentor alongside the athlete must judge whether it makes practical sense.

The most potent high-performance model combines three indispensable pillars:
**Athletic Expertise + Quality Data + Supervised Artificial Intelligence.**

Sports Big Data is not a passing trend: it will enable unprecedented training personalization, optimize recovery cycles, and provide a depth of athlete understanding never before possible. But data cannot train on its own, and no algorithm will ever replace the seasoned judgment of a coach who has spent decades observing, adapting, and deciding under pressure.

> The sport of the future will not pit humanity against technology. It will place technology at the service of human expertise.

The question is no longer whether Big Data will transform sports. The real question is whether we are ready to harness it with intelligence, purpose, and responsibility.`
  },
  {
    id: 2,
    slug: "china-apuesta-1-trillon-deporte-ia-2030",
    author: "Ali Zapata & Consejo Editorial",
    authorRoleEs: "26 años en Alto Rendimiento · Sports Intelligence & IA",
    authorRoleEn: "26 years in High Performance · Sports Intelligence & AI",
    image: "/images/articles/china_1_trillion_sports_ai_2030.jpg",
    titleEs: "China apuesta $1 billón de dólares: IA, infraestructura y el Proyecto 633 para dominar el deporte antes de 2030",
    titleEn: "China Bets $1 Trillion: AI, Mass Infrastructure, and Project 633 to Lead Global Sports by 2030",
    categoryEs: "Sport Intelligence & IA",
    categoryEn: "Sport Intelligence & AI",
    timeEs: "9 min de lectura",
    timeEn: "9 min read",
    descEs: "El nuevo Plan Quinquenal de China combina infraestructura masiva, participación ciudadana e Inteligencia Artificial como los tres pilares para construir la mayor potencia deportiva y de datos del planeta.",
    descEn: "China's new Five-Year Plan fuses massive infrastructure, citizen participation, and Artificial Intelligence as the three pillars to build the planet's largest sports and data powerhouse.",
    execSummaryEs: "China no busca únicamente ganar medallas olímpicas: está ejecutando un plan de Estado de $1 billón para construir un ecosistema deportivo hiperdigitalizado, donde la inteligencia artificial, el Big Data y el esquema competitivo 'Proyecto 633' transforman el rendimiento de élite y la salud pública en una industria de datos escalable.",
    execSummaryEn: "China is not merely chasing Olympic medals: it is executing a $1 trillion state plan to build a hyper-digitized sports ecosystem, where artificial intelligence, Big Data, and the 'Project 633' competitive framework convert elite performance and public health into a scalable national data industry.",
    insightsEs: [
      "Los tres pilares estratégicos: Infraestructura masiva (4 m² por persona), Participación masiva (40% de población activa) e Inteligencia Artificial (entrenamiento inteligente y deportes virtuales).",
      "El 'Proyecto 633': 6 disciplinas consolidadas de dominio histórico, 3 modalidades individuales clave (atletismo, natación y acuáticos) y 3 deportes de equipo prioritarios (fútbol, baloncesto y voleibol).",
      "Deporte como industria de datos: La integración de IA y Big Data convierte cada sesión de entrenamiento en telemetría accionable y crea 100 destinos deportivos de alta calidad al aire libre.",
      "Geopolítica Sport Tech: La continuidad de planes de Estado a 5 años plantea una ventaja estructural frente a los ciclos electorales y presupuestos fragmentados de Occidente."
    ],
    insightsEn: [
      "Three strategic pillars: Mass infrastructure (4 m² per capita), Mass participation (40% active population), and Artificial Intelligence (smart training & virtual sports).",
      "The 'Project 633' Roadmap: 6 historically dominant sports, 3 foundational individual disciplines (athletics, swimming, aquatic sports), and 3 target team sports (soccer, basketball, volleyball).",
      "Sports as a National Data Industry: AI and Big Data turn every training session into actionable telemetry while developing 100 high-quality outdoor sports destinations.",
      "Sport Tech Geopolitics: 5-year state continuity poses a structural competitive advantage over fragmented Western private and electoral cycles."
    ],
    contentEs: `# China apuesta $1 billón de dólares: IA, infraestructura y el Proyecto 633 para dominar el deporte antes de 2030

*Por Ali Zapata & Consejo Editorial de 3Tree Digital*

> La transformación del deporte moderno no se mide solo en podios: se define por la capacidad de articular infraestructura, datos masivos y algoritmos de inteligencia artificial a escala nacional.

El nuevo Plan Quinquenal anunciado por el gobierno chino marca uno de los hitos más ambiciosos en la historia de la industria deportiva global: una inversión proyectada en **$1 billón de dólares (1 Trillion USD)** destinada a consolidar al país como la máxima potencia deportiva antes de 2030. 

A diferencia de los modelos tradicionales de financiamiento deportivo, esta estrategia no se limita al atletismo de alto rendimiento: integra salud pública, urbanismo inteligente y una profunda digitalización respaldada por Inteligencia Artificial y Big Data.

---

## La Triada Estratégica: Infraestructura, Masa e Inteligencia Artificial

El plan se fundamenta en tres pilares interconectados que actúan como un embudo de desarrollo atlético integral:

1. **Infraestructura Deportiva Inteligente:** Garantizar una meta de **4 m² de instalaciones deportivas por habitante** y construir más de **5.000 microinstalaciones deportivas** (microparks y canchas multiuso comunitarias).
2. **Participación Masiva:** Alcanzar el **40% de la población activa realizando ejercicio físico regular**, generando una base poblacional saludable y un semillero de captación de talentos sin precedentes.
3. **Inteligencia Artificial y Big Data:** Digitalizar la preparación física mediante sistemas de entrenamiento inteligente, modalidades deportivas virtuales y análisis biomecánico automatizado.

---

## El "Proyecto 633": La Hoja de Ruta del Alto Rendimiento

En paralelo al fomento masivo, el plan estructura el deporte de élite bajo lo que se conoce formalmente como el **Proyecto 633**, un esquema táctico que organiza las prioridades competitivas de la nación en tres niveles críticos:

### Estructura Táctica del Proyecto 633

| Nivel | Enfoque Estratégico | Disciplinas Incluidas | Objetivo Operativo |
| :--- | :--- | :--- | :--- |
| **6 Disciplinas Dominantes** | Consolidación de hegemonía | Tenis de mesa, Bádminton, Gimnasia, Levantamiento de pesas, Clavados, Tiro | Mantener supremacía olímpica y optimizar telemetría de entrenamiento. |
| **3 Modalidades Fundamentales** | Desarrollo y expansión de base | Atletismo, Natación y Deportes Acuáticos | Aplicar visión computacional y modelos biomecánicos para reducir brechas de marcas mundiales. |
| **3 Deportes de Equipo Clave** | Transformación estructural prioritaria | Baloncesto, Voleibol y Fútbol | Revertir debilidades históricas mediante analítica sabermétrica y captación masiva de talento. |

Este último escalón es el más revelador: reconoce con pragmatismo una debilidad histórica estructural en deportes colectivos y la transforma en un **objetivo de Estado financiado con recursos masivos**.

---

## Dónde entra la Tecnología: La Creación de una Industria de Datos

El dato más relevante para el ecosistema Sport Tech aparece en la integración tecnológica: China implementará **Inteligencia Artificial y Big Data** para desarrollar servicios inteligentes de acondicionamiento físico y modalidades deportivas virtuales.

No se trata únicamente de construir canchas de cemento, sino de digitalizar la experiencia de cientos de millones de personas:
- **Entrenamiento Personalizado Algorítmico:** Detección temprana de sobrecargas y curvas de adaptación fisiológica.
- **Deportes Virtuales y Simulación Inmersiva:** Democratización del acceso al alto rendimiento en centros urbanos de alta densidad.
- **100 Destinos Deportivos al Aire Libre de Alta Calidad:** Creación de rutas y parques conectados con sensores y telemetría de monitoreo ambiental y físico.

El mensaje de fondo es inequívoco: **China no busca únicamente ganar medallas; busca construir una industria deportiva integral de datos, servicios y experiencias replicable a escala nacional.**

---

## Continuidad Estratégica vs. Fragmentación Occidental

Estos objetivos no parten de cero. Según Gao Zhidan, director de la Administración General del Deporte de China, la práctica deportiva ganó adherencia sostenida durante el 14.º Plan Quinquenal, mientras los atletas chinos alcanzaron en los últimos Juegos Olímpicos celebrados en el extranjero su mejor desempeño histórico.

El nuevo plan, entonces, no es una apuesta improvisada: es la aceleración de una tendencia construida con paciencia de Estado. 

La pregunta que queda abierta para las potencias deportivas occidentales —donde la inversión deportiva depende frecuentemente de ciclos electorales cortos y presupuestos privados fragmentados— es si podrán competir con una estrategia que se planifica a cinco años, se financia a escala de billones y se ejecuta con la precisión de la inteligencia artificial.`,
    contentEn: `# China Bets $1 Trillion: AI, Mass Infrastructure, and Project 633 to Lead Global Sports by 2030

*By Ali Zapata & 3Tree Digital Editorial Board*

> The transformation of modern sports is no longer measured solely in podium finishes: it is defined by the ability to orchestrate infrastructure, massive data, and artificial intelligence algorithms at a national scale.

The new Five-Year Plan announced by the Chinese sports administration marks one of the most ambitious milestones in global sports history: a projected **$1 Trillion USD** commitment designed to solidify the nation as the undisputed global sports powerhouse before 2030.

Unlike conventional sports funding models, this blueprint extends far beyond elite Olympic training: it bridges public health, smart urbanism, and deep digitalization powered by Artificial Intelligence and Big Data.

---

## The Strategic Triad: Infrastructure, Mass Participation, and AI

The national roadmap is built upon three interconnected pillars that form a comprehensive athletic pipeline:

1. **Intelligent Sports Infrastructure:** Mandating **4 m² of sports facilities per capita** and building over **5,000 community sports micro-facilities** (microparks and multi-use courts).
2. **Mass Participation:** Driving **40% of the active population into regular physical exercise**, establishing a healthier talent pool and an unprecedented scouting pipeline.
3. **Artificial Intelligence & Big Data:** Digitalizing athletic preparation through smart training platforms, virtual sports environments, and automated kinematic tracking.

---

## "Project 633": The Elite High-Performance Roadmap

Parallel to mass participation, the blueprint structures elite competition under **Project 633**, a framework prioritizing national sports development across three strategic tiers:

### Tactical Architecture of Project 633

| Tier | Strategic Focus | Included Disciplines | Operational Objective |
| :--- | :--- | :--- | :--- |
| **6 Dominant Disciplines** | Hegemony consolidation | Table tennis, Badminton, Gymnastics, Weightlifting, Diving, Shooting | Maintain Olympic supremacy and refine training telemetry. |
| **3 Foundational Sports** | Fundamental baseline expansion | Track & Field, Swimming, Aquatic Sports | Deploy computer vision and biomechanical modeling to close world-record gaps. |
| **3 Key Team Sports** | Priority structural overhaul | Basketball, Volleyball, Soccer (Football) | Overcome historical underperformance using sabermetric modeling and AI-driven scouting. |

This final tier is the most telling: it pragmatically identifies a structural weakness in global team sports and turns it into a state-funded national priority.

---

## Where Technology Enters: Building a Sports Data Industry

The most critical development for the Sport Tech ecosystem is the direct integration of **Artificial Intelligence and Big Data** to develop smart fitness services and virtual sports modalities.

This goes far beyond building concrete stadiums; it is about digitalizing the physical journey of hundreds of millions of citizens:
- **Algorithmic Personalized Training:** Early overload detection and physiological adaptation curves.
- **Virtual Sports & Simulation:** Democratizing high-performance athletic experiences in high-density metropolitan hubs.
- **100 High-Quality Outdoor Sports Destinations:** Developing outdoor sports hubs equipped with environmental and biometric telemetry.

The underlying signal is crystal clear: **China is not merely chasing medals; it is building a nationwide sports data, service, and experience industry.**

---

## State Continuity vs. Western Fragmentation

These goals do not begin in a vacuum. According to Gao Zhidan, director of the General Administration of Sport of China, active participation expanded significantly over the 14th Five-Year Plan, while Chinese athletes achieved their greatest overseas Olympic performance to date.

The new blueprint is the acceleration of a decade-long vision executed with state patience.

The open question for Western sports institutions — where investment often depends on short political election cycles and fragmented private capital — is whether they can compete against a strategy planned over five-year horizons, backed by $1 trillion, and accelerated by artificial intelligence.`
  }
];

export const neilArticles: Article[] = [
  {
    id: 101,
    slug: "baseball-analytics-revolution",
    author: "Neil Alvarado",
    authorRoleEs: "Analista Principal de Béisbol y Sabermetría",
    authorRoleEn: "Lead Baseball & Sabermetrics Analyst",
    image: "/images/articles/baseball_biomechanics_1785628048219.jpg",
    titleEs: "La Matriz del Béisbol: Sabermetría Avanzada",
    titleEn: "The Matrix of Baseball: Advanced Sabermetrics",
    categoryEs: "Perspectiva del Analista",
    categoryEn: "Analyst's Perspective",
    timeEs: "12 min de lectura",
    timeEn: "12 min read",
    descEs: "Un análisis profundo de cómo el Spin Rate, el Ángulo de Salida y la Velocidad de Salida han reescrito las reglas fundamentales del pitcheo y bateo.",
    descEn: "A deep dive into how Spin Rate, Launch Angle, and Exit Velocity have completely rewritten the fundamental rules of pitching and hitting.",
    execSummaryEs: "La analítica avanzada no es una moda, es la base del béisbol moderno.",
    execSummaryEn: "Advanced analytics isn't a trend, it's the foundation of modern baseball.",
    insightsEs: [
      "El diseño de pitcheos en laboratorios biomecánicos ha sustituido el desarrollo empírico.",
      "El ángulo de salida óptimo entre 10 y 30 grados ha maximizado la producción de cuadrangulares."
    ],
    insightsEn: [
      "Pitch design in biomechanics labs has replaced empirical development.",
      "Optimal launch angles between 10 and 30 degrees have maximized league-wide home run production."
    ],
    contentEs: `# La Matriz del Béisbol: Sabermetría Avanzada

*Por Neil Alvarado, Analista Principal de Béisbol*

> El béisbol ya no es un juego de instintos aislados; es una ciencia de vectores, cinemática y probabilidades computadas en milisegundos.

Durante más de un siglo, el talento en el béisbol se medía con la vista y el cronómetro tradicional. Hoy, la sabermetría y las cámaras de alta velocidad han abierto una dimensión invisible para el ojo humano.

---

## La Revolución de los Datos de Rastreo

Con tecnologías como Hawkeye y TrackMan, cada lanzamiento y cada batazo se descomponen en variables exactas:
- **Velocidad de Salida (Exit Velocity)**
- **Ángulo de Lanzamiento (Launch Angle)**
- **Tasa de Rotación (Spin Rate)**
- **Eje de Giro (Spin Axis)**

Estas métricas no solo describen lo que ocurrió: permiten rediseñar la mecánica del atleta para alcanzar su potencial máximo.`,
    contentEn: `# The Matrix of Baseball: Advanced Sabermetrics

*By Neil Alvarado, Lead Baseball Analyst*

> Baseball is no longer a game of isolated instincts; it is a science of vectors, kinematics, and millisecond probabilities.

For more than a century, baseball talent was judged by the naked eye and a stopwatch. Today, sabermetrics and high-speed computer vision have unlocked a dimension once invisible.

---

## The Tracking Data Revolution

With Hawkeye and TrackMan optical tracking, every pitch and batted ball is deconstructed into precise telemetry:
- **Exit Velocity**
- **Launch Angle**
- **Spin Rate**
- **Spin Axis**

These metrics do not merely recount what happened: they allow coaches to redesign biomechanics for maximum performance.`
  },
  {
    id: 102,
    slug: "the-analyst-journey",
    author: "Neil Alvarado",
    authorRoleEs: "Analista Principal de Béisbol",
    authorRoleEn: "Lead Baseball Analyst",
    image: "/images/articles/baseball_scouting_big_data_1784602676416.jpg",
    titleEs: "El Viaje del Analista: De las gradas a la jugada",
    titleEn: "The Analyst's Journey: From the Bleachers to the Play",
    categoryEs: "Perspectiva del Analista",
    categoryEn: "Analyst's Perspective",
    timeEs: "10 min de lectura",
    timeEn: "10 min read",
    descEs: "Un relato personal sobre la evolución del rol del analista en el béisbol: de observar partidos con libreta, a coordinar modelos predictivos.",
    descEn: "A personal account of the evolution of the analyst's role in baseball: from watching games with a notebook, to orchestrating predictive models.",
    execSummaryEs: "El verdadero rol del analista moderno no es acumular estadísticas, sino ser el puente entre los modelos matemáticos y las decisiones del cuerpo técnico.",
    execSummaryEn: "The real role of the modern analyst is not accumulating statistics, but acting as the decisive bridge between mathematical models and tactical decisions.",
    insightsEs: [
      "La libreta manual evolucionó hacia dashboards interactivos en tiempo real.",
      "El valor no está en el algoritmo aislado, sino en la capacidad de comunicarlo al staff."
    ],
    insightsEn: [
      "Manual scorecards evolved into interactive real-time telemetry dashboards.",
      "The value lies not in isolated algorithms, but in clear communication to the field staff."
    ],
    contentEs: `# El Viaje del Analista: De las gradas a la jugada

*Por Neil Alvarado*

> El analista contemporáneo no vive en una torre de marfil; trabaja codo a codo en el dugout y en el terreno de juego.

La transformación digital del deporte ha redefinido lo que significa entender el juego. Lo que antes requería semanas de recopilación manual, hoy se procesa en tiempo real para influir en las decisiones estratégicas de cada entrada.`,
    contentEn: `# The Analyst's Journey: From the Bleachers to the Play

*By Neil Alvarado*

> The contemporary analyst does not live in an ivory tower; they work shoulder-to-shoulder in the dugout and on the field.

The digital transformation of sports has redefined what it means to understand the game. What once took weeks of manual charting is now processed in real time to influence tactical decisions in every inning.`
  }
];
