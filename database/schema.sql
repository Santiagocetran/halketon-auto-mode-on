create extension if not exists pgcrypto;

create type task_status as enum (
  'pending',
  'in_progress',
  'blocked',
  'done',
  'cancelled'
);

create type task_priority as enum (
  'low',
  'normal',
  'high',
  'urgent'
);

create table people (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  whatsapp_number text unique,
  role text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table inbound_messages (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'twilio',
  provider_message_id text,
  sender_phone text,
  sender_name text,
  body text not null,
  media_url text,
  received_at timestamptz not null default now(),
  raw_payload jsonb not null default '{}'::jsonb
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references people(id) on delete set null,
  owner_name text,
  task_title text not null,
  description text,
  due_date date,
  status task_status not null default 'pending',
  priority task_priority not null default 'normal',
  source_message_id uuid references inbound_messages(id) on delete set null,
  source_type text not null default 'whatsapp',
  source_text text,
  confidence numeric(3,2) not null default 0.00 check (confidence >= 0 and confidence <= 1),
  extraction_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table meetings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  transcript text not null,
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table meeting_tasks (
  meeting_id uuid not null references meetings(id) on delete cascade,
  task_id uuid not null references tasks(id) on delete cascade,
  primary key (meeting_id, task_id)
);

create table reminders (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  scheduled_at timestamptz not null,
  sent_at timestamptz,
  response text,
  response_received_at timestamptz,
  created_at timestamptz not null default now()
);

create index tasks_status_idx on tasks(status);
create index tasks_due_date_idx on tasks(due_date);
create index tasks_owner_name_idx on tasks(owner_name);
create index reminders_scheduled_at_idx on reminders(scheduled_at) where sent_at is null;

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger people_set_updated_at
before update on people
for each row execute function set_updated_at();

create trigger tasks_set_updated_at
before update on tasks
for each row execute function set_updated_at();

create trigger meetings_set_updated_at
before update on meetings
for each row execute function set_updated_at();

