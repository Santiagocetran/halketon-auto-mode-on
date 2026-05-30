# n8n Workflows

These files are reference workflow definitions for the hackathon MVP. They are intentionally small and may need credential IDs updated after import.

## Workflows

- `task-capture.workflow.json`: receives Twilio WhatsApp webhook, extracts a task, saves it, and replies.
- `reminder-engine.workflow.json`: scheduled query for overdue tasks and reminder send.

## Required Environment Values

- `OPENAI_API_KEY` or the selected model provider API key.
- `SUPABASE_URL`.
- `SUPABASE_SERVICE_ROLE_KEY`.
- `TWILIO_ACCOUNT_SID`.
- `TWILIO_AUTH_TOKEN`.
- `TWILIO_WHATSAPP_FROM`.

