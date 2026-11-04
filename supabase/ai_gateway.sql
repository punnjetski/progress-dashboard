-- Progress Dashboard: AI gateway tokens
-- Run once in Supabase SQL Editor (after schema.sql). Safe to run again.
--
-- Each AI assistant (claude, codex, hermes, chatgpt) gets its OWN token.
-- Only a hash of the token is stored. The token itself is shown once, when you create it.

create table if not exists public.ai_tokens (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null check (name ~ '^[a-z0-9_-]{2,24}$'),   -- shows up as "updated_by" on every change
  token_hash    text not null unique,
  can_write     boolean not null default true,                       -- false = read-only token
  created_at    timestamptz not null default now(),
  last_used_at  timestamptz,
  revoked_at    timestamptz
);

-- Locked down: no policies, no grants. Only the server-side gateway can read this table.
alter table public.ai_tokens enable row level security;
revoke all on public.ai_tokens from anon, authenticated;
grant all on public.ai_tokens to service_role;   -- the gateway's server-side key

-- Trash: when an AI deletes a task, a copy is kept here so it can be restored. Gateway-only, like ai_tokens.
create table if not exists public.deleted_tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  task_id     text not null,
  data        jsonb not null,
  deleted_at  timestamptz not null default now(),
  deleted_by  text not null default 'app'
);
create index if not exists deleted_tasks_user_idx on public.deleted_tasks (user_id, task_id);
alter table public.deleted_tasks enable row level security;
revoke all on public.deleted_tasks from anon, authenticated;
grant all on public.deleted_tasks to service_role;

create or replace function public.create_ai_token(p_name text, p_can_write boolean default true)
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  tok text;
  uid uuid;
begin
  select id into uid from auth.users order by created_at limit 1;
  if uid is null then raise exception 'Create your user first (Authentication > Users).'; end if;
  tok := 'pd_' || encode(extensions.gen_random_bytes(24), 'hex');
  insert into public.ai_tokens (user_id, name, token_hash, can_write)
  values (uid, lower(p_name), encode(extensions.digest(tok, 'sha256'), 'hex'), p_can_write);
  return tok;
end $$;

-- Nobody can call this from the web. Only you, from the SQL Editor.
revoke all on function public.create_ai_token(text, boolean) from public, anon, authenticated;

-- ------------------------------------------------------------------
-- HOW TO USE (run these one at a time, not all together):
--
--   Create a read/write token:   select public.create_ai_token('codex');
--   Create a read-only token:    select public.create_ai_token('chatgpt', false);
--      -> copy the value that appears in Results. It is shown only once.
--
--   See your tokens:             select name, can_write, created_at, last_used_at, revoked_at from public.ai_tokens;
--   Switch one off:              update public.ai_tokens set revoked_at = now() where name = 'codex' and revoked_at is null;
-- ------------------------------------------------------------------
