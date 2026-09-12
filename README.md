# SwapCraft — Peer Skill Swap & Knowledge Exchange

SwapCraft is a community platform for trading skills without money. Post what you can teach,
find someone who wants to learn it, and swap 1-on-1 — in person or online. Teaching earns
**Karma Credits** (1 hour taught = 1 credit) that can be spent learning from anyone else.

## How it works

- **Discover** — browse community skill listings with search, category / format / level
  filters, wishlist, and sorting. Everything is stored locally until you sign in.
- **AI Matchmaker** — the assistant matches what you teach against what others want to
  learn and scores two-way compatibility, with a Karma fallback when there is no direct match.
- **Circles** — group workshops (e.g. weekend sourdough, React code review) you can join,
  host, and discuss.
- **Swaps** — propose a swap on any listing, accept / decline incoming proposals, schedule
  sessions, mark them complete (earns +1 Karma), and leave reviews.
- **Messages** — direct chat per swap partner, with listing context attached.
- **Credits** — the Karma ledger explains the zero-money model and tracks your balance.
- **Profile / My Posts** — edit your profile and avatar, manage your listings, circles,
  and sent proposals.

### AI Concierge

The chat assistant has three tiers, tried in order:

1. **Server backend** (`POST /api/ai/chat`, streaming at `/api/ai/chat/stream`) — runs the
   tool pipeline (`find_active_skills`, `create_skill_for_user`, `navigate_platform`) and,
   when `GEMINI_API_KEY` is set, refines answers with Gemini function calling.
2. **Offline engine** (`src/services/aiAssistantService.ts`) — the same intents and reply
   shapes, generated locally from the live listings.
3. The UI streams partial results (thinking → tool calls → content) so it feels live either way.

### Data & auth

- **No backend configured:** the app runs on curated sample data (`src/data/mockData.ts`)
  persisted per-browser in `localStorage`. Sign-in uses an email OTP flow; without Supabase
  it runs in demo mode.
- **Supabase configured:** listings, proposals, circles, and profiles sync to Postgres
  (schema in `src/lib/supabase.ts` → `SUPABASE_SQL_SCHEMA`), with realtime subscriptions
  that refresh the UI when data changes.

## Run locally

Prerequisites: Node.js 18+.

```bash
npm install
npm run dev        # frontend only (http://localhost:5173), AI uses offline engine
```

Full stack with the AI backend (needs `GEMINI_API_KEY` in `.env`):

```bash
npm run dev:server # Express + Vite on http://localhost:3000, serves /api/*
```

`npm run dev` proxies `/api` to `http://localhost:3000`, so run both together for the
full experience.

## Environment variables

Copy `.env.example` to `.env`. All optional:

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Enables Gemini-flavored AI answers (serverless on Vercel, Express locally). Without it, the offline engine answers. |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Enables shared Postgres persistence + realtime. Without them, data stays in the browser. |

## Deploy to Vercel

1. Push this repo to GitHub and import it in Vercel (framework preset: **Vite**).
2. Build command `npm run build`, output directory `dist` (already set in `vercel.json`).
3. Add environment variables in the Vercel dashboard if you want them:
   `GEMINI_API_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
4. Deploy. Client routes fall back to `index.html`; `/api/*` is served by the
   serverless functions in `api/`.

Supabase tables: run the `SUPABASE_SQL_SCHEMA` SQL (exported from `src/lib/supabase.ts`)
once in the Supabase SQL editor, including the realtime publication lines.

## Project structure

```
src/
  pages/        # route screens (lazy-loaded): Discover, Matchmaker, Circles, Swaps, Messages, Credits, Profile, MyPosts
  components/   # cards, modals, nav, heroes, AI chat UI
  context/      # AIChatContext (chat state, streaming, actions)
  services/     # aiAssistantService (backend client + offline fallback engine)
  lib/          # supabase client + DB helpers + SQL schema
  data/         # themes, sample listings/users/circles
  types/        # shared TypeScript types
api/
  _lib/swapAI.ts       # AI tool pipeline shared by server + serverless
  ai/chat.ts           # POST /api/ai/chat (Vercel function)
  ai/chat/stream.ts    # POST /api/ai/chat/stream, SSE (Vercel function)
server.ts              # local Express dev server (optional, not used on Vercel)
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Vite frontend only |
| `npm run dev:server` | Express + Vite + AI backend on :3000 |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run lint` | Type-check (`tsc --noEmit`) |
| `npm run preview` | Preview the production build |
