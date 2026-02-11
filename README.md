# WebCalendar

WebCalendar is a production-style calendar application with a time-slot scheduling UI (Day/Week views), event CRUD workflows, and a secured REST API backed by Firebase authentication.

---

## Links

- **Repository:** https://github.com/Dmytro0702/Web-calendar
- **Live Demo (Frontend):** https://calendar-dev-f58f5.web.app
- **API (Firebase Functions, europe-west2):** https://europe-west2-calendar-dev-f58f5.cloudfunctions.net/api

---

## Features

- Day / Week views
- 15-minute time grid
- Create / view / edit / delete events via modal workflows
- Multiple calendars with color assignment
- Secured backend REST API (Firebase ID token verification)
- Workspace monorepo with production-oriented tooling (TypeScript, ESLint/Prettier, tests)

---

## Tech Stack

**Client**
- React + TypeScript
- Vite
- Redux Toolkit (UI state)
- React Query (server state)
- React Hook Form + Zod (forms & validation)
- SCSS Modules
- Firebase Auth (client-side authentication)

**Server**
- Node.js 20 + Express
- Firebase Functions (compatible build)
- Firebase Admin (token verification)
- Vitest + Supertest (API tests)

---

## Architecture (High-level)

- **UI layer:** React components (Day/Week grid, sidebar, modals)
- **Server state:** React Query (`queries` + `mutations`), cache invalidation after CRUD operations
- **Client auth:** Firebase Auth (ID token)
- **API layer:** Axios client attaches Bearer token for secured endpoints
- **Backend:** Express REST API with auth middleware verifying Firebase ID token
- **CORS:** restricted by `ALLOWED_ORIGINS`

---

## Monorepo Structure

This repository uses **npm workspaces**:

- `client/` — React application
- `server/` — Express REST API (Functions-compatible)

---

## Requirements

- **Node.js 20** (server is pinned to Node 20)
- npm

---

## Quick Start (Local)

### 1) Install dependencies

From the repository root:

```bash
npm install

2) Create environment files (no secrets in repo)

Create these files locally:

client/.env.local
# Local API configuration
VITE_API_BASE_URL=/api
VITE_API_HOST=http://localhost
VITE_API_PORT=4000

# Firebase client config (public identifiers; do not store private keys here)
VITE_FIREBASE_API_KEY=YOUR_VALUE
VITE_FIREBASE_AUTH_DOMAIN=YOUR_VALUE
VITE_FIREBASE_PROJECT_ID=YOUR_VALUE
VITE_FIREBASE_STORAGE_BUCKET=YOUR_VALUE
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_VALUE
VITE_FIREBASE_APP_ID=YOUR_VALUE

server/.env.local
PORT=4000
NODE_ENV=development

# Auth mode
BYPASS_AUTH=false

# Dev tokens (local only)
DEV_TOKEN=YOUR_VALUE
DEV_BEARER_TOKEN=YOUR_VALUE

# Firebase project
FIREBASE_PROJECT_ID=YOUR_VALUE

# Service account JSON MUST be stored locally (never commit)
FIREBASE_SERVICE_ACCOUNT_JSON=YOUR_JSON_VALUE

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://calendar-dev-f58f5.web.app

Important: FIREBASE_SERVICE_ACCOUNT_JSON is sensitive and must never be committed.


Run Development (Client + Server)

From the repository root:
npm run dev


This starts:

Client (Vite)

Server (Express, default PORT=4000)

Open in Browser
http://localhost:5173

Run Separately
Client only
npm run dev:client

Open:

http://localhost:5173

Server only
npm run dev:server


Local API:

http://localhost:4000/api

Build

From the repository root:
npm run build

Start (Production build, local)

From the repository root:
npm start

This runs the compiled server from server/dist.

Tests
Client tests
npm --workspace client run test

Server tests
npm --workspace server run test

Code Quality

From the repository root:

npm run lint
npm run format

Security Notes

Do not commit .env.local files.

Never commit service account credentials (FIREBASE_SERVICE_ACCOUNT_JSON).

If a private key was ever exposed, rotate it immediately in Google Cloud / Firebase and remove it from git history.

