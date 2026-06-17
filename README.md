# FarmRisk

Welcome to the **FarmRisk** frontend repository. **This project is a Next.js application designed to provide high-resolution remote sensing, satellite field mapping, and localized climate data backed by predictive AI insights**.

This README serves as a guide for team members to understand the architecture, routing mechanics, and code organization.

## Project Architecture & Folder Structure

**We use a standard, single Next.js repository to keep our landing page, dashboard console, components, and API routes completely unified**.

Below is a breakdown of our current directory tree:

```
├── app/                      # Next.js App Router (Routing & Pages)
│   ├── api/                  # Secure serverless API routes
│   │   ├── ai/               # Secure proxy endpoints for LLM insights & chat
│   │   └── weather/          # Secure proxy endpoints for weather API data
│   ├── constants/            # Centralized copy, titles, and layout configurations
│   │   └── content.ts        # Dynamic content JSON arrays (Sidebar navigation, headers)
│   ├── dashboard/            # The main, authenticated application console
│   │   ├── layout.tsx        # Persistent shell containing the global Sidebar + Top Nav
│   │   ├── page.tsx          # Overview sub-page (at /dashboard)
│   │   ├── map/              # Satellite map sub-page (at /dashboard/map)
│   │   ├── profile/          # User profile settings (at /dashboard/profile)
│   │   ├── settings/         # Extended console settings
│   │   └── weather/          # Weather analytics tab
│   ├── globals.css           # Global Tailwind CSS configurations
│   ├── layout.tsx            # Global HTML root layout wrapper
│   └── page.tsx              # Root public-facing Landing Page
├── components/               # Reusable React components
│   ├── app-sidebar.tsx       # Our main sidebar wrapper (dynamically built via JSON config)
│   └── ui/                   # Low-level shadcn/ui structural primitives
├── hooks/                    # Custom global React hooks
├── lib/                      # Helper frameworks and utilities (e.g., clsx styling helpers)
└── types/                    # Global TypeScript definitions and type guards
```

## How Routing and Layouts Work

### 1. Unified App Router

Everything inside the `app/` directory automatically maps to a URL route.

- **Landing Page:** Governed directly by `app/page.tsx` (the root `/`).
- **Console Dashboard:** Handled inside `app/dashboard/`. **Sub-folders like** `map/` or `profile/` instantly resolve to `/dashboard/map` and `/dashboard/profile`

### 2. Nesting with `layout.tsx`

We utilize Next.js layouts to prevent expensive, jarring UI re-renders:

- `app/dashboard/layout.tsx` serves as the permanent frame for our internal tools.
- **It contains our structural** `<AppSidebar />` component.
- **When a user changes tabs (e.g., moving from Overview to Farm Map), the sidebar remains** **completely static** while the nested page content seamlessly swaps out inside the layout's `{children}` prop.

## Configuration-Driven Copy & Sidebar

**To ensure long-term maintainability and prevent copy text or routes from cluttering up layout styles,** **all content is strictly data-driven**.

### `app/constants/content.ts`

**This file holds our global string constants (titles, descriptions) as well as the layout configurations for our navigation links**.

### Dynamic Sidebars

**Instead of hardcoding layout links inside the TSX files,**` components/app-sidebar.tsx` imports configuration JSON arrays directly from `content.ts`. **It iterates over them dynamically using a** `.map() `loop, passing corresponding key routes and matching icon names.

- **To add a new menu item:** Simply insert a new object into the navigation array inside `content.ts`. **You do not need to rewrite any layout markup**.

## Technology Stack Overview

- **Framework:** Next.js (React App Router with Server-Side Rendering capabilities).
- **Styling:** Tailwind CSS (configured via `app/globals.css`).
- **Design Elements:**` shadcn/ui` components (stored locally inside `components/ui/` so we can customize them fully).
- **Package Runner:** Bun (`bun.lock`).

## Moving Forward

If you are adding a feature:

1. **Put the visual layout sub-page inside its respective** `app/dashboard/<feature-name>/page.tsx` folder.
2. **Append its navigation properties (title, path mapping, and custom lucide icon reference) directly inside** `app/constants/content.ts` to reveal it automatically on the UI console
