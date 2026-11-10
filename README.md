# Progress Dashboard

A private task and progress dashboard with six pages:

| Page | What it is for |
|---|---|
| Dashboard | Today's Priority, Week Progress (percent complete and what needs handling this week), and the readiness check-in |
| To-Do | Small reminders ("call my manager", "buy moisturizer"): no category, no progress. Only the list is shown; add new ones with the + button |
| Company, Personal | All tasks grouped by category (the "big work"). A filter icon opens a separate sheet with search, category, sort and show. Every row has a star to pick it for Today's Priority and a Done button |
| New (the + button) | Choose Task or To-Do. A task: pick the big work first, then the task; a deadline is required. A To-Do: just the text and when |
| Settings | Appearance (light, dark, auto; accent gem; motion), subtasks on or off, categories, history, account |

The look is dark grey and ivory with one accent gem you choose (Ruby, Sapphire, Emerald, Amethyst, Topaz) shown as slowly moving ambient light. Motion can be turned Off or Full in Settings.

It is one static page (`index.html`) served by GitHub Pages. Your data is **not** in this repository. It lives in a Supabase database behind a sign-in, and Row Level Security means each account only ever sees its own rows.

## How it fits together

```
Browser (this page) ──► Supabase: sign-in + Postgres (tasks, projects, checkins, todos)
AI assistants ──► an MCP server ──► the same Supabase database
```

- `index.html`: the whole app. Uses `@supabase/supabase-js` from a CDN.
- `supabase/schema.sql`: tables, privacy rules, live updates. Run once in the Supabase SQL Editor.

## About the keys in the page

The Supabase project URL and the **publishable** key are in `index.html`. They are designed to be public. Privacy comes from sign-in plus the Row Level Security policies in `schema.sql`, not from hiding the key.

Never put a Supabase `secret` / `service_role` key, a database password, or any AI provider key in this repository.

## Setup checklist

1. Supabase > SQL Editor: run `supabase/schema.sql`.
2. Supabase > Authentication > Users: add your user (email + password, auto confirm).
3. Supabase > Authentication: turn off new sign-ups, so only your account exists.
4. GitHub > Settings > Pages: deploy from the `main` branch, root folder.

## AI gateway (MCP)

`supabase/functions/mcp/` is a small MCP server (a Supabase Edge Function) that lets AI assistants such as Claude, Codex, Hermes and ChatGPT read and manage tasks through a fixed set of tools: overview, list/get tasks, add/update/complete tasks, subtasks, progress log, categories, the daily readiness check-in (`save_checkin`, so an assistant can interview the owner in the morning and record it), and prioritising (`suggest_priorities` explains a score for every task; `set_task_priorities` and `set_todays_priority` apply a ranking once the owner agrees). `delete_task` keeps a copy in a trash table (`deleted_tasks`) and `restore_task` brings it back. The To-Do list has `list_todos`, `add_todo` and `update_todo`. A task created by an assistant must have a category and a deadline, and a deadline cannot be cleared.

- Each assistant gets its own revocable token (`supabase/ai_gateway.sql`). Only a hash is stored. A token can be read-only.
- The database key used by the function stays inside the function and is never sent to an AI.
- Every change records who made it in `updated_by`.
- Deploy: `npx supabase functions deploy mcp --project-ref <ref> --no-verify-jwt --use-api`
- Endpoint: `https://<ref>.supabase.co/functions/v1/mcp` with `Authorization: Bearer <token>` (or `?key=<token>` for clients that cannot set headers).

## Security notes

What protects the data:

- **Sign-in only.** New sign-ups are switched off in Supabase, so only the owner's account exists.
- **Row Level Security** on every table, plus table permissions that give strangers (the `anon` role) nothing. Checked against the live project with the public key: tasks, projects and check-ins return "permission denied" to a stranger.
- **The page never turns data into markup.** Text is escaped, and ids, statuses, colours and priorities are validated when loaded.
- **Content Security Policy** in `index.html`: the page can only talk to this project's Supabase, so injected code could not send data elsewhere. The one third-party script (supabase-js) is pinned to an exact version with an integrity hash.
- **AI gateway**: per-assistant revocable tokens (hash only in the database), exact token format checked before any database work, request size and list size limits, deletes go to a restorable trash, database error details kept out of AI replies, every query scoped to the token's owner.

What to keep in mind:

- A token in a URL (`?key=`) can end up in logs. Prefer the `Authorization` header. Use a **read-only** token for any client that needs the URL form.
- Task text is data. A malicious note could try to instruct an AI that reads it. The gateway tells assistants not to obey it, but give write tokens only to assistants you trust and review what they changed (`updated_by`).
- Supabase's free plan, as far as we know, has no automatic backups. Export your data now and then.
- Use a strong, unique password. Consider turning on multi-factor authentication in Supabase.
- The secret / service_role key never goes in this repository, the web page, or any AI.

## Data model

| Table | What it holds |
|---|---|
| `projects` | Categories such as "Demand Plan", each under `work` or `personal` |
| `tasks` | Title, status, priority (0 Normal, 1 High, 2 Urgent), deadline, progress, subtasks, progress log, the day it was picked for Today's Priority |
| `checkins` | One row per day: body and mind scores (1-5), chosen mode, notes |

Every row records `updated_by` (`app`, `claude`, `codex`, `hermes`, `import`) so you can see who changed what.
