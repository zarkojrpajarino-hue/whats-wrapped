# Análisis Exhaustivo de la Conversación — Proyecto "ChatMemory / WhatsWrapped"

## 1. Resumen Ejecutivo

La conversación documenta la ideación y planificación inicial de un producto SaaS llamado **ChatMemory**: una experiencia tipo **Spotify Wrapped** aplicada a conversaciones exportadas de WhatsApp. El objetivo es transformar archivos `.txt` de exportación de WhatsApp en una experiencia narrativa, visual y emocional que permita al usuario revivir la historia de una relación a través de datos, insights generados por IA y animaciones.

---

## 2. Cronología de la Conversación

| Hora  | Tema Principal | Output Clave |
|-------|---------------|--------------|
| 7:57  | Pitch inicial de la idea | Evaluación de potencial + 3 capas del producto + modelo de negocio |
| 8:03  | Referencia a Spotify Wrapped | Demo interactivo de 9 pantallas tipo Wrapped |
| 8:10  | Profundización emocional en pantallas | Diseño de 13 pantallas con arco narrativo completo |
| 8:23  | Estrategia de desarrollo | Roadmap en 4 fases con decisiones arquitectónicas clave |
| 8:25  | Fase 0: Parser real | Parser HTML/JS completo y funcional para WhatsApp export |
| 8:30  | Stack técnico: Claude Code + GitHub + Supabase | Arquitectura completa del proyecto con estructura de carpetas |
| 8:34  | Configuración del repositorio GitHub | Guía de setup con configuración recomendada |

---

## 3. Idea Central del Producto

### Problema que resuelve
Las personas quieren recordar cómo empezaron a hablar con alguien, revivir momentos clave de una relación, y entender patrones de comunicación. WhatsApp permite exportar chats, pero el archivo `.txt` resultante es ilegible y no ofrece ningún insight.

### Solución propuesta
Una web app que:
1. Recibe un archivo `.txt` exportado de WhatsApp
2. Lo parsea **100% en el navegador** (privacidad por diseño)
3. Extrae estadísticas, patrones y momentos clave
4. Usa IA (Claude API) para generar narrativa emocional
5. Presenta todo en un formato **Spotify Wrapped** — pantalla a pantalla, una stat por slide

---

## 4. Arquitectura del Producto (3 Capas)

### Capa 1 — Datos e Insights (Núcleo)
- Línea temporal interactiva con hitos detectados por IA
- Evolución emocional semana a semana
- Momentos top: mensaje más gracioso, más emotivo, día más activo
- Patrones ocultos: quién inicia más, horas de conversación, ratio audio vs texto

### Capa 2 — Storytelling Visual
- "Capítulos" / "Eras" de la relación generados por IA
- Word cloud por etapa (no general)
- Frases más repetidas / palabras características por persona

### Capa 3 — Diferenciador Premium
- Video recap estilo Instagram Rewind con texto animado (no video real con imágenes)
- Carta/resumen narrativo generado por IA: "Así comenzó todo..."
- Exportable como PDF/presentación

---

## 5. Las 13 Pantallas del Wrapped (Diseño Final)

| # | Pantalla | Descripción | Emoción Target |
|---|----------|-------------|----------------|
| 1 | Primer mensaje real | Burbujas animadas del primer intercambio real | Nostalgia pura |
| 2 | Total de mensajes | Cifra grande + contexto temporal | Asombro |
| 3 | Racha más larga | Días consecutivos hablando | Compromiso |
| 4 | Día pico | Día con más mensajes + "¿Qué pasó?" | Curiosidad |
| 5 | Tiempos de respuesta | "Ella responde en 3 min, tú en 8" + dato nocturno | Vulnerabilidad |
| 6 | Distribución horaria | 71% de noche, fondo cósmico con estrellas | Intimidad |
| 7 | Quién habla más | Ratio de mensajes por persona | Autoconocimiento |
| 8 | Top palabras | Palabras más usadas por persona | Identidad |
| 9 | Media compartida | Fotos, audios, vídeos, stickers enviados | Escala |
| 10 | Las Eras | Timeline con capítulos detectados por IA con descripciones en prosa | **Corazón del producto** |
| 11 | Punto de inflexión | Gráfica con spike + "Solo vosotros lo sabéis" | Cinematográfico |
| 12 | Mensaje más largo | El mensaje más extenso con contexto | Profundidad |
| 13 | Resumen final / Share card | Card compartible con stats clave | Viralidad |

### Principios de diseño identificados:
- **Una sola emoción por pantalla** — lo que hace Wrapped adictivo
- **Orden = arco narrativo** — del comienzo a la escala, de las dinámicas a las eras, al cierre
- **La IA señala pero no revela** — "¿Qué pasó ese día? Solo vosotros lo sabéis"
- **Pantalla 10 (Las Eras) es el diferenciador** — ningún otro producto lo ofrece

---

## 6. Problemas Críticos Identificados

### 6.1 Privacidad (Bloqueador Principal)
- **Problema**: Nadie sube 3 años de conversación íntima a un servidor desconocido
- **Solución**: Procesamiento 100% client-side. El archivo `.txt` nunca sale del navegador
- **Implementación**: FileReader API + JS puro para parsing y métricas
- **Marketing**: Badge "Tu chat nunca sale de tu móvil"
- **Impacto**: Sin esto, el 70-80% de usuarios potenciales no usará el producto

### 6.2 Volumen de Tokens
- **Problema**: Una conversación de 3 años puede tener 500.000+ mensajes
- **Solución**: Parseo local → extracción de highlights → solo highlights al LLM
- **Coste objetivo**: < €0,10 por usuario con chunking inteligente
- **Arquitectura**: Las estadísticas las calcula JS puro (gratis), Claude solo genera narrativa

### 6.3 Generación de "Video"
- **Problema**: Generar video real con imágenes es complejo y costoso
- **Solución**: Texto animado tipo Spotify Wrapped, no video real
- **Tecnología sugerida**: Remotion (React para video) o canvas animado
- **Resultado**: Igual de impactante visualmente, mucho más viable técnicamente

---

## 7. Modelo de Negocio

| Tier | Qué ofrece | Precio |
|------|-----------|--------|
| **Free** | Timeline básica + 5 insights | Gratis |
| **Memory** | Análisis completo + capítulos + PDF | €4,99 one-time |
| **Recap** | Todo + video animado exportable | €9,99 one-time |

### Decisiones clave:
- **One-time payment, nunca suscripción** — la gente usa esto 2-3 veces al año, no paga mensual
- **Analogía**: como pagar €3 por una canción que te recuerda algo
- **Motor de crecimiento**: la share card final genera viralidad orgánica (cada share = anuncio gratuito)

---

## 8. Stack Técnico Definido

### Arquitectura
```
chatmemory/
├── src/
│   ├── parser/
│   │   ├── whatsapp.ts      ← parser tipado (iOS + Android)
│   │   ├── analyzer.ts      ← métricas y estadísticas
│   │   └── chunker.ts       ← prepara datos para Claude API
│   ├── ai/
│   │   ├── eras.ts          ← detecta capítulos con Claude
│   │   ├── narrative.ts     ← genera textos emocionales
│   │   └── inflection.ts    ← puntos de inflexión
│   ├── components/
│   │   └── wrapped/         ← las 13 pantallas
│   └── lib/
│       └── supabase.ts      ← solo auth + pagos
├── supabase/
│   └── functions/           ← Edge Functions para Claude API
└── stripe/
    └── webhook.ts           ← pagos
```

### Tecnologías
| Componente | Tecnología | Justificación |
|-----------|-----------|---------------|
| Frontend | Next.js 14 + TypeScript + Tailwind | Stack moderno, SSR para SEO |
| Parsing | JavaScript client-side puro | Privacidad, sin coste de servidor |
| IA | Claude API via Supabase Edge Functions | API key nunca expuesta al cliente |
| Auth | Supabase magic link (solo email) | Sin contraseñas, mínima fricción |
| Pagos | Stripe (webhook) | Ya conocido por el usuario |
| Video/recap | Remotion o canvas animado | React nativo para generación de video |
| Base de datos | Supabase (2 tablas: users + analyses) | Mínima, solo auth + guardar resultados |

### Regla de seguridad inamovible:
> La Claude API key **NUNCA** va en el frontend. Todo lo que llame a Anthropic va por Supabase Edge Functions con la key en variables de entorno del servidor.

---

## 9. Parser de WhatsApp (Fase 0 - Completada en la Conversación)

### Capacidades del parser entregado:
- Soporta formato **iOS** (`[DD/MM/YYYY, HH:MM:SS]`) y **Android** (`DD/MM/YYYY, HH:MM -`)
- Detección automática del formato
- Manejo de mensajes multilínea
- Métricas extraídas:
  - Total de mensajes
  - Días de racha consecutivos
  - Día pico (más mensajes)
  - Distribución por hora (24h)
  - Ratio de participación por persona
  - Conteo de media (fotos, audios, vídeos, stickers)
  - Top 20 palabras (con stop words en español e inglés)
  - Primeros 4 mensajes reales con burbujas animadas
  - Punto de inflexión (semana con mayor salto de actividad)
  - Mensaje más largo con autor y fecha
- **100% offline** — funciona sin conexión a internet
- Entregado como HTML autónomo

---

## 10. Roadmap en 4 Fases

| Fase | Nombre | Duración Estimada | Entregable |
|------|--------|-------------------|------------|
| **Fase 0** | Parser real | ✅ Completado | Parser HTML funcional |
| **Fase 1** | MVP Web | ~1 semana | Next.js + parser TS + Wrapped básico |
| **Fase 2** | IA + Narrativa | ~1 semana | Claude API + Eras + textos emocionales |
| **Fase 3** | Monetización | ~1 semana | Stripe + tiers + auth |
| **Fase 4** | Growth | Ongoing | Share cards, OG images, SEO |

### Orden de commits propuesto:
```
feat: parser typescript + tipos completos
feat: analyzer con todas las métricas
feat: wrapped screens componentes base
feat: supabase auth magic link
feat: edge function claude api + chunking
feat: stripe webhook premium unlock
feat: share card generación OG image
```

---

## 11. Decisiones Estratégicas Clave

### Validadas en la conversación:
1. **Privacidad client-side** — no negociable, es el producto
2. **One-time payment** — no suscripción
3. **Claude Code + GitHub + Supabase** — stack elegido sobre Lovable
4. **Repo privado** — proyecto pre-lanzamiento, no open source aún
5. **Sin license inicialmente** — código propietario por defecto

### Pendientes de decisión:
1. **Nombre definitivo** — candidatos: Memo, Vínculo, Recall, Eras, Rewind, ChatMemory
2. **Dominio** — debe estar libre
3. **Landing page vs MVP directo** — no se resolvió en la conversación
4. **Soporte multi-idioma** — mencionado implícitamente pero no definido

---

## 12. Ventajas Competitivas Identificadas

1. **"Las Eras"** — ningún competidor detecta automáticamente capítulos de una relación
2. **Privacidad por arquitectura** (no por promesa) — procesamiento en navegador
3. **Narrativa emocional con IA** — no solo estadísticas frías
4. **Viralidad built-in** — cada share card es un anuncio gratuito
5. **Momento emocional como producto** — la gente paga por nostalgia

---

## 13. Riesgos y Consideraciones

| Riesgo | Severidad | Mitigación propuesta |
|--------|----------|---------------------|
| Privacidad percibida | Alta | Badge visible, procesamiento client-side verificable |
| Coste de tokens por usuario | Media | Chunking inteligente, < €0,10/usuario |
| Trademark "Rewind" | Baja | Evitar ese nombre, usar alternativas |
| Competencia futura | Media | Diferenciarse con Eras y narrativa IA |
| Formatos de export cambiantes | Baja | Parser con detección automática de formato |
| Chats en múltiples idiomas | Baja | Stop words multi-idioma en el parser |

---

## 14. Contexto del Usuario

- Tiene experiencia previa con **NOVA Hub** y **OPTIMUS-K** (proyectos construidos con Lovable)
- Ya usa **Stripe** (integrado en OPTIMUS-K)
- Perfil técnico suficiente para trabajar con Claude Code y GitHub
- Motivación personal: "muchas veces digo a ver quiero acordarme de cómo comencé a hablar con esta persona"
- Orientación a ejecución rápida — la conversación progresó de idea a parser funcional en ~40 minutos

---

## 15. Próximos Pasos Inmediatos

1. **Configurar el repo** — `npx create-next-app@latest . --typescript --tailwind --app --src-dir --no-git`
2. **Convertir parser HTML a módulos TypeScript** con tipos completos
3. **Construir las 13 pantallas** como componentes React
4. **Integrar Supabase** para auth + storage de resultados
5. **Crear Edge Function** para Claude API con chunking
6. **Implementar Stripe** para tiers de pago
7. **Diseñar share card** con generación de OG image

---

*Análisis generado a partir de la conversación compartida en claude.ai/share/72b0bb44-43fe-430f-a083-ad5871d6bbf5*
