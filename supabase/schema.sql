-- Progress Dashboard: database schema
-- Run this once in Supabase: SQL Editor > New query > paste > Run.
-- Safe to run again; it only creates what is missing.

-- 1. Tables ---------------------------------------------------------------

create table if not exists public.projects (
  id          text primary key default gen_random_uuid()::text,
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name        text not null,
  area        text not null default 'work' check (area in ('work', 'personal')),
  color       text not null default 'c1',
  archived    boolean not null default false,
  example     boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  updated_by  text not null default 'app'
);

create table if not exists public.tasks (
  id          text primary key default gen_random_uuid()::text,
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title       text not null,
  area        text not null default 'work' check (area in ('work', 'personal')),
  project_id  text,
  status      text not null default 'todo' check (status in ('todo', 'doing', 'blocked', 'done')),
  priority    smallint not null default 0 check (priority between 0 and 2),   -- 0 Normal, 1 High, 2 Urgent
  due         date,
  pct         smallint not null default 0 check (pct between 0 and 100),
  notes       text not null default '',
  subtasks    jsonb not null default '[]'::jsonb,                              -- [{"t": "text", "done": false}]
  log         jsonb not null default '[]'::jsonb,                              -- [{"d": "2026-11-02", "at": "...", "text": "..."}]
  focus_date  date,                                                            -- the day this task was picked for Today's Priority
  create_date date,
  done_date   date,
  touch_date  date,
  example     boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  updated_by  text not null default 'app'                                      -- who changed it last: app, claude, codex, hermes, import
);
create index if not exists tasks_user_status_idx on public.tasks (user_id, status);
create index if not exists tasks_user_project_idx on public.tasks (user_id, project_id);

create table if not exists public.checkins (
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  date        date not null,
  body        smallint check (body between 1 and 5),
  mind        smallint check (mind between 1 and 5),
  mode        text check (mode in ('push', 'standard', 'maintain', 'relax')),
  note        text not null default '',
  wrap        text not null default '',
  checked_at  timestamptz not null default now(),
  example     boolean not null default false,
  updated_at  timestamptz not null default now(),
  updated_by  text not null default 'app',
  primary key (user_id, date)
);

-- 2. Keep updated_at honest -----------------------------------------------

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists touch_projects on public.projects;
create trigger touch_projects before update on public.projects for each row execute function public.touch_updated_at();
drop trigger if exists touch_tasks on public.tasks;
create trigger touch_tasks before update on public.tasks for each row execute function public.touch_updated_at();
drop trigger if exists touch_checkins on public.checkins;
create trigger touch_checkins before update on public.checkins for each row execute function public.touch_updated_at();

-- 3. Privacy: each signed-in user can only see and change their own rows ----

alter table public.projects enable row level security;
alter table public.tasks    enable row level security;
alter table public.checkins enable row level security;

drop policy if exists "own projects" on public.projects;
create policy "own projects" on public.projects for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists "own tasks" on public.tasks;
create policy "own tasks" on public.tasks for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists "own checkins" on public.checkins;
create policy "own checkins" on public.checkins for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- 3b. Permissions on the tables (separate from the row rules above) --------
-- Newer Supabase projects do not hand these out automatically. Signed-in users get what the app needs;
-- strangers (the anon role) get nothing; the server-side key used by the AI gateway gets full access.

grant usage on schema public to anon, authenticated, service_role;
revoke all on public.projects, public.tasks, public.checkins from anon;
grant select, insert, update, delete on public.projects, public.tasks, public.checkins to authenticated;
grant all on public.projects, public.tasks, public.checkins to service_role;

-- 4. Live updates: the app refreshes when an AI changes something ----------

do $$
begin
  begin alter publication supabase_realtime add table public.tasks;    exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.projects; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.checkins; exception when duplicate_object then null; end;
end $$;
