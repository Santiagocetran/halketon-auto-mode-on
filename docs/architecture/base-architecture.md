# Base Architecture

## System Shape

```mermaid
flowchart TD
  WA["WhatsApp / Twilio Sandbox"] --> N8N["n8n Webhook"]
  N8N --> LLM["LLM Task Extraction"]
  LLM --> DB[("Supabase / PostgreSQL")]
  DB --> WEB["Next.js Dashboard"]
  N8N --> TWILIO["WhatsApp Response"]
  TWILIO --> WA
```

## Components

### Twilio WhatsApp Sandbox

Fastest WhatsApp path for the hackathon.

Responsibilities:

- Receive 1:1 WhatsApp messages.
- Forward message body and sender metadata to n8n.
- Send confirmations and reminders.

Tradeoff:

- No true WhatsApp group automation in the MVP.

### n8n

Orchestration only. n8n is not the business backend.

Responsibilities:

- Receive Twilio webhooks.
- Call LLM extraction.
- Validate strict JSON shape.
- Insert and update Supabase records.
- Send confirmations and reminders.

### LLM Layer

Responsibilities:

- Extract structured tasks from WhatsApp messages.
- Extract meeting summaries and commitments from transcripts.
- Return strict JSON only.
- Include confidence score and ambiguity flags.

### Supabase / Postgres

Source of truth for the MVP.

Tables:

- `people`
- `tasks`
- `meetings`
- `meeting_tasks`
- `reminders`
- `inbound_messages`

### Next.js Dashboard

Read-optimized interface for leadership.

Pages:

- `/dashboard`
- `/tasks`
- `/meetings`

The dashboard starts with mock data and can be switched to Supabase reads once the database is provisioned.

## Data Flow Boundaries

Task capture:

```mermaid
sequenceDiagram
  participant User
  participant WhatsApp
  participant n8n
  participant LLM
  participant DB
  participant Dashboard
  User->>WhatsApp: Yo hago el informe para el viernes
  WhatsApp->>n8n: Twilio webhook
  n8n->>LLM: Extract task
  LLM-->>n8n: Strict JSON
  n8n->>DB: Insert task
  n8n->>WhatsApp: Confirmation
  DB->>Dashboard: Query task state
```

Meeting capture:

```mermaid
sequenceDiagram
  participant User
  participant Dashboard
  participant LLM
  participant DB
  participant WhatsApp
  User->>Dashboard: Paste transcript
  Dashboard->>LLM: Extract commitments
  LLM-->>Dashboard: Summary and tasks
  Dashboard->>DB: Insert meeting and tasks
  Dashboard->>WhatsApp: Optional assignee notification
```

Reminder update:

```mermaid
sequenceDiagram
  participant Scheduler
  participant n8n
  participant DB
  participant WhatsApp
  participant User
  Scheduler->>n8n: Scheduled run
  n8n->>DB: Fetch overdue tasks
  n8n->>WhatsApp: Reminder
  User->>WhatsApp: done / in_progress / blocked
  WhatsApp->>n8n: Webhook
  n8n->>DB: Update status
```

## Security Defaults

- Store original source messages for traceability.
- Do not expose sender phone numbers in aggregate dashboard views unless needed.
- Treat message bodies as sensitive operational data.
- Keep LLM prompts deterministic and schema-bound.
- Separate raw inbound messages from normalized tasks.

