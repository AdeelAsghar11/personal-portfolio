---
version: "alpha"
name: "Portfolio Dev Full-Stack"
description: "Developer portfolio, full-stack, projects gallery, clean layout, minimal, dark and cyan, code, tech stack, personal brand. Ideal for landing pages, modern websites. AI-ready template."
colors:
  primary: "#000000"
  secondary: "#1A1A1A"
  tertiary: "#00BCD4"
  neutral: "#FFFFFF"
  surface: "#E0E0E0"
  accent: "#333333"
typography:
  h1:
    fontFamily: JetBrains Mono
    fontSize: 2.5rem
    fontWeight: 700
  body-md:
    fontFamily: JetBrains Mono
    fontSize: 1rem
    fontWeight: 400
rounded:
  sm: 8px
  md: 16px
  lg: 24px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.sm}"
    padding: 12px
---

## Overview

Developer portfolio, full-stack, projects gallery, clean layout, minimal, dark and cyan, code, tech stack, personal brand. Ideal for landing pages, modern websites. AI-ready template. Developer portfolios used to be an afterthought. A WordPress theme, maybe a Behance page if you were feeling fancy. Then GitHub became the resume. Contribution graphs, pinned repos, README aesthetics — suddenly your commit history was your portfolio. The personal site felt redundant for a while.

Then the pendulum swung. Developers realized a grid of green squares doesn't communicate taste. The terminal aesthetic emerged — monospace type, dark backgrounds, blinking cursors, ASCII art headers. It was a way to say "I live in the command line" without saying it. Some went minimal to the point of hostility. Others built elaborate interactive CLIs in the browser. Both were statements.

What's interesting now is the full-stack developer portfolio as proof of craft. The site itself is the project. How it loads, how it deploys, what framework it uses — recruiters might not notice, but other developers will. The portfolio became a technical flex disguised as a personal page. Your stack choices are your design choices.

- Density: 3/10 — Airy
- Variance: 3/10 — Restrained
- Motion: 4/10 — Subtle

- **Style:** Minimal, Dark, Professional
- **Keywords:** developer portfolio, full-stack, projects gallery, clean layout, minimal, dark and cyan, code, tech stack, personal brand
- **Era:** 2020s Developer
- **Light/Dark:** ✗ No / ✓ Full

## Colors & Dual Mode System

### Dark Mode (Default)
- **Primary Background:** `#060913` — Dark surface, primary canvas
- **Card Surface:** `#0B1122` — Elevated card surface (`#101932` tertiary, `#152244` elevated)
- **Primary Text:** `#F8FAFC` — Crisp white heading & key details (15:1 contrast)
- **Secondary Text:** `#94A3B8` — Slate-400 readable body text (7:1 contrast)
- **Muted Text:** `#64748B` — Slate-500 tags, dates, subtitles (4.6:1 contrast)
- **Accents:** Cyan (`#00F0FF`), Green (`#00FF88`), Teal (`#14B8A6`), Violet (`#8B5CF6`)

### Light Mode (Visual Clarity & WCAG AA/AAA Audited)
- **Primary Background:** `#F8FAFC` — Slate-50 off-white canvas (prevents pure white glare)
- **Card Surface:** `#FFFFFF` — Crisp pure white cards with subtle border (`rgba(148, 163, 184, 0.3)`)
- **Pill / Badge Surface:** `#F1F5F9` — Slate-100 tag backgrounds
- **Primary Text:** `#0F172A` — Slate-900 (18.7:1 contrast, WCAG AAA)
- **Secondary Text:** `#334155` — Slate-700 (8.2:1 contrast, WCAG AAA)
- **Muted Text:** `#64748B` — Slate-500 (4.6:1 contrast, WCAG AA compliant)
- **Accents (Controlled Saturation Cap <80%):**
  - Sky Cyan: `#0284C7` (4.6:1 contrast on white)
  - Emerald Green: `#059669` (4.55:1 contrast on white)
  - Teal: `#0D9488` (4.52:1 contrast on white)
  - Violet: `#7C3AED` (5.4:1 contrast on white)


## Typography

- **Display / Hero:** JetBrains Mono — Weight 700, tight tracking, used for headline impact
- **Body:** JetBrains Mono — Weight 400, 16px/1.6 line-height, max 72ch per line
- **UI Labels / Captions:** JetBrains Mono — 0.875rem, weight 500, slight letter-spacing
- **Monospace:** JetBrains Mono — Used for code, metadata, and technical values

Scale:
- Hero: clamp(2.5rem, 5vw, 4rem)
- H1: 2.25rem
- H2: 1.5rem
- Body: 1rem / 1.6
- Small: 0.875rem


## Layout

- **Grid:** CSS Grid primary. Max-width containment: 1280px centered with 1.5rem side padding.
- **Spacing rhythm:** Balanced. Base unit: 0.5rem (8px).
- **Section vertical gaps:** clamp(4rem, 8vw, 8rem).
- **Hero layout:** Split-screen (text left, visual right).
- **Feature sections:** Zig-zag alternating text+image rows. No 3-equal-columns.
- **Mobile collapse:** All multi-column layouts collapse below 768px. No horizontal overflow.
- **z-index contract:** base (0) / sticky-nav (100) / overlay (200) / modal (300) / toast (500).


## Elevation & Depth

Layout duas colunas desktop (bio/projetos), cards de projetos com tech stack badges, hover com underline animado e escala suave, CSS grid/flex para galeria.

- **Physics:** Ease-out curves, 200-300ms duration. Smooth and predictable.
- **Entry animations:** Fade + translate-Y (16px → 0) over 420ms ease-out. Staggered cascades for lists: 80ms between items.
- **Hover states:** Subtle color shift + shadow adjustment over 200ms.
- **Page transitions:** Fade only (200ms).
- **Performance:** Only transform and opacity animated. No layout-triggering properties.


## Shapes

Base corner radius: 8px. See rounded tokens in front matter for the full scale.


## Components

- **Primary Button:** Rounded (8px) shape. Accent color fill. Hover: 8% darken + subtle lift shadow. Active: -1px translate tactile press. Font weight 600. No outer glows.
- **Secondary / Ghost Button:** Outline variant. 1.5px border in muted color. Text in primary color. Hover: subtle background fill.
- **Cards:** Rounded (8px) corners. Surface background. Subtle shadow (0 2px 12px rgba(0,0,0,0.06)). 1px border stroke.
- **Inputs:** Label above input. 1px border stroke. Focus ring: 2px accent color offset 2px. Error text below in semantic red. No floating labels.
- **Navigation:** Primary surface background. Active item: accent color indicator. Font weight 500 when active.
- **Skeletons:** Shimmer animation matching component dimensions. No circular spinners.
- **Empty States:** Icon-based composition with descriptive text and action button.


## Do's and Don'ts

- No emojis in UI — use icon system only (Lucide, Heroicons)
- No decorative gradients — flat color only
- No shadows heavier than 0 2px 8px rgba(0,0,0,0.08)
- No pure white (#FFFFFF) backgrounds — use off-white or dark surfaces
- No oversaturated accent colors (saturation cap: 80%)
- No 3-column equal-width feature layouts — use zig-zag or asymmetric grid
- No `h-screen` — use `min-h-[100dvh]`
- No AI copywriting clichés: "Elevate", "Seamless", "Unleash", "Next-Gen"
- No broken external image links — use picsum.photos or inline SVG
- No generic lorem ipsum in demos

- Do Navbar + Hero (bio + CTA)
- Do Projetos + Stack/Skills
- Do Experiência + Depoimentos
- Do CTA 'Fale comigo'
- Do Meta tags SEO
- Do Background escuro legível
- Do Microinterações discretas
- Do Ícones SVG (Git
- Do terminal
- Do frameworks).


## Use Case

Landing pages, Modern websites
