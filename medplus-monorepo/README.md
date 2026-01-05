# MedPlus Monorepo

Production-ready hospital reservation system with separate web and mobile applications.

## Project Structure

```
medplus-monorepo/
├── apps/
│   ├── web/          # Next.js web application
│   └── mobile/       # Ionic mobile app (iOS/Android)
├── packages/
│   ├── shared-types/ # Common TypeScript types
│   ├── api-client/   # Supabase services
│   └── ui/           # Shared React components
└── supabase/         # Database migrations & functions
```

## Quick Start

```bash
# Install dependencies
npm install

# Run web app
npm run web

# Run mobile app
npm run mobile

# Run both
npm run dev
```

## Development

- **Web:** http://localhost:3000 (Next.js)
- **Mobile:** http://localhost:5173 (Ionic)

## Tech Stack

- **Web:** Next.js 14, Tailwind CSS, shadcn/ui
- **Mobile:** Ionic 7, React, Capacitor
- **Backend:** Supabase (PostgreSQL, Auth, Realtime)
- **Monorepo:** Turborepo + npm workspaces
