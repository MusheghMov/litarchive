# LitArchive

A modern web application for exploring, discovering, and organizing literature, built as a monorepo using Turborepo. Features a clean, responsive UI, user authentication, personal collections, and a rich reading experience.

<!-- ![LitArchive](https://github.com/username/litarchive/raw/main/assets/preview.png) -->

## 🏗️ Monorepo Architecture

This project is structured as a monorepo using Turborepo for build system orchestration and pnpm workspaces for package management. This architecture provides:

- Shared code and dependencies across packages
- Parallel task execution for faster builds
- Caching for improved development performance
- Strict boundaries between project components

## ✨ Features

- 📚 Browse and search through a curated collection of literary works
- 👤 User accounts with personal libraries and reading progress tracking
- 🏷️ Create and manage custom book lists
- ⭐ Rate and review books and authors
- 📱 Responsive design that works on desktop and mobile
- 🌓 Light/dark mode and multiple color themes
- 📝 Rich text editor for creating articles and reviews

## 📋 Project Structure

The project is organized as a monorepo using Turborepo and pnpm workspaces:

```
├── apps/
│   ├── backend/         # Hono.js API server
│   └── litarchive/      # Next.js frontend application
├── packages/
│   └── db/              # Shared database schema and utilities
```

### Tech Stack

- **Build System**:

  - Turborepo for task orchestration and build optimization
  - pnpm for fast, disk-efficient package management
  - Shared ESLint and TypeScript configurations

- **Frontend**:

  - Next.js 15 (App Router)
  - TailwindCSS with multiple themes
  - Radix UI / shadcn UI components
  - React Query for data fetching
  - Clerk for authentication
  - TipTap for rich text editing

- **Backend**:

  - Hono.js (lightweight TypeScript framework)
  - Cloudflare Workers for edge deployment
  - OpenAPI documentation

- **Database**:
  - Turso (SQLite-based serverless database)
  - Drizzle ORM with type-safe queries

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [pnpm](https://pnpm.io/) package manager
- [Turso CLI](https://docs.turso.tech/reference/turso-cli) (for local development)

### Environment Variables

Create a `.env.local` file in both the `apps/backend` and `apps/litarchive` directories:

For `apps/backend/.dev.vars`:

```
DATABASE_URL=
DATABASE_AUTH_TOKEN=
```

For `apps/litarchive/.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/MusheghMov/litarchive.git
   cd litarchive
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up the database:

   ```bash
   cd packages/db
   pnpm db:push
   ```

4. Start the development server with Turborepo:

   ```bash
   pnpm dev
   ```

   This command utilizes Turborepo to start all necessary services in parallel, with smart caching for faster restart times.

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🏗️ Project Structure

### Frontend (Next.js)

The frontend is a Next.js application with the following structure:

```
apps/litarchive/
├── public/           # Static assets
├── src/
│   ├── app/          # App router pages
│   ├── components/   # React components
│   ├── lib/          # Utility functions
│   ├── providers/    # Context providers
│   └── types/        # TypeScript type definitions
```

### Backend (Hono.js)

The backend is a Hono.js application with the following structure:

```
apps/backend/
├── src/
│   ├── authors/      # Author-related endpoints
│   ├── books/        # Book-related endpoints
│   ├── ratings/      # Rating-related endpoints
│   ├── lists/        # List-related endpoints
│   ├── user/         # User-related endpoints
│   └── lib/          # Utility functions
```

### Database (Turso + Drizzle)

The database schema and utilities are defined in the `packages/db` directory:

```
packages/db/
├── src/           # Source code
│   ├── schema.ts  # Database schema definition
│   └── index.ts   # Database client and exports
└── drizzle/       # Migrations
```

## 🚀 Deployment

This project leverages Turborepo for optimized builds across all packages.

### Full Project Deployment

```bash
# Build all applications and packages
pnpm build

# Deploy specific applications
pnpm deploy
```

### Backend (Cloudflare Workers)

```bash
cd apps/backend
wrangler deploy
```

### Frontend (Vercel)

```bash
# Deploy from root using Turborepo pipeline
vercel

# Or deploy just the frontend
cd apps/litarchive
vercel
```

## 🧩 Main Features Explained

### Authentication

The application uses Clerk for authentication, which provides a secure and easy-to-use authentication system with features like:

- Email/password login
- Social logins
- User profiles
- Account management

### Book and Author Management

- Browse and search through a curated collection of books and authors
- View detailed information about books and authors
- Rate and review books and authors
- Track reading progress

### Personal Library

- Save books to your personal library
- Create and manage custom lists
- Track reading progress across devices

### Content Creation

- Write and publish articles using the rich text editor
- Add formatting, links, and media to your content

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Commit Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages. This leads to more readable messages that are easy to follow when looking through the project history and enables automatic version management and changelog generation.

Format: `<type>(<scope>): <description>`

Examples:

```
feat(books): add rating functionality
fix(auth): resolve login redirect issue
docs(readme): update installation instructions
style(ui): improve button styling
refactor(api): restructure authors endpoint
test(unit): add tests for list component
chore(deps): update dependencies
```

Common types:

- feat: A new feature
- fix: A bug fix
- docs: Documentation only changes
- style: Changes that do not affect the meaning of the code
- refactor: A code change that neither fixes a bug nor adds a feature
- test: Adding missing tests or correcting existing tests
- chore: Changes to the build process or auxiliary tools

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes following the Conventional Commits format
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request with a detailed description

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
