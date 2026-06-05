# Deploy route (breve)

Stack del MVP: **Supabase Free** + **n8n en Coolify** (ya lo tenés) + **Next.js en Coolify**.

No hace falta un backend aparte (Express/Fastify). n8n orquesta; Supabase guarda; el dashboard lee.

```text
WhatsApp → n8n (Coolify) → Supabase
Director → Next.js (Coolify) → Supabase
Reuniones → Next.js → webhook n8n → Supabase
```

---

## 1. Supabase (~15 min)

1. Crear proyecto en [supabase.com](https://supabase.com) (Free tier).
2. SQL Editor → ejecutar `database/schema.sql`.
3. Ejecutar `database/seeds.sql`.
4. Guardar (en un lugar privado, **no en git**):
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` → solo n8n
   - `SUPABASE_ANON_KEY` → dashboard (cuando lean datos live)

---

## 2. n8n en Coolify (ya montado)

**Environment** del servicio n8n:

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
OPENAI_API_KEY=sk-...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

**Workflows:** importar desde `apps/n8n-workflows/`, activar en **Production**.

| Workflow | Webhook path | URL |
|----------|--------------|-----|
| task-capture | `twilio-whatsapp-task-capture` | `https://<tu-n8n>/webhook/twilio-whatsapp-task-capture` |
| meeting-capture *(cuando exista)* | `meeting-capture` | `https://<tu-n8n>/webhook/meeting-capture` |

Requisitos: **HTTPS público**, servicio siempre encendido. Reiniciar n8n tras cambiar env vars.

---

## 3. Twilio Sandbox

1. Unir el teléfono de demo al sandbox (`join <código>`).
2. **When a message comes in** → `POST` a la URL de task-capture (arriba).
3. Probar: mensaje 1:1 al bot → ejecución en n8n + fila en `inbound_messages`.

---

## 4. Dashboard en Coolify

Nueva app apuntando a `apps/dashboard-web`:

| Campo | Valor |
|-------|--------|
| Build | `bun install && bun run build` |
| Start | `bun run start` |
| Port | `3000` |

**Env (cuando cableen Supabase + reuniones):**

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
N8N_MEETING_WEBHOOK_URL=https://<tu-n8n>/webhook/meeting-capture
```

Hoy el dashboard usa mock data: deploy igual sirve para la UI del demo.

---

## 5. Smoke checklist

```text
[ ] Supabase: tablas + seeds OK
[ ] n8n: env vars + workflows activos
[ ] Twilio → n8n: mensaje WA → inbound_messages
[ ] Dashboard HTTPS accesible
[ ] (listo) tarea en /dashboard tras captura
[ ] (listo) transcript en /meetings → tareas
```

---

## Notas

- **Secrets:** n8n env + Coolify env del dashboard. Nunca en el repo.
- **Supabase Free:** se pausa tras ~1 semana sin uso; reactivar antes del demo.
- **Latencia:** el cuello de botella es el LLM, no n8n vs un API custom.
- Detalle de canal 1:1 y transcripciones Meet/Zoom: [`../product/channel-and-transcripts.md`](../product/channel-and-transcripts.md).
