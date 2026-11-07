---
name: EggSort-AI Dashboard
description: Industrial Vision AI System for real-time egg grading and production telemetry
colors:
  teal-vision: "#059669"
  teal-vision-bright: "#10b981"
  teal-vision-deep: "#047857"
  teal-vision-cyan: "#0d9488"
  teal-vision-light: "#ecfdf5"
  teal-vision-border: "#a7f3d0"
  grade-a-success: "#10b981"
  grade-a-bg: "#ecfdf5"
  grade-a-border: "#a7f3d0"
  grade-b-info: "#3b82f6"
  grade-b-bg: "#eff6ff"
  grade-b-border: "#bfdbfe"
  grade-reject-alert: "#ef4444"
  grade-reject-bg: "#fef2f2"
  grade-reject-border: "#fecaca"
  neutral-app-bg: '#e5e9f0'
  neutral-sidebar: "#0f1c2e"
  neutral-sidebar-border: "#1e293b"
  neutral-card: "#ffffff"
  neutral-card-subtle: "#f8fafc"
  neutral-card-hover: "#f1f5f9"
  neutral-border: "#e2e8f0"
  neutral-border-subtle: "#edf2f7"
  text-title: "#0f172a"
  text-body: "#334155"
  text-muted: "#64748b"
  text-subtle: "#94a3b8"
typography:
  display:
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.85rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0em"
  body:
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0em"
  label:
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.04em"
  mono:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: "0.68rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "28px"
components:
  kpi-card:
    backgroundColor: "{colors.neutral-card}"
    textColor: "{colors.text-title}"
    rounded: "{rounded.lg}"
    padding: "18px 20px"
  kpi-card-hover:
    backgroundColor: "{colors.neutral-card}"
    textColor: "{colors.text-title}"
  status-pill:
    backgroundColor: "{colors.teal-vision-light}"
    textColor: "{colors.teal-vision}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  button-primary:
    backgroundColor: "{colors.teal-vision}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.teal-vision-deep}"
    textColor: "#ffffff"
  sidebar-nav-active:
    backgroundColor: "{colors.teal-vision-bright}"
    textColor: "#042f2e"
    rounded: "{rounded.md}"
    padding: "8px 10px"
  modal-window:
    backgroundColor: "{colors.neutral-card}"
    textColor: "{colors.text-body}"
    rounded: "{rounded.lg}"
    padding: "14px 18px"
---

# Design System: EggSort-AI Dashboard

## Overview

**Creative North Star: "The AI Vision Lab"**

EggSort-AI is a real-time industrial monitoring dashboard built for precision, density, and technical clarity. The visual language prioritizes computer vision aesthetics, scientific instrumentation patterns, and the cognitive demands of continuous production monitoring. Every interface element serves operational decision-making: KPI cards display dense telemetry without clutter, status indicators pulse with live system state, and decision surfaces present algorithm confidence scores alongside visual inspection modes. The design rejects consumer softness in favor of industrial legibility—high contrast, monospaced metrics, HUD-style overlays, and grade-coded color assignments that instantly communicate product classification.

Dark sidebar navigation grounds the interface with a command-center aesthetic. The teal accent (#059669, #10b981) ties to AI/ML visual conventions and provides a distinct, non-alarming active state across live indicators, confidence rings, and actuator status badges. Layout density scales to show 4-column KPI grids, side-by-side camera inspection panels, and scrolling scan logs without compromising readability. Typography pairs geometric humanist sans (Plus Jakarta Sans) for UI labels with technical mono (JetBrains Mono) for numeric data, IDs, and timestamps.

**Key Characteristics:**
- Technical precision over decorative flourish
- Data-dense layouts optimized for continuous monitoring
- Live-state indicators (pulse dots, status pills, real-time badges)
- Grade-coded color semantics (A = green, B = blue, Reject = red)
- HUD and reticle overlays for visual inspection modes
- Dark sidebar with vibrant teal active states

## Colors

The palette centers on **Teal Vision** (#059669 / #10b981), a technical green-cyan that signals AI processing, live monitoring, and system-active states without the alarm weight of red or the consumer friendliness of blue. Semantic grade colors map directly to SNI egg classification standards: green for Grade A, blue for Grade B, red for rejects. Neutrals span from a light cool gray app background (#f4f6fa) to a deep slate sidebar (#0f1c2e), creating spatial hierarchy between navigation chrome and active work surfaces.

### Primary
- **Teal Vision** (#059669): Primary accent for active navigation, live indicators, status pills, confidence scores, and actionable UI elements. Appears on ~15% of any screen to preserve visual authority.
- **Teal Vision Bright** (#10b981): Elevated variant for hover states, glow effects, pulsing status dots, and high-confidence score rings.
- **Teal Vision Deep** (#047857): Pressed/active button states and dark-mode primary text.
- **Teal Vision Light** (#ecfdf5): Background tint for status pills, inline badges, and success-state card backgrounds.
- **Teal Vision Border** (#a7f3d0): Stroke for status pill borders, live indicator outlines, and teal-coded UI boundaries.

### Semantic (Grade Classification)
- **Grade A Success** (#10b981): Top-tier egg classification. Used for Grade A KPI cards, decision banners, confidence rings, and pass criteria checkmarks.
- **Grade B Info** (#3b82f6): Secondary-tier classification. Blue signals acceptable but non-premium grade, distinct from both success green and alert red.
- **Grade Reject Alert** (#ef4444): Defective/failed eggs. Reserved strictly for reject-class UI: reject KPI cards, fail criteria, and alert badges.

### Neutral
- **Neutral App Background** (#f4f6fa): Main canvas background. Cool-toned light gray that reduces eye strain during extended monitoring sessions.
- **Neutral Sidebar** (#0f1c2e): Command-center dark sidebar. Anchors the left edge and creates spatial separation from content panels.
- **Neutral Card** (#ffffff): Primary surface for KPI cards, modals, data tables, and elevated content panels.
- **Neutral Card Subtle** (#f8fafc): Secondary surface for nested panels, card headers, and low-emphasis backgrounds.
- **Neutral Border** (#e2e8f0): Standard stroke for card edges, input fields, dividers, and UI boundaries.
- **Text Title** (#0f172a): High-emphasis text for card titles, modal headers, and primary labels.
- **Text Body** (#334155): Standard body text for descriptions, table content, and secondary labels.
- **Text Muted** (#64748b): De-emphasized text for metadata, helper text, and inactive states.

### Named Rules
**The One-Accent Rule.** Teal appears only on interactive elements, live indicators, and primary actions. Decorative use dilutes its operational signal. Status pills, active nav items, and confidence scores earn the accent; static ornament does not.

**The Grade-Semantic Rule.** Green = Grade A, Blue = Grade B, Red = Reject. These assignments are strict and system-wide. No color may substitute for grade coding (e.g., no yellow warnings in grade UI). Users rely on instant color recognition during high-speed sorting.

## Typography

**Display Font:** Plus Jakarta Sans (with system-ui fallback stack)  
**Mono Font:** JetBrains Mono

**Character:** Plus Jakarta Sans brings geometric clarity and neutral technical tone without the coldness of pure grotesks. Its slightly rounded terminals soften long monitoring sessions while preserving numeric legibility at small sizes. JetBrains Mono handles all numeric data, IDs, timestamps, API payloads, and technical metadata with fixed-width precision.

### Hierarchy
- **Display** (800 weight, 1.85rem, 1.1 line-height, -0.02em tracking): Hero numbers in KPI cards (total scanned count, confidence scores). Used sparingly—only for the single most important metric per card.
- **Title** (700 weight, 0.92rem, 1.3 line-height): Card headers, modal titles, section labels. Always paired with an icon or visual anchor.
- **Body** (500 weight, 0.75rem, 1.5 line-height): Standard UI text, descriptions, criteria lists, table content. Max line length ~80ch in long-form areas.
- **Label** (700 weight, 0.72rem, 1.4 line-height, 0.04em tracking): Uppercase section headers ("CORE OPERATIONS", "KLASIFIKASI TELUR TERPINDAI"), inline tags, and emphasis labels.
- **Mono** (600 weight, 0.68rem, 1.4 line-height): All numeric values, egg IDs, FPS counters, millisecond latencies, YOLO probabilities, batch codes. Mono prevents number-width jitter during live updates.

### Named Rules
**The Mono-for-Numbers Rule.** Any value that updates in real-time or needs horizontal alignment (counts, percentages, ms timings, coordinates) must use JetBrains Mono. Variable-width numerals cause UI layout thrash during live data streams.

**The Hierarchy-by-Weight Rule.** Size changes are minimal (0.65rem to 1.85rem span). Weight and letter-spacing create hierarchy: 800 weight + tight tracking for hero numbers, 700 weight + wide tracking for headers, 500 weight + normal spacing for body.

## Layout

**Grid and Rhythm:** The dashboard uses a 4-column responsive grid for KPI cards (collapses to 2-col at 1200px, 1-col at 600px). Maximum content width is 1720px to accommodate ultra-wide production monitors. Vertical rhythm follows an 8px base unit: gaps are 16px (2 units), 24px (3 units), or 28px (3.5 units). Card padding is 18-20px to balance internal density with touchable click targets.

**Sidebar-Content Split:** Fixed 220px left sidebar (collapses to 76px icon-only at 1024px breakpoint). Sidebar is sticky top:0 with its own scroll container. Main panel is flex-1 and contains the top navigation bar (56px fixed height, sticky) plus scrollable content area. This three-zone layout (sidebar | top nav | scrollable content) mirrors industrial SCADA and control-room interfaces.

**Density Philosophy:** Operate-mode surfaces favor information density. The main dashboard shows 4 KPI cards, a full-width chart, and a live scan log table above the fold on 1920×1080 displays. Whitespace serves structural separation (between cards, sections) not decoration. Padding inside components is tight but never cramped—minimum 8px between interactive targets, 12px between label-value pairs.

**Responsive Behavior:** Mobile and tablet layouts preserve core functionality but reduce simultaneous data visibility. KPI grid collapses to single-column stack. Camera inspection view remains full-width with side-by-side quality/geometry cards stacking below. Modals and popovers remain centered overlays at all breakpoints.

## Elevation & Depth

EggSort-AI uses **subtle layered shadows** to distinguish interactive surfaces from the app background without imitating physical paper depth. The system is functionally flat—no dramatic z-axis lifts—but cards, modals, and hover states receive soft diffuse shadows to signal interactivity and focus hierarchy.

### Shadow Vocabulary
- **shadow-sm** (`0 1px 3px rgba(0,0,0,0.05)`): Resting state for KPI cards, table rows, input fields. Barely perceptible, exists to separate card from background.
- **shadow-md** (`0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)`): Hover state for cards, active dropdowns, floating status pills. Signals "this is interactive."
- **shadow-lg** (`0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)`): Modals, popovers, critical decision overlays. Reserved for surfaces that demand immediate attention or block underlying content.

### Named Rules
**The Flat-by-Default Rule.** Resting UI has minimal shadow (shadow-sm). Elevation appears only on interaction (hover, focus, open state). Never stack shadows for decorative depth—this is an industrial tool, not a consumer app.

**The Glow-for-Live Rule.** Live indicators (pulsing dots, status pills, active nav states) use `box-shadow: 0 0 6px <color>` glow instead of elevation shadows. Glow signals real-time activity; drop-shadow signals interactive surface. Never confuse the two.

## Shapes

**Form Language:** Rounded rectangles dominate. Border radius scales by component size and importance: 14px for large cards and modals, 10px for medium containers (metric cards, decision panels), 6px for small buttons and tags, 9999px (pill shape) for status indicators and inline badges. Sharp corners (0px radius) appear only on the logo icon (8px radius) and the sidebar active-state gradient background.

**Corner Strategy:** Larger radius on outer containers (cards, modals) creates soft approachability without sacrificing technical tone. Tighter radius on nested elements (buttons, inputs, tags) maintains crispness and prevents excessive roundness. Pills are reserved for live-state indicators: "API ONLINE", "LIVE", status tags. Their infinite radius makes them instantly recognizable as real-time status surfaces.

**Borders:** 1px solid strokes in neutral-border (#e2e8f0) or grade-specific borders. Grade-coded cards receive a 1px border in the matching grade color (grade-a-border, grade-b-border, grade-reject-border). The sidebar receives a 1px right border to separate it from the main panel.

## Components

### Buttons
- **Shape:** Rounded rectangle, 6-10px radius depending on size
- **Primary:** Teal-vision background (#059669), white text, 700 weight, 8px vertical / 16px horizontal padding, 0.72rem font size. Uppercase labels optional for high-emphasis actions.
- **Hover:** Teal-vision-deep (#047857), slight translateY(-1px) lift
- **Secondary / Ghost:** Teal-light background (#ecfdf5), teal-vision text, teal-border stroke. Hover fills with teal-vision and inverts text to white.

### Status Pills
- **Style:** Pill shape (9999px radius), teal-light background, teal-vision text, teal-border stroke, 6px vertical / 14px horizontal padding, 0.75rem mono font, 600 weight
- **Live Indicator:** Includes a 7px pulsing dot (box-shadow glow, animation: pulse-dot 1.8s infinite) followed by label text ("YOLOv8 API ONLINE", "ESP32-CAM ONLINE // 29.8 FPS")
- **Offline Variant:** Red background (rgba(239, 68, 68, 0.1)), red border, red text, red pulsing dot

### KPI Cards
- **Corner Style:** 14px radius
- **Background:** Neutral-card (#ffffff)
- **Border:** 1px neutral-border (#e2e8f0)
- **Shadow Strategy:** shadow-sm at rest, shadow-md on hover
- **Internal Padding:** 18px vertical / 20px horizontal
- **Header Layout:** Label (0.72rem, 700 weight, uppercase, muted) aligned left, icon circle (32px, 8px radius, grade-colored background) aligned right
- **Value Display:** 1.85rem display numerals, -0.02em tracking, 800 weight, text-title color
- **Footer:** 1px top border (border-subtle), metadata in 0.75rem body text (muted), optional status tag or trend badge

### Sidebar Navigation
- **Default State:** Transparent background, sidebar-text color (#94a3b8), 0.73rem, 500 weight
- **Hover:** bg-sidebar-hover (rgba(255,255,255,0.08)), white text, icon translateX(2px)
- **Active State:** Linear gradient (90deg, #00dfa2 0%, #059669 100%), dark teal text (#042f2e), 700 weight, box-shadow glow. Active pill is unmistakable—vibrant gradient vs. neutral sidebar.
- **Icon:** 15px square, 0.8 opacity at rest, 1.0 on hover/active

### Modals
- **Backdrop:** Fixed overlay, rgba(5, 10, 20, 0.78) + backdrop-filter blur(8px)
- **Window:** Neutral-card background, 14px radius, 1px neutral-border, shadow-lg, max-width 820px, max-height calc(100vh - 32px)
- **Top Bar:** Card-subtle background, 1px bottom border, 12px padding, egg ID in mono font, grade badge pill, close button (30px, 7px radius, transparent → card-hover on hover)
- **Grid Layout:** 1.05fr (visual panel) / 1fr (metrics panel), 16px gap, collapses to single-column on mobile
- **HUD Overlays:** Reticle corners (12px, 2.5px teal stroke), center crosshair, dimension tag in mono (0.65rem, teal text on black-60 background)

### Cards / Containers
- **Corner Style:** 14px for top-level cards, 10px for nested panels
- **Background:** Neutral-card or card-subtle depending on hierarchy
- **Shadow Strategy:** shadow-sm baseline, shadow-md on interactive hover
- **Border:** 1px neutral-border, or grade-specific border when card represents classified data
- **Internal Padding:** 18-20px for cards, 8-12px for nested metric panels

### Inputs / Fields
- **Style:** 1px neutral-border stroke, 6px radius, card-subtle background, 8px padding
- **Focus:** Teal-border stroke, teal glow (0 0 0 3px rgba(5, 150, 105, 0.1))
- **Error / Disabled:** Red border for error, muted text + disabled cursor for disabled

## Do's and Don'ts

Concrete visual guardrails grounded in the incumbent implementation and operational context.

### Do:
- **Do** use JetBrains Mono (0.68rem, 600 weight) for all real-time numeric values, IDs, timestamps, and API data. Variable-width numerals cause layout jitter.
- **Do** reserve the teal accent (#059669, #10b981) for interactive elements, live indicators, and primary actions. ≤15% accent coverage per screen preserves signal strength.
- **Do** apply grade-semantic colors (green A, blue B, red Reject) consistently across KPI cards, decision banners, confidence rings, and criteria checklists. Users rely on color = grade.
- **Do** include pulsing status dots (7px, 0 0 6px glow, animation: pulse-dot 1.8s) on all live-state indicators. Pulse = real-time activity.
- **Do** use shadow-sm for resting cards, shadow-md for hover, shadow-lg for modals. Elevation signals interactivity, not decoration.
- **Do** maintain 14px radius on large cards/modals, 10px on medium containers, 6px on buttons/inputs, 9999px on status pills. Scale radius by component size.
- **Do** set maximum content width to 1720px to support ultra-wide production monitors without excessive line lengths.

### Don't:
- **Don't** use teal accent for static decoration, ornamental icons, or non-interactive text. Teal = action or live state.
- **Don't** substitute grade colors. Never use yellow/orange/purple in place of the strict green/blue/red grade triad. Industrial users depend on instant color → classification mapping.
- **Don't** apply Plus Jakarta Sans to numeric data that updates in real-time. Use mono only. Proportional numerals (1 vs. 0) have different widths and cause UI thrash.
- **Don't** add decorative shadows or excessive elevation. The system is functionally flat with shadows only for interaction (hover) or hierarchy (modal over content).
- **Don't** round every corner to the same radius. Large surfaces earn 14px, small buttons get 6px, pills are infinite. Radius hierarchy clarifies component scale.
- **Don't** exceed ~80% information density on Operate-mode dashboards. Leave 20% structural whitespace (gaps, padding) to prevent cognitive overload during 8-hour monitoring shifts.
