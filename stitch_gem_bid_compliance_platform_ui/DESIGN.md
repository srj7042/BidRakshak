---
name: ProcureVerify AI
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3d4a42'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6d7a72'
  outline-variant: '#bccac0'
  surface-tint: '#006c4a'
  primary: '#006948'
  on-primary: '#ffffff'
  primary-container: '#00855d'
  on-primary-container: '#f5fff7'
  inverse-primary: '#68dba9'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#006947'
  on-tertiary: '#ffffff'
  tertiary-container: '#00855b'
  on-tertiary-container: '#f5fff6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#85f8c4'
  primary-fixed-dim: '#68dba9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005137'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-xxs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.25rem
  space-2xl: 1.5rem
  space-3xl: 2rem
  gutter-table: 0.75rem
  margin-page: 1.5rem
---

## Brand & Style

This design system establishes a high-density, institutional-grade compliance environment tailored for public sector procurement authorities, nodal officers, and financial auditors operating on or interfacing with GeM (Government e-Marketplace).

### Brand Personality & Emotional Impact
- **Inviolable Integrity:** Visual structures emphasize statutory adherence, traceable lineage, and zero ambiguity.
- **Cognitive Clarity Under Density:** Large multidimensional datasets (clause cross-checks, tender BOQs, turnover matrices) are rendered legible, scannable, and stress-free.
- **Pragmatic Modernism:** Merges government authority with the precision and speed of modern enterprise infrastructure.
- **Trustworthy Human-Machine Collaboration:** Visually segregates machine-inferred confidence scores from definitive human officer overrides and statutory sign-offs.

### Visual Style
The design system employs a **Structured Institutional Flat** aesthetic augmented by fine micro-borders, low-saturation structural fills, and strict tabular density. It rejects decorative skeuomorphism and excessive blur in favor of high-legibility typographic scale, subtle tonal layering, and explicit state indicators.

## Colors

The system uses a calibrated palette designed for prolonged analytical review under variable institutional lighting.

### Core Semantic Roles
- **Primary (`#059669` / `#10B981`):** Represents verified compliance, valid certifications, and primary forward actions. Deep emerald (`#064E3B`) serves as the active text/focus indicator against pale mint backgrounds (`#ECFDF5`).
- **Foundation Slate (`#0F172A` / `#1E293B`):** Establishes institutional gravitas across app-headers, contextual flyouts, and critical navigation items.
- **Neutral Structure (`#F8FAFC` to `#334155`):** `#F8FAFC` forms the application canvas; `#F1F5F9` builds sub-layers and nested data wells; `#E2E8F0` defines all structural dividers and cell boundaries. `#334155` provides optimal body text contrast (exceeding WCAG AAA).

### Compliance & Status System
- **Compliant / Verified:** Surface `#ECFDF5`, Border `#A7F3D0`, Foreground `#065F46`.
- **Under Review / Cautionary:** Surface `#FFFBEB`, Border `#FDE68A`, Foreground `#92400E`.
- **Discrepancy / Non-Compliant:** Surface `#FFF1F2`, Border `#FECDD3`, Foreground `#9F1239`.
- **Neutral / Informational:** Surface `#F8FAFC`, Border `#E2E8F0`, Foreground `#334155`.

### Human-in-the-Loop AI Signature
- **AI Recommendation Surface:** Tinted `#F0FDF4` paired with an accent stripe of `#059669`.
- **AI Confidence Gauge:** Gradient tokens transition from Amber (`#F59E0B`) to Emerald (`#10B981`).
- **Human Sign-Off State:** Solid Slate-900 badge (`#0F172A`) paired with emerald checkmarks to indicate official statutory sign-off distinct from machine predictions.

## Typography

Typography prioritizes high-speed horizontal scanning and tabular alignment. 

- **Display & Section Headers:** Plus Jakarta Sans provides clean, authoritative geometric headings.
- **Operational Copy & Complex Tables:** Inter ensures maximum neutral legibility in dense lists and multi-column verification panes.
- **Tender Reference & Hash Tracking:** JetBrains Mono is assigned to tender reference numbers, GeM item IDs, GSTINs, and audit hash signatures to prevent visual misinterpretation of alphanumeric strings.
- **Numbers:** Tabular lining figures (`font-variant-numeric: tabular-nums`) must be active on all table cells, price comparisons, and AI compliance probabilities.

## Layout & Spacing

The design system operates on a compact 4px baseline sub-grid optimized for dense tabular interfaces.

### Layout Model
- **Shell Architecture:** A persistent 64px collapsed/240px expanded navigation sidebar with an institutional top bar (48px height) housing system audit status, officer profile, and tender selector.
- **Multi-Pane Workspace:** Primary views adopt a dual or triple-pane split: Bid Clause Reference (30%), AI Verification Findings (45%), and Human Review & Action Dossier (25%).
- **Data Tables:** Row heights are fixed to compact increments:
  - **Compact:** 32px height for bulk verification matrices.
  - **Standard:** 40px height for multi-document review lists.
  - **Relaxed:** 52px height for rows containing AI reasoning expansions.

### Breakpoint Strategy
- **Desktop (>= 1440px):** Full triple-pane operational review with side-by-side original bid PDF preview.
- **Laptop (1024px - 1439px):** Dual-pane view with sliding drawer for clause comparison.
- **Tablet & Compact (<= 1023px):** Single-pane stacked tab workflow. Mobile is treated as an urgent read-only escalation view; verification sign-offs require confirmation modal safeguards.

## Elevation & Depth

This system avoids expressive drop shadows, relying on tonal surface boundaries and subtle outline containment to maintain government-grade sobriety.

### Tonal Hierarchy
- **Canvas Base:** `#F8FAFC`
- **Surface Level 1 (Panels & Cards):** `#FFFFFF` bordered with `1px solid #E2E8F0`
- **Surface Level 2 (Nested Context Wells & AI Insight Blocks):** `#F1F5F9` or `#F0FDF4`
- **Overlay Level 3 (Drawers, Popovers, Modals):** `#FFFFFF` with boundary border `#CBD5E1`

### Subtle Shadows
Where elevation is necessary to lift floating panels above dense tables:
- **Low (Dropdowns & Tooltips):** `0 1px 2px 0 rgba(15, 23, 42, 0.05)`
- **Medium (Drawers & Context Menus):** `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`
- **High (Modal Dossiers):** `0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.06)`

## Shapes

The design system enforces a disciplined, precise corner geometry to reinforce structure and data containment.

- **Base Radius (`0.25rem` / 4px):** Applied to form controls, badges, table status indicators, and buttons.
- **Card & Container Radius (`0.5rem` / 8px):** Applied to high-level layout containers, summary metric panels, and modals.
- **Strict Prohibition:** Full pills (`9999px`) are restricted solely to AI confidence micro-tags to contrast machine probability pills against rectangular institutional metrics.

## Components

### Buttons
- **Primary Action (Approve / Confirm Sign-Off):** Background `#059669`, text `#FFFFFF`, hover `#047857`. Focus ring: 2px offset with `#10B981`.
- **Secondary (Clause Verify / Export):** Background `#FFFFFF`, border `1px solid #CBD5E1`, text `#1E293B`, hover `#F8FAFC`.
- **Destructive / Flag Discrepancy:** Background `#FFF1F2`, border `1px solid #FECDD3`, text `#9F1239`, hover `#FFE4E6`.
- **Sizing:** Fixed at 32px height for table inline actions; 36px height for toolbar actions.

### Compliance Status Chips
- All chips maintain a `1px solid` border, uppercase label (`11px font-size`, semibold), and an inline icon.
- **Compliant:** Green dot icon, green text `#065F46`, background `#ECFDF5`, border `#A7F3D0`.
- **Discrepancy:** Amber alert triangle or Rose cross icon, text `#9F1239`, background `#FFF1F2`, border `#FECDD3`.

### Human-in-the-Loop Verification Card
- Two-tone container: Left vertical accent (3px solid `#059669` for AI confidence > 90%; `#F59E0B` for < 90%).
- Contains explicit sub-sections:
  1. *AI Parsing Summary:* Monospace citations referring directly to PDF page and line numbers.
  2. *Confidence Indicator:* Subtle gauge showing percentage match against GeM tender requirements.
  3. *Officer Action Segment:* Explicit radio group for "Accept AI Recommendation", "Reject & Request Manual Audit", and "Request Clarification from Bidder".

### Form Controls & Inputs
- **Height:** 32px standard input.
- **Border:** `1px solid #CBD5E1`, background `#FFFFFF`. Active state uses `border-color: #059669` with `box-shadow: 0 0 0 1px #059669`.
- **Disabled State:** Background `#F1F5F9`, border `#E2E8F0`, text `#94A3B8`.

### Data Tables
- Header row uses `#F8FAFC` background, 28px height, uppercase `11px` bold text in `#475569`, bottom border `1px solid #CBD5E1`.
- Alternating rows remain white; hover state triggers `#F1F5F9` transition.
- Discrepant cell highlights utilize subtle tint `#FEF2F2` with a `2px` left border marker.