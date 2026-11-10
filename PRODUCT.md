# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Existing: one static `index.html` (vanilla JS, no build step) served by GitHub Pages; Supabase (Auth, Postgres, Realtime) via supabase-js from a CDN. Stays a single static file.

## Users
One person, the owner (Punn), who runs company work and personal projects at once and used to track everything in a paper notebook. Uses the app on a laptop and on a phone about equally, several times a day: a quick look in the morning, ticking and adding tasks during the day. Not a developer.

AI assistants (Claude, ChatGPT, Codex) act as secretaries over a separate MCP gateway: they read, add and edit the same tasks. The app must show their changes live.

## Product Purpose
A progress tracker that shows all the owner's work in hand and helps them decide what to do today. Success: at a glance they see what matters today, how the week is going, and which tasks need handling, and adding or updating a task takes a few seconds.

## Positioning
Replaces the paper notebook with one place for Company and Personal work, kept in sync with AI secretaries that can add and update tasks by voice or text.

## Operating Context
- Structure: Area (Company or Personal) > Category (the "big work", e.g. Demand Plan) > Task > optional subtasks. Every task lives under a category and must have a deadline.
- Daily rhythm: morning readiness check-in (body and mind 1-5, mode Push / Standard / Maintain / Relax; the mode is a reflection, never a limit on how many tasks to take), then work from Today's Priority.
- Pages: Dashboard (Today's Priority, Week Progress, Readiness check-in), Company, Personal, New Task, Settings (subtasks on/off, History, Categories, theme, sign out).
- Sign-in required; data in Supabase; light, dark and auto theme.

## Capabilities and Constraints
- UI language is English. Greeting is "Hi, Punn", never time-of-day greetings.
- Priority levels Normal / High / Urgent; statuses todo / doing / blocked / done.
- Every task row offers a pick button for Today's Priority; the left checkbox no longer means anything else. Done is a separate action at the end of the row.
- Week Progress is shown briefly: percent complete plus the tasks that need handling this week.
- Data layer, auth, realtime sync, input validation and the CSP stay intact.
- Existing tasks migrated without a deadline are not blocked from loading, but cannot be saved again without one.

## Brand Commitments
Name: Progress Dashboard. Tone: quiet luxury that is still inspiring; the owner finds the current look flat and bland and wants more colour and life without losing calm.

## Evidence on Hand
Real task data lives only in the owner's Supabase project; nothing in this repository is real task data. Mock data for tests is generic.

## Product Principles
1. Usability first: seeing and managing the tasks in hand beats everything else.
2. Today's Priority is the owner's choice; the app suggests, never limits.
3. One structure everywhere: big work, then tasks, then subtasks, always with a deadline.
4. AI secretaries are first-class: changes they make appear instantly and are attributable.
5. Calm by default, not bland: colour carries meaning (priority, area, progress) and delight.

## Accessibility & Inclusion
Readable contrast in light and dark; touch targets usable on a phone; works at laptop and phone widths.
