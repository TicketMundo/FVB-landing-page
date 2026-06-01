# Ticketmundo Landing Admin

Internal admin tool for managing event landing page configurations on Ticketmundo. Reads and writes JSON config files stored on Digital Ocean Spaces (S3-compatible), providing a UI to manage event details, functions, galleries, sponsors, and more.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS (dark mode via `class`) |
| Theme toggle | next-themes |
| Forms | React Hook Form + Zod |
| Object storage | @aws-sdk/client-s3 (Digital Ocean Spaces) |
| Auth | JWT via jsonwebtoken (Node) + Web Crypto (Edge middleware) |
| Icons | lucide-react |

---

## Prerequisites

- Node.js 18 or later
- npm 9 or later
- Access credentials for a Digital Ocean Spaces bucket

---

## Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd tm-landing-admin

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.local.example .env.local
# Edit .env.local and fill in the required values (see table below)

# 4. Start development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DO_SPACES_KEY` | Yes | Digital Ocean Spaces access key ID |
| `DO_SPACES_SECRET` | Yes | Digital Ocean Spaces secret access key |
| `DO_SPACES_ENDPOINT` | Yes | Spaces endpoint URL (e.g. `https://nyc3.digitaloceanspaces.com`) |
| `DO_SPACES_BUCKET` | Yes | Bucket name |
| `DO_SPACES_REGION` | Yes | Bucket region (e.g. `nyc3`) |
| `DO_SPACES_PUBLIC_URL` | No | Custom CDN base URL. If empty, the public URL is derived as `https://{bucket}.{endpoint-host}/{key}` |
| `CORE_API_URL` | Yes | Base URL of the Ticketmundo core API (used for user auth validation) |
| `NEXTAUTH_SECRET` | Yes | Secret used to sign/verify JWT session tokens (min 32 chars recommended) |
| `NEXTAUTH_URL` | Yes | Full base URL of this app (e.g. `http://localhost:3000`) |

---

## Folder Structure

```
Landing-FIBA/
├── app/                        # Next.js App Router
│   ├── globals.css             # Global Tailwind base styles
│   ├── layout.tsx              # Root layout (ThemeProvider, ToastProvider)
│   └── admin/                  # Protected admin pages (behind middleware)
│       ├── login/              # Login page (public)
│       └── [eventoId]/         # Per-event editor pages
├── components/
│   ├── providers/              # ThemeProvider, ToastProvider
│   └── ui/                     # Reusable Tailwind components
├── lib/
│   ├── types.ts                # TypeScript interfaces (EventoConfig, Funcion, etc.)
│   ├── schemas.ts              # Zod validation schemas
│   ├── s3-client.ts            # DO Spaces helpers (read/write/upload/list)
│   ├── jwt.ts                  # JWT sign/verify for Node.js API routes
│   ├── jwt-edge.ts             # JWT verify using Web Crypto (Edge middleware)
│   └── jwt-constants.ts        # Shared constants (COOKIE_NAME)
├── middleware.ts               # Auth middleware — protects /admin/* routes
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── .env.local.example
```

---

## Digital Ocean Spaces Structure

All event data is stored under a consistent key prefix:

```
eventos/
└── {eventoId}/
    ├── config.json             # Live landing page config (public-read)
    ├── backups/
    │   └── config.bk.{iso-timestamp}.json   # Backup before each save
    └── assets/
        └── {filename}          # Uploaded images and other media
```

- `config.json` is served publicly (ACL: public-read, Cache-Control: no-cache).
- Asset files are served publicly with long-lived cache headers.
- Backups use ISO 8601 timestamps so they sort chronologically.

---

## Authentication Flow

1. User submits email + password at `/admin/login`.
2. API route `POST /api/auth/login` validates credentials against `CORE_API_URL`.
3. On success, a signed JWT (`HS256`, 8h expiry) is set as an `HttpOnly` cookie named `tm-admin-token`.
4. `middleware.ts` runs on every `/admin/*` request (Edge runtime). It reads the cookie, verifies the JWT using Web Crypto (`jwt-edge.ts`), and redirects unauthenticated requests to `/admin/login`.
5. API routes in the Node.js runtime use `lib/jwt.ts` (`jsonwebtoken`) for verification.

The split between `jwt-edge.ts` (Web Crypto) and `jwt.ts` (jsonwebtoken) is intentional: Next.js middleware runs on the Edge runtime where Node.js built-ins are unavailable.

---

## Build & Deploy

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Production build
npm run build

# Start production server
npm start
```

For deployment on a Node.js host (e.g., a VPS or DigitalOcean App Platform), set all environment variables in the platform's config panel before building.

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Next.js development server with HMR |
| `npm run build` | Build production bundle |
| `npm start` | Start production server (requires prior build) |
| `npm run lint` | Run ESLint via Next.js lint config |
| `npm run typecheck` | Run TypeScript compiler without emitting files |
