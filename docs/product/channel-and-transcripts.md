# Canal WhatsApp 1:1 y transcripciones de reuniones

**Estado:** Aceptado para el MVP del hackathon (6 jun 2026).

La visión original contemplaba un bot escuchando compromisos en un **grupo de WhatsApp**.
Twilio Sandbox (y el MVP actual) solo soportan **mensajes 1:1**. Este documento fija el
modelo de producto y los caminos para obtener transcripciones de Meet/Zoom.

---

## Modelo de canal: 1:1, no grupo

### Qué cambió

| Visión inicial | MVP actual |
|---|---|
| Bot pasivo en el chat del equipo | Cada persona **escribe al bot** en un chat privado |
| Captura automática del hilo grupal | Captura **activa**: mensaje directo al número del sandbox |
| Contexto rico del grupo | Mensaje aislado; identidad clara vía teléfono (`From`) |

### Por qué lo aceptamos

Twilio Sandbox no expone automatización en grupos. Para demostrar valor en un día, el
canal 1:1 es el path viable. Ver [ADR 0001](../decisions/0001-mvp-stack.md).

### Qué ganamos

- **Dueño confiable:** el remitente del WhatsApp es quien habla (`ProfileName` + teléfono).
- **Recordatorios privados:** el follow-up va al responsable, no al grupo.
- **Webhook simple:** un mensaje = un `From` = una persona.
- **Privacidad:** compromisos individuales no quedan expuestos al chat del equipo.

### Qué perdemos (y cómo compensamos)

- **Captura pasiva del grupo** — la gente sigue coordinando en WhatsApp como siempre; cuando
  cierran un compromiso, **le escriben al bot** (o el coordinador lo hace por ellos).
- **Contexto del hilo** — el LLM ve un mensaje suelto, no la conversación previa. Mitigación:
  el prompt pide `description` y marca `ambiguities` cuando falta contexto.
- **Visibilidad en el grupo** — el dashboard centraliza lo que antes quedaba enterrado en chats.

**Compensación clave para el demo:** el flujo **reuniones → tareas** captura muchos
compromisos de una sola vez; WhatsApp 1:1 cubre el seguimiento y los recordatorios.

### Narrativa de demo

> "El equipo sigue usando WhatsApp entre ellos. Cuando alguien cierra un compromiso — en
> reunión o después de coordinar — le escribe al bot: *Yo hago el informe para el viernes*.
> Dirección ve la carga en el dashboard; el bot manda recordatorios por WhatsApp privado."

Onboarding = agregar el contacto del sandbox y escribirle. Sin app, sin login.

### Post-MVP (fuera de scope hoy)

- Reenvío del coordinador al bot.
- Links `wa.me/...?text=...` desde el dashboard ("Registrar compromiso").
- WhatsApp Business API / Meta Cloud API con proveedor que soporte el caso de uso grupal.

---

## Transcripciones de Meet / Zoom

El MVP extrae tareas de un **texto de transcripción**. Hoy el path planeado es pegar ese
texto en el dashboard (`/meetings` → webhook n8n → LLM). Lo que falta trackear es **de dónde
sale el texto**.

### Nivel 0 — MVP hackathon ✅ (implementar)

| Paso | Acción |
|------|--------|
| 1 | Coordinador pega transcripción en el formulario del dashboard |
| 2 | Dashboard `POST { transcript }` al webhook `meeting-capture` (n8n) |
| 3 | LLM con `prompts/meeting-summary.md` → `meetings` + `tasks` + `meeting_tasks` |

**Para el demo:** usar texto de `database/seeds.sql`, una reunión de prueba transcrita a mano,
o copiar un export real (ver nivel 1).

### Nivel 1 — Export manual (realista para ONGs)

#### Google Meet

**Requisitos:** cuenta **Google Workspace**; transcripción activada durante la reunión.

1. En la reunión: **Actividades → Transcripción** (o activarla al crear el evento en Calendar).
2. Al terminar: Google guarda la transcripción en **Google Drive** (carpeta de grabaciones Meet).
3. Abrir el documento → copiar texto → pegar en Halketon.

Sin Workspace no hay transcripción nativa exportable de forma fiable.

#### Zoom

**Requisitos:** plan Pro o superior; **grabación en la nube** + "Create audio transcript" en
configuración de cuenta.

1. El host graba en la nube (manual o auto-grabación).
2. Tras la reunión: portal web de Zoom → **Recordings** → descargar **Audio transcript** (`.vtt`).
3. Abrir el `.vtt` (texto con timestamps) → copiar/pegar en Halketon. El LLM tolera timestamps;
   opcional limpiarlos en un paso previo.

**Mejora rápida post-hackathon:** subir `.vtt` / `.txt` en el formulario en lugar de solo pegar.

### Nivel 2 — Automatizado (backlog)

#### Zoom (path más simple si automatizan)

1. Zoom App con Server-to-Server OAuth.
2. Webhook `recording.transcript_completed`.
3. Descargar archivo `file_type: "TRANSCRIPT"` (WEBVTT).
4. `POST` del contenido al webhook `meeting-capture` en n8n.

**Condiciones:** reunión grabada en la nube, transcripción habilitada, transcript disponible
**después** de que termina la reunión (no en tiempo real).

Referencia: [Zoom — download recordings via webhooks](https://developers.zoom.us/blog/meeting-api-querying-tips-part4/)

#### Google Meet (más pesado)

1. Google Cloud + OAuth + **Google Workspace Events API** → Pub/Sub.
2. Evento `google.workspace.meet.transcript.v2.fileGenerated`.
3. Meet REST API → obtener transcript (Drive export URI o structured transcript).
4. Enviar texto a n8n.

**Condiciones:** Workspace, transcripción activada, infra GCP. Demasiado setup para el hackathon.

Referencia: [Subscribe to Google Meet events](https://developers.google.com/workspace/events/guides/events-meet)

#### Bots de terceros (Fireflies, Otter, Recall.ai, etc.)

Un bot entra a la call y expone transcript por API/webhook. Menos fricción que Meet API;
costo y dependencia extra. Tiene sentido si la ONG piloto ya usa una de estas herramientas.

### Qué decir en el demo sobre transcripciones

> "Hoy el coordinador pega la transcripción — la misma que ya exportaría de Meet o Zoom.
> El motor de extracción es el mismo; conectar el webhook de Zoom es el siguiente paso."

---

## Referencias

- [`mvp-definition.md`](mvp-definition.md) — features y demo script
- [`../diagrams/flows.md`](../diagrams/flows.md) — secuencia meeting extraction
- [`../decisions/0001-mvp-stack.md`](../decisions/0001-mvp-stack.md) — stack y guardrails
- [`../architecture/overview.md`](../architecture/overview.md) — contenedores e implementación
