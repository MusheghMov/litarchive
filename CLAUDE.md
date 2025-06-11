# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LitArchive is a modern literature discovery and organization platform built as a Turborepo monorepo with Next.js frontend and Hono.js backend. The application features book/author management, user collections, rating systems, collaborative editing, and rich content creation.

## Monorepo Structure

- `apps/litarchive/` - Next.js 15 frontend (App Router)
- `apps/backend/` - Hono.js API deployed to Cloudflare Workers
- `packages/db/` - Shared Drizzle ORM database schema and utilities

## Development Commands

### Root Level (Turborepo)
```bash
pnpm dev          # Start all apps in development mode
pnpm build        # Build all apps and packages
pnpm lint         # Run linting across all packages
```

### Frontend (`apps/litarchive/`)
```bash
pnpm dev          # Next.js dev server with Turbopack and Node.js inspector
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # ESLint checking
```

### Backend (`apps/backend/`)
```bash
pnpm dev          # Run TypeScript watch + Wrangler dev server in parallel
pnpm build        # Compile TypeScript
pnpm deploy       # Deploy to Cloudflare Workers
```

### Database Management
```bash
cd apps/litarchive
pnpm run generate # Generate Drizzle migration files
pnpm run push     # Push schema changes to database
npx drizzle-kit studio # Launch database GUI
```

## Key Architecture Details

### Database (Turso + Drizzle ORM)
- SQLite-based serverless database via Turso
- Schema defined in `packages/db/src/schema.ts`
- Includes complex relationships: users, books, authors, ratings, lists, articles, community books with collaborative chapters
- Database client exported from `@repo/db` workspace package

### Authentication & Authorization
- Clerk integration for user authentication
- User context available throughout Next.js app
- Backend validates auth via `@hono/clerk-auth`

### API Architecture
- Backend uses Hono.js with OpenAPI/Zod validation
- Type-safe API client generated via Hono's RPC client
- API client configured in `apps/litarchive/src/app/honoRPCClient.ts`

### Real-time Collaboration
- Uses Yjs with Y-WebSocket for collaborative editing
- Durable Objects in Cloudflare Workers manage collaboration state
- TipTap editor with collaboration extensions

### Frontend State Management
- React Query for server state
- Jotai for client state
- Form handling via React Hook Form + Zod validation

### Styling & UI
- TailwindCSS with custom themes and animations
- Radix UI primitives via shadcn/ui components
- Dark/light mode support with next-themes

## Testing & Quality

Run linting and type checking after code changes:
```bash
pnpm lint         # ESLint for all packages
```

## Environment Setup

### Backend (`.dev.vars` in `apps/backend/`)
```
DATABASE_URL=
DATABASE_AUTH_TOKEN=
```

### Frontend (`.env.local` in `apps/litarchive/`)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## Code Conventions

- Follow Conventional Commits specification
- TypeScript strict mode enabled
- Use existing patterns for new components
- Backend routes organized by domain (books, authors, users, etc.)
- Frontend components use shadcn/ui patterns with proper TypeScript typing