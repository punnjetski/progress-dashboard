---
name: Progress Dashboard
description: A dark grey and ivory task cabin lit by one owner-chosen gem accent that runs along edges as ambient light.
colors:
  night-ground: "#1D1F23"
  night-surface: "#272A30"
  night-surface-raised: "#2F333A"
  night-ink: "#F4EFE0"
  night-ink-2: "#CFCBBE"
  night-ink-3: "#A6A399"
  night-line: "#383C44"
  night-line-strong: "#4B505A"
  night-control: "#7C8088"
  rail-night: "#141619"
  ivory-ground: "#F6F2E7"
  ivory-surface: "#FFFEF9"
  ivory-surface-raised: "#EFEADB"
  graphite-ink: "#23262B"
  graphite-ink-2: "#464A52"
  graphite-ink-3: "#62666E"
  ivory-line: "#E2DCCB"
  ivory-line-strong: "#CFC8B4"
  ivory-control: "#8A8678"
  rail-graphite: "#2B2E33"
  rail-ink: "#F3EEDF"
  ruby-deep: "#A50E28"
  ruby-mid: "#C8102E"
  ruby-bright: "#F04A68"
  ruby-deep-night: "#B30F2E"
  ruby-mid-night: "#D4153A"
  ruby-bright-night: "#FF5C7A"
  priority-neutral: "#5A5E66"
  priority-amber: "#8A4D00"
  priority-signal: "#AE3206"
  priority-neutral-night: "#B9B5AA"
  priority-amber-night: "#F0B04A"
  priority-signal-night: "#FF8E60"
  ok: "#1B7550"
  ok-night: "#5CC9A0"
  bad-fill: "#BD3908"
  bad-fill-night: "#B93A08"
typography:
  display:
    fontFamily: "Marcellus, IBM Plex Sans Thai, Georgia, serif"
    fontSize: "44px"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "0"
  headline:
    fontFamily: "Marcellus, IBM Plex Sans Thai, Georgia, serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.12
  title:
    fontFamily: "Manrope, IBM Plex Sans Thai, system-ui, sans-serif"
    fontSize: "15.5px"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Manrope, IBM Plex Sans Thai, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Manrope, IBM Plex Sans Thai, system-ui, sans-serif"
    fontSize: "12.5px"
    fontWeight: 800
    lineHeight: 1.3
rounded:
  control: "10px"
  card: "16px"
  pill: "99px"
  round: "50%"
spacing:
  xs: "8px"
  sm: "12px"
  md: "22px"
  card-pad: "22px 24px"
components:
  button-primary:
    backgroundColor: "{colors.ruby-mid}"
    textColor: "#FFFFFF"
    rounded: "{rounded.control}"
    padding: "10px 18px"
  button-default:
    backgroundColor: "{colors.ivory-surface-raised}"
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.control}"
    padding: "10px 18px"
  button-danger:
    backgroundColor: "{colors.bad-fill}"
    textColor: "#FFFFFF"
    rounded: "{rounded.control}"
  card:
    backgroundColor: "{colors.ivory-surface}"
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.card}"
    padding: "22px 24px"
  card-night:
    backgroundColor: "{colors.night-surface}"
    textColor: "{colors.night-ink}"
    rounded: "{rounded.card}"
  chip:
    backgroundColor: "{colors.ivory-surface}"
    textColor: "{colors.graphite-ink-2}"
    rounded: "{rounded.pill}"
    padding: "8px 15px"
  pill:
    backgroundColor: "{colors.ivory-surface-raised}"
    textColor: "{colors.graphite-ink-2}"
    rounded: "{rounded.pill}"
    padding: "4px 11px"
  input:
    backgroundColor: "{colors.ivory-surface}"
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.control}"
    padding: "11px 14px"
  rail:
    backgroundColor: "{colors.rail-graphite}"
    textColor: "{colors.rail-ink}"
    width: "248px"
  tile:
    backgroundColor: "{colors.ivory-surface-raised}"
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.control}"
    padding: "14px"
  toast:
    backgroundColor: "{colors.graphite-ink}"
    textColor: "{colors.ivory-ground}"
    rounded: "{rounded.pill}"
    padding: "12px 18px"
---

# Design System: Progress Dashboard

## Overview

**Creative North Star: "The Night Cabin"**

A signed-in task tracker used several times a day by one owner, built like the cabin of a fine car at night: dark grey and ivory surfaces, warm ivory text, and a single gemstone accent that shows up as thin light along edges rather than as decoration over content. The owner picks the gem (Ruby by default, Sapphire, Emerald, Amethyst, Topaz); everything accent-coloured follows it. Light and dark are both first-class (ivory ground `#F6F2E7`, grey ground `#1D1F23`), as is a system mode.

Density is calm and operational. Content sits on flat, softly lifted cards; the light does the atmosphere: a conic edge highlight travelling around lit cards, a light strip on the rail edge, a faint drifting wash behind the page, a slow pulse of glow, and a sheen along progress threads. Motion is a setting (Off, Subtle 9s, Full 4s) and defaults to Off when the device asks for reduced motion.

**Key Characteristics:**
- Dark grey and ivory ground; accent only as light, thin fills and focus.
- One owner-selected gem, three tokens per gem (deep, mid, bright) in each mode.
- Priority colour (neutral, amber, signal orange) is a separate channel from the accent.
- Marcellus for headings and large numerals; Manrope for everything operable.
- Springy micro-interactions on every control; all of it switches off with Motion Off.

## Colors

Warm ivory and graphite neutrals with one saturated gem. Values below are the default Ruby; the gem tokens swap per `data-accent`.

### Primary (gem accent, owner-selectable)
- **Gem Deep** (`ruby-deep` #A50E28 light / `ruby-deep-night` #B30F2E dark): start of every filled gradient, the lit-edge body of the travelling light, the focus ring and accent text in light mode.
- **Gem Mid** (`ruby-mid` #C8102E light / `ruby-mid-night` #D4153A dark): end of filled gradients (primary button, segmented thumb, active nav, selected chip, ticks), glows and shadows under filled controls.
- **Gem Bright** (`ruby-bright` #F04A68 light / `ruby-bright-night` #FF5C7A dark): the light itself: rail strip, page-header underline, card border tint, progress thread, pips, hover borders. In dark mode it is also the accent text and focus ring.
- Alternates (deep / mid / bright, light): Sapphire #0B3BC2 / #1F57E8 / #4C8DFF; Emerald #056A47 / #08805A / #1FD39A; Amethyst #5B21B6 / #7C3AED / #B28BFF; Topaz #92400E / #B45309 / #FBA415. Dark values are set per gem in the stylesheet.

### Secondary (state and priority, never the accent)
- **Priority Neutral** (#5A5E66 / #B9B5AA night): default priority dot and pill.
- **Priority Amber** (#8A4D00 / #F0B04A night): priority 1, blocked status, due-soon.
- **Priority Signal Orange** (#AE3206 / #FF8E60 night): priority 2.
- **Done Green** (#1B7550 / #5CC9A0 night): Doing and Done status, the Done button.
- **Danger Fill** (#BD3908 light / #B93A08 night): overdue chips and destructive buttons, carrying white text.
- **Category hues** `--c1..c6` (blue, green, orange, violet, pink, slate; each with a lighter night value): category identification only.

### Neutral
- **Night Ground** (#1D1F23) with **Night Surface** (#272A30) and **Raised** (#2F333A); lines #383C44 and #4B505A; control borders #7C8088.
- **Ivory Ground** (#F6F2E7) with **Ivory Surface** (#FFFEF9) and **Raised** (#EFEADB); lines #E2DCCB and #CFC8B4; control borders #8A8678.
- **Ink** ramp: ivory #F4EFE0 / #CFCBBE / #A6A399 on night; graphite #23262B / #464A52 / #62666E on ivory.
- **Rail** (#2B2E33 light, #141619 dark) is always dark; its ink is #F3EEDF.

### Named Rules
**The Light Not Paint Rule.** The gem appears as edge light, thin lines, glows and filled controls. It is never a large flat panel behind content.
**The Two Channels Rule.** Accent means "this is the app's light or an active control". Priority and state colours (amber, signal orange, green, danger) carry meaning and never change with the gem.
**The Ring Rule.** Focus ring, input focus border and chart primary line use one colour (`--ring`: gem deep in light, gem bright in dark). Control borders use the stronger `--ctl` neutral so unfilled controls stay visible.

## Typography

**Display Font:** Marcellus (Georgia fallback; IBM Plex Sans Thai ahead of it for Thai glyphs)
**Body Font:** Manrope (IBM Plex Sans Thai, then system-ui)

**Character:** An engraved, classical serif for headings and big numerals over a clean, confident sans for everything the owner touches. Tabular numerals on the body.

### Hierarchy
- **Display** (400, clamp(32px, 4.6vw, 44px), 1.12): page titles ("Hi, Punn"); 30px on phones.
- **Headline** (400, 22px, 1.12): card headings; drawer title 22px; group headings 21px; brand 19px.
- **Numeral** (400, 34px to 40px, 1): week percentage and check-in tile values, in accent colour; mode name 28px.
- **Title** (700, 15.5px, 1.3): task titles; section headings in forms 15px.
- **Body** (400 to 600, 15px, 1.55): default; sub-task rows 14px.
- **Label** (700 to 800, 12.5px to 13.5px, normal case): field labels, pills, due chips, metadata. No uppercase labels in the system.

### Named Rules
**The Operable Sans Rule.** Anything clickable, typeable or status-bearing is Manrope. Marcellus is for headings and large numerals only.

## Layout

Desktop is a two-column shell: a sticky 248px dark rail and a fluid main area (padding clamps 16px to 48px) with the view centred at max 1180px, children stacked on a 22px gap. The dashboard and similar pages use a content column plus a 380px side column (`grid2`), collapsing to one column at 1100px. Forms cap at 720px; Settings uses a 200px section nav beside content.

At 900px and below the rail is replaced by a fixed bottom tab bar of five items (Dashboard, To-Do, New Task as a raised 46px round centre button, Company, Personal) and a top bar carrying Appearance and Settings; the Appearance popover and drawer go full width. Task rows reflow via container queries on the card itself (below 780px the cells wrap under the title), so a row adapts to the card it sits in, not the viewport. `pointer:coarse` enlarges targets (star 42px, tick 34px, check 26px, icon buttons 42px) and removes the pulse and sheen.

Rhythm: 8, 12, 14, 22px gaps; card padding 22px 24px; rows 12px vertical separated by 1px lines.

## Elevation & Depth

Hybrid: tonal layering (ground, surface, raised) plus soft, accent-tinted glow. Resting cards carry a long, low-offset shadow (`--lift`) and a glow whose radius follows the pulse (`0 0 calc(8px + 22px*var(--pulse)) -8px` in gem deep). Overlays use heavy, blurred, negative-spread shadows. There are no hard offset shadows.

### Shadow Vocabulary
- **Lift** (`0 1px 0 rgba(255,255,255,.6) inset, 0 10px 26px -18px rgba(35,38,43,.35)`; night: `.04` inset, `0 14px 30px -20px rgba(0,0,0,.7)`): resting cards.
- **Gem glow under fills** (`0 10px 22px -12px var(--gM)`): primary buttons, active nav, thumb.
- **Menu** (`0 22px 44px -18px rgba(0,0,0,.55)`), **Popover** (`0 26px 60px -20px rgba(0,0,0,.7)`), **Drawer** (`-30px 0 70px -30px rgba(0,0,0,.6)`), **Toast** (`0 18px 40px -16px rgba(0,0,0,.7)`).

### Ambient light (the signature)
- **Edge light:** `.card.lit::before` is a 2px conic-gradient ring (transparent, gem deep, light gem) rotating on `--ang`, started at a wall-clock phase (`--clock`) so redraws never restart it.
- **Rail strip:** a 3px gradient on the rail's right edge travelling top to bottom (`--ry`).
- **Wash:** `body::before`, a large radial gem-deep gradient drifting by transform only (opacity .12 light, .2 dark).
- **Pulse and sheen:** glow pulse on lit cards; sheen sweeping along progress threads inside lit cards.
- **Speed:** `--spd` is 9s (Subtle, default), 4s (Full); Off freezes each light at a fixed pose and kills all animation and transitions.

### Named Rules
**The Slow Light Rule.** Ambient light travels at 4s or slower per cycle, moves via transform or registered custom properties only, and must have a static Off pose.

## Shapes

Soft-cornered and round: cards 16px; controls, tiles, menus, rows 10px; chips, pills, toast, Done buttons, progress threads 99px; star, tick, icon buttons and swatches circular; check boxes 6px. Cards have a 1px border tinted 30% gem bright over the line colour. Segmented controls are a 13px tray with a 10px gliding thumb.

## Components

### Buttons
- **Primary:** gem deep to mid 135deg gradient, white text, 10px radius, padding 10px 18px, mid-gem glow. Small variant 7px 12px.
- **Default:** raised surface, 1px strong line, bold text. **Quiet:** transparent. **Danger:** danger fill, white text.
- **Hover:** lift 2px and scale 1.03 with a gem-bright border tint. **Active:** scale .95. **Ripple** in the light gem on press. Overshoot easing `cubic-bezier(.34,1.56,.64,1)`.
- **Focus:** 2px ring outline, 2px offset.

### Task row
- Grid: star (34px circle), title block, chips, Done. Title carries a 9px priority dot (priority colour with a 22% halo). Star on: gem gradient fill, glow follows pulse, icon rotates 72deg, pop animation on toggle. Done is a green-outlined pill that fills green on hover. Done state strikes through the title (2px) and dims the row; Finished rows at .55 opacity.
- Chips: status pill (green Doing/Done, amber Blocked), priority pill tinted 14% of its priority colour, due chip (neutral, amber warn, danger fill with white text when overdue), progress thread with percent.

### Check-in selectors and summary tiles
- Selectors are 1 to 5 segmented controls with a gliding thumb (`.seg5`). Tiles (2-column, one wide) are raised surface, 10px radius, gem-tinted border and glow; numerals in Marcellus 40px in accent; a row of six pip bars fills gem deep to bright with staggered scale-in.

### To-Do row and tick
- 34px lead column with a 28px circular tick (2px control border; checked: gem gradient with a light-gem border); text 600; done strikes through at .7 opacity; actions appear on hover or focus-within on hover-capable devices.

### Segmented control, chips and filters
- Tray with a thumb that translates by index (.38s springy ease); selected label white on the gem gradient. Filter chips are pill shaped and fill with the gem gradient when pressed.

### Accent menu and Appearance popover
- Dropdown: surface, strong line, 10px radius, menu shadow, 6px padding, opens with a short fade-and-drop. Gem swatches are 16px circles of a gem gradient with a double ring. The Appearance popover (272px, bottom-left on desktop, full-width under the top bar on phones) holds theme, a five-swatch accent grid (selected: ring border plus 35% halo) and Motion.

### Task drawer
- Right-side panel (min 540px, full width on phones) on a 58% dark scrim; slides in 40px; title is an inline Marcellus 22px input; sub-tasks with checkboxes, log entries separated by lines.

### Toast
- Pill, ink background with ground-coloured text, centred bottom (above the tab bar on phones), bold.

### Navigation
- Rail: Marcellus 19px brand with the gem mark; items 10px radius, 600 weight, nudge 4px right on hover; current page is a gem gradient with glow. Counts sit right. Look button at the bottom with a gem swatch. Tab bar mirrors it in 11px labels, current icon tinted gem bright.

### Gem mark
- A faceted diamond SVG (mid body, bright crown) with a soft drop-shadow, used as the brand mark and to mark categories; it follows the selected accent.

### Inputs
- 10px radius, strong control border, surface fill; focus swaps border to the ring colour with a 3px 28% halo. Labels 13px bold in ink-2.

## Do's and Don'ts

### Do:
- **Do** take every accent from `--gA`, `--gM`, `--gB` so the owner's gem choice carries everywhere; use deep to mid for filled controls and bright for light.
- **Do** keep priority and state colours independent of the accent.
- **Do** give every ambient or micro-interaction animation a Motion Off pose and respect `prefers-reduced-motion`.
- **Do** use Marcellus only for headings and big numerals, Manrope for everything else.
- **Do** let cards respond to their own width with container queries.
- **Do** put white text only on gem gradients and danger fills; keep unfilled control borders on `--ctl`.

### Don't:
- **Don't** paint large flat panels or text blocks in the gem colour; it is light and thin fills.
- **Don't** use the accent to signal priority, status or danger.
- **Don't** add hard offset shadows or glitter-style decoration.
- **Don't** let ambient light animate layout properties; transform and registered custom properties only.
- **Don't** keep the pulse or sheen on touch devices (`pointer:coarse`).
