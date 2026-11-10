---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief: Progress Dashboard (all pages)

Scope and mode: Operate. A signed-in task tracker used several times a day on laptop and phone. Pages: Dashboard, Company, Personal, New Task, Settings.

Audience, job, task: one owner running company and personal work; sees what matters today, how the week is going, adds and ticks tasks in seconds. AI secretaries change the same data, so the screen updates live.

Constraints: single static index.html, vanilla JS, Supabase data layer, CSP intact. English UI. Light, dark and auto; a user-selectable accent gem (Ruby default, Sapphire, Emerald, Amethyst, Topaz). Every task needs a deadline.

## Direction contract

THESIS: Quiet luxury as the cabin of a fine car at night: dark grey and ivory surfaces, with one gemstone accent that appears as ambient light along edges, never as decoration over content. Refuses the flat grey task-app default and glitter.

OWN-WORLD: Dark grey ground (#1D1F23 dark, ivory #F6F2E7 light), warm ivory text, one accent gem chosen by the owner (ruby #C8102E family default). The accent is used as thin light: a slowly travelling highlight around card edges, a light strip along the rail, a soft drifting wash behind the page, and filled controls. Marcellus for headings, Manrope for everything operable. Priority colour is separate from the accent (grey, amber, signal orange). Motion is a setting: off, subtle, full.

STORY: The owner opens the app and sees Today's Priority, this week's percentage and what needs handling, and the readiness check-in, nothing else. Company and Personal are the working lists; New Task starts from the big work (category), then the task, with a mandatory deadline; Settings holds the rest.

FIRST VIEWPORT: Desktop: 248px dark rail with the five pages and a light strip on its edge; main area greeting "Hi, Punn" with date, a wide Today's Priority card (star-picked rows with Done at the end) beside a 360px column holding Week Progress (large percentage, thread bar, tasks to handle) and the Readiness check-in (sliding 1-5 selectors for body and mind, four modes). Phone: single column, bottom tab bar, New Task as the raised centre tab.

FORM: Established-world extension chosen by the owner from a roll of four directions; ambient-light Dark grey and Ivory with selectable gem accent, seed: seed:98e6628c8ad5fe41 (assigned Flower Market was set aside by the owner after trying seven colour worlds; the direction is the owner's pinned choice).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
