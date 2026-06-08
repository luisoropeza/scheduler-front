# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server with HMR
pnpm build        # Type-check + production build (tsc -b && vite build)
pnpm lint         # Run ESLint
pnpm preview      # Preview the production build locally
```

There is no test runner configured yet.

## Stack

- **React 19** + **TypeScript 6** via **Vite 8**
- **Tailwind CSS 4** — integrated as a Vite plugin (`@tailwindcss/vite`), imported as a single `@import "tailwindcss"` in `src/index.css`. No `tailwind.config.js` is needed.
- **TanStack Query 5** (`@tanstack/react-query`) for server-state management. The `@tanstack/eslint-plugin-query` dev dependency is present but not yet wired into `eslint.config.js`.

## Architecture

The project is a fresh scaffold. `src/App.tsx` is an empty component and `src/main.tsx` mounts it with `StrictMode`. All application code will be added under `src/`.

## TypeScript

`tsconfig.app.json` enforces `noUnusedLocals`, `noUnusedParameters`, and `erasableSyntaxOnly`. Use `verbatimModuleSyntax` — import types with `import type { … }`.

## ESLint

Config is in `eslint.config.js` (flat config format). The `@tanstack/eslint-plugin-query` package is installed but not yet added to the config — wire it in when TanStack Query usage begins.
