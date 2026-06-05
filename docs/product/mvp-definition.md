# MVP Definition

## Product Thesis

NGOs do not fail because they lack tools. They fail because each new tool adds friction, setup, training, and process overhead. The system must live on top of the channel they already use: WhatsApp.

Halketon is a WhatsApp-first operational memory layer. It captures commitments when team members **message the bot in a private 1:1 chat** (Twilio Sandbox) or when a coordinator **pastes a meeting transcript**, structures them with an LLM, stores them in Postgres, and gives leadership a simple view of load, deadlines, and follow-up risk.

> Channel model and Meet/Zoom transcript paths: [`channel-and-transcripts.md`](channel-and-transcripts.md) · [ADR 0002](../decisions/0002-whatsapp-1-1-channel.md).

## Primary User

The primary user is an overloaded NGO operator or coordinator who already coordinates work through WhatsApp and meetings.

The secondary user is a director or team lead who needs visibility into:

- Open tasks.
- Overdue commitments.
- Owners with high load.
- Tasks without clear ownership.
- Upcoming deadlines.

## Hero Use Case

Input:

```text
Yo me encargo del informe para el viernes
```

Structured output:

```json
{
  "intent": "task_creation",
  "owner": "Mateo",
  "task": "Preparar informe",
  "due_date": "2026-06-12",
  "status": "pending",
  "priority": "normal",
  "confidence": 0.94
}
```

Immediate response:

```text
Registre: Informe - viernes. Confirmas?
```

## Features

### WhatsApp Task Capture (1:1)

Converts natural-language WhatsApp messages into structured tasks. Each team member writes **directly to the bot** in a private chat — not in a group thread. The team keeps coordinating in their usual WhatsApp groups; registration happens when someone closes a commitment.

Supported in the first MVP:

- Short text messages to the Twilio Sandbox number (1:1 only).
- Short voice-note transcript text once transcription is available.
- Clear sender identity via phone number (`From` → owner).

Not in scope: passive capture from WhatsApp groups (Twilio Sandbox limitation).

### Meeting Memory

Converts a transcript into a summary plus a list of commitments. Compensates for the lack of group capture by batching many commitments from one meeting.

Supported in the first MVP:

- Paste transcript in the dashboard (coordinator copies from Meet/Zoom export or uses demo text).
- Extract owner, task, due date, and priority.
- Store resulting tasks.

How to obtain transcripts (manual export today; Zoom webhook later): see [`channel-and-transcripts.md`](channel-and-transcripts.md).

### Reminder Engine

Sends follow-up messages for overdue or soon-due tasks.

Supported replies:

- `done`
- `in_progress`
- `blocked`

### Team Visibility Dashboard

Shows leadership the operational picture:

- Open task count.
- Overdue task count.
- Load by person.
- Deadlines this week.
- Tasks without owner.

## Non-goals

- Replacing WhatsApp.
- WhatsApp **group** bot automation (deferred — see ADR 0002).
- Replacing Asana, Jira, Trello, Notion, or Slack.
- Building a full CRM.
- Solving donations or fundraising.
- Complex permissions and organization management.
- Multi-tenant SaaS.
- Automatic Meet/Zoom transcript ingestion (MVP uses paste; automation is backlog).

## Demo Script

1. **Meeting (optional opener):** paste a transcript on `/meetings` → show multiple tasks extracted.
2. Send a **private** WhatsApp message to the Twilio Sandbox number (1:1, not in a group).
3. Show n8n receiving the webhook.
4. Show strict JSON returned by the LLM.
5. Show the task in Supabase.
6. Open the dashboard and show the task by owner and deadline.
7. Trigger a reminder workflow (delivered 1:1 to the assignee).
8. Reply with a quick status and show the dashboard update.

Narrative: *"They keep using WhatsApp as always. When someone commits, they message the bot. Leadership sees the load; the bot follows up privately."*

