# 0002. Canal WhatsApp 1:1 (no grupo)

**Fecha:** 2026-06-05  
**Estado:** Aceptado  
**Decisor(es):** Equipo Halketon (hackathon)

## Contexto

La idea original era un bot que capturaba compromisos desde el **chat grupal** de WhatsApp
donde los equipos de ONG ya coordinan. Al implementar con Twilio Sandbox descubrimos que
solo permite interacción **1:1** con el número del sandbox — no hay automatización en grupos.

Opciones consideradas:

- **Seguir con la visión grupal** — bloqueado por Twilio Sandbox; requeriría otro proveedor
  y más tiempo de integración.
- **Canal 1:1 al bot** — viable hoy; cambia el hábito de captura pero simplifica identidad
  del dueño y recordatorios.
- **Posponer WhatsApp y demo solo con reuniones** — pierde el hero use case del Track 1.

## Decisión

Adoptar **captura y recordatorios por WhatsApp 1:1** para el MVP:

- Cada integrante escribe compromisos **directamente al bot** (chat privado con el número del sandbox).
- Los recordatorios y las respuestas de estado (`done` / `in_progress` / `blocked`) son **1:1**.
- El flujo **reuniones → tareas** gana peso para compensar la pérdida de captura pasiva en grupo.
- Automatización en grupos queda **fuera de scope** del hackathon.

## Consecuencias

**Positivas:**

- Compatible con Twilio Sandbox sin workarounds.
- Identidad del remitente clara (`From` → persona).
- Recordatorios privados, menos ruido en el equipo.
- Webhook y lógica de n8n más simples.

**Negativas:**

- Requiere un micro-hábito nuevo: escribir al bot cuando se cierra un compromiso.
- No captura el contexto del hilo grupal.
- La coordinación informal en el grupo sigue siendo invisible hasta que alguien registre.

**Técnicas:**

- Sin cambios al schema: `inbound_messages.sender_phone` ya modela 1:1.
- Documentación de producto y demo script deben hablar de **canal directo**, no de bot en grupo.

## Referencias

- [ADR 0001](./0001-mvp-stack.md) — stack Twilio + n8n
- [`../product/channel-and-transcripts.md`](../product/channel-and-transcripts.md) — modelo de canal y paths de transcripción
- [`../product/working-notes.md`](../product/working-notes.md) — brainstorm original (actualizado)

## Notas

Si más adelante la ONG piloto necesita grupos, evaluar WhatsApp Business / Meta Cloud API con
un proveedor que soporte el caso de uso — no es extensión directa del sandbox actual.
