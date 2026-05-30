# Halketon - WhatsApp-first Operational Memory

MVP for Halketon Track 1: coordination and internal memory for NGOs.

The product is not a replacement for WhatsApp or a full project management suite. It is an operational memory layer that converts everyday WhatsApp messages, meeting transcripts, and reminders into structured tasks that leadership can review.

## Demo Narrative

1. A team member sends a WhatsApp message such as: `Yo hago el informe para el viernes`.
2. n8n receives the Twilio webhook and calls the task extraction prompt.
3. The LLM returns strict JSON with owner, task, due date, status, priority, and confidence.
4. Supabase stores the task.
5. The dashboard shows open work, overdue work, owners, and upcoming deadlines.
6. n8n sends reminders and updates task status from quick replies.

## Repository Map

```text
apps/
  dashboard-web/       Next.js dashboard for leadership visibility
  n8n-workflows/       Importable/reference workflow definitions
database/
  schema.sql           Supabase/Postgres schema
  seeds.sql            Demo data
docs/
  architecture/        System architecture and technical boundaries
  decisions/           Architecture decision records
  diagrams/            Mermaid flow docs
  product/             MVP scope and product thesis
prompts/
  meeting-summary.md   Strict JSON meeting commitment extraction
  task-extraction.md   Strict JSON WhatsApp task extraction
```

## Local Dashboard

```bash
cd apps/dashboard-web
npm install
npm run dev
```

Open `http://localhost:3000`.

The initial dashboard uses local mock data so the UI can be validated before Supabase and n8n are wired.

## MVP Boundaries

In scope:

- 1:1 WhatsApp capture through Twilio Sandbox.
- Natural-language task extraction.
- Meeting transcript to task extraction.
- Reminder status updates with quick replies.
- Simple leadership dashboard.

Out of scope:

- WhatsApp group automation.
- Full project management replacement.
- CRM/fundraising workflows.
- Complex auth, roles, permissions, and multi-tenant setup.
- Enterprise integrations.

## Success Criteria

At demo time, the team should show:

- A WhatsApp message creates a structured task.
- The dashboard updates with task owner, deadline, and status.
- Overdue and upcoming tasks are visible.
- A reminder can update a task state.
- A meeting transcript creates multiple tasks.

