# 🎯 FRAMEWORK DECISION - HYBRID APPROACH
## NewsKarnataka Project Architecture Decision

**Date:** September 2026  
**Decision:** Approved hybrid approach  
**Status:** ✅ CONFIRMED

---

## DECISION SUMMARY

```
┌────────────────────────────────────────────────────────┐
│           NEWSKARNATAKA FRAMEWORK STACK                │
├────────────────────────────────────────────────────────┤
│                                                        │
│  PUBLIC WEBSITE                                        │
│  ├─ Framework: Next.js 14 + React 18                 │
│  ├─ Type: Server-Side Rendering (SSR) + Static Gen  │
│  ├─ Purpose: newskarnataka.com (public news site)    │
│  ├─ Why: Best SEO, fast page loads, great for news  │
│  └─ Status: ✅ PRIMARY FOCUS                         │
│                                                        │
│  AI CONSOLE (Admin Dashboard)                         │
│  ├─ Framework: React 18 + Vite                       │
│  ├─ Type: Single Page Application (SPA)              │
│  ├─ Purpose: Editor dashboard (internal use)         │
│  ├─ Why: Real-time updates, interactive, lightweight │
│  └─ Status: ✅ SECONDARY COMPONENT                   │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## DETAILED COMPARISON

### Public Website: Next.js 14 + React 18

**Why Next.js?**
- ✅ **SEO Optimized:** Server-side rendering for better search rankings
- ✅ **Fast Pages:** Static generation (SSG) + incremental static regeneration
- ✅ **Image Optimization:** Built-in image component with optimization
- ✅ **API Routes:** Can create backend endpoints if needed
- ✅ **Deployment:** Easy deployment to Vercel or any Node.js host
- ✅ **Performance:** Automatic code splitting and lazy loading

**Best For:**
- News websites (content-heavy)
- Public-facing applications
- SEO-critical pages
- Content that needs to be discoverable

**Use Cases:**
```
✅ Homepage (newskarnataka.com)
✅ Article detail pages (newskarnataka.com/articles/slug)
✅ Category pages (newskarnataka.com/category/politics)
✅ Search results (newskarnataka.com/search?q=keyword)
✅ Location-based pages (newskarnataka.com/location/bangalore)
```

---

### AI Console: React 18 SPA (with Vite)

**Why React SPA + Vite?**
- ✅ **Real-time Updates:** WebSocket support for live content queue
- ✅ **Interactive:** Responsive UI for drag-and-drop, real-time edits
- ✅ **Fast Development:** Vite provides instant HMR (Hot Module Reload)
- ✅ **Lightweight:** No server-side rendering overhead needed
- ✅ **Simple Deployment:** Can be deployed as static files
- ✅ **Internal Use Only:** SEO not a concern for admin dashboard

**Best For:**
- Admin dashboards
- Real-time applications
- Internal tools
- Applications with frequent user interactions

**Use Cases:**
```
✅ Content Queue Dashboard (drag-and-drop articles)
✅ Article Editor (WYSIWYG editor with AI suggestions)
✅ Analytics Dashboard (real-time charts)
✅ Source Management (add/edit/manage news sources)
✅ Settings Panel (console configuration)
```

---

## TECHNOLOGY STACK COMPARISON

| Aspect | Next.js (Public) | React SPA (Console) |
|--------|-----------------|-------------------|
| **Build Tool** | Next.js built-in | Vite |
| **Rendering** | SSR/SSG | Client-side |
| **Bundle Size** | Larger (SSR) | Smaller (SPA) |
| **SEO** | Excellent ⭐⭐⭐⭐⭐ | Poor (internal) |
| **Real-time** | Good (WebSocket) | Excellent ⭐⭐⭐⭐⭐ |
| **Dev Speed** | Good | Excellent (Vite) |
| **Deployment** | Vercel, AWS, etc. | Static hosting, S3 |
| **Learning Curve** | Medium | Easy |
| **File Size** | 100KB+ | 50KB+ |

---

## PROJECT STRUCTURE

```
newskarnataka-monorepo/
│
├── apps/
│   │
│   ├── public-website/           # Next.js (Public Site)
│   │   ├── src/app/
│   │   ├── src/components/
│   │   ├── public/
│   │   ├── next.config.js
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── ai-console/               # React + Vite (Admin Dashboard)
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── hooks/
│       │   ├── store/
│       │   └── main.tsx
│       ├── vite.config.ts
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── ui/                        # Shared UI components
│   ├── types/                     # Shared TypeScript types
│   ├── api-client/                # Shared API client
│   └── config/                    # Shared configuration
│
├── shared/
│   ├── hooks/
│   ├── utils/
│   ├── constants/
│   └── services/
│
├── .github/
│   └── workflows/
│
├── .env.example
├── .gitignore
├── package.json                   # Root package.json (monorepo)
├── pnpm-workspace.yaml            # or yarn workspaces
└── README.md
```

---

## IMPLEMENTATION STRATEGY

### Phase 1: Setup Both Projects (Week 1)

**Task #1A: Set up Next.js Public Website**
- ✅ Create Next.js 14 project
- ✅ Configure TypeScript, Tailwind CSS
- ✅ Create project structure
- ✅ Set up base components

**Task #1B: Set up React + Vite AI Console**
- ✅ Create React + Vite project
- ✅ Configure TypeScript, Tailwind CSS
- ✅ Create project structure
- ✅ Set up admin components

---

### Phase 2: Shared Code (Week 2)

**Create shared packages:**
- `packages/types/` - Shared TypeScript types (Article, User, etc.)
- `packages/api-client/` - Shared Apollo Client for GraphQL
- `packages/config/` - Environment configs, constants
- `shared/hooks/` - Shared custom hooks
- `shared/utils/` - Helper functions

---

### Phase 3: Integration (Weeks 3-4)

**Connect both apps to:**
- Strapi backend
- GraphQL API
- Analytics services
- Real-time features

---

## DEPLOYMENT STRATEGY

### Public Website (Next.js)

```
Development:
  npm run dev:public → http://localhost:3000

Production Build:
  npm run build:public
  npm run start:public

Deployment Options:
  ✅ Vercel (recommended for Next.js)
  ✅ AWS Amplify
  ✅ Docker + Kubernetes
  ✅ Netlify (static export mode)
```

### AI Console (React + Vite)

```
Development:
  npm run dev:console → http://localhost:5173

Production Build:
  npm run build:console
  → outputs static files to dist/

Deployment Options:
  ✅ AWS S3 + CloudFront
  ✅ Firebase Hosting
  ✅ Netlify
  ✅ Vercel (as SPA)
  ✅ Internal server (static files)
```

---

## SHARED DEPENDENCIES

Both projects will use:

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.x",
  "tailwindcss": "^3.x",
  "@apollo/client": "^3.x",
  "zustand": "^4.x",
  "react-hook-form": "^7.x",
  "zod": "^3.x",
  "axios": "^1.x",
  "socket.io-client": "^4.x"
}
```

---

## GIT STRATEGY

### Monorepo Setup

```bash
# Root level
pnpm install          # Install all dependencies

# Project specific
pnpm --filter public-website run dev
pnpm --filter ai-console run dev

# Build all
pnpm run build:all
```

### Branch Strategy

```
main (production)
  ↑
staging (pre-production testing)
  ↑
develop (development)
  ↑
feature/next-js-homepage
feature/react-console-dashboard
feature/ai-validation-engine
```

---

## DEVELOPMENT WORKFLOW

### For Public Website (Next.js)

```bash
# 1. Start development server
cd apps/public-website
npm run dev

# 2. Open http://localhost:3000

# 3. Make changes in src/app/ or src/components/

# 4. Changes auto-reload (Hot Module Reload)

# 5. Build for production
npm run build

# 6. Preview production build
npm run start
```

### For AI Console (React + Vite)

```bash
# 1. Start development server
cd apps/ai-console
npm run dev

# 2. Open http://localhost:5173

# 3. Make changes in src/

# 4. Changes auto-reload (Vite HMR)

# 5. Build for production
npm run build

# 6. Preview production build
npm run preview
```

---

## DECISION JUSTIFICATION

### Why NOT pure Next.js for both?

```
❌ Next.js for Admin Dashboard:
  - Overkill (SSR not needed for internal tool)
  - Slower hot reload during development
  - More complex configuration
  - Larger bundle size
  - Unnecessary server-side rendering
```

### Why NOT pure React SPA for public site?

```
❌ React SPA for Public Website:
  - Poor SEO (client-side rendering)
  - Slower initial page loads
  - Not discoverable by search engines
  - Poor Core Web Vitals
  - Bad for content-heavy sites
```

### Why Hybrid?

```
✅ Best of Both Worlds:
  - Public: Optimized for SEO & performance (Next.js)
  - Admin: Optimized for real-time & interactivity (React)
  - Shared: Common components & utilities
  - Maintainable: Clear separation of concerns
  - Scalable: Easy to expand both apps independently
```

---

## MIGRATION PATH

If we need to change later:

```
Scenario 1: Move Admin to full Next.js
  → Easy migration (both are React-based)
  → Just reuse components

Scenario 2: Move Public to pure React SPA
  → Lose SEO benefits
  → Revert if needed

Scenario 3: Add mobile app (Flutter/React Native)
  → Use shared API client
  → Reuse business logic
  → Different UI layer
```

---

## RECOMMENDATION

✅ **APPROVED: Proceed with Hybrid Approach**

- **Public Website:** Next.js 14 + React 18
- **AI Console:** React 18 + Vite
- **Setup Time:** ~2-3 hours
- **Team:** 1-2 developers can set up both in parallel

---

## NEXT STEPS

1. ✅ Task #1A: Set up Next.js project (30 min)
2. ✅ Task #1B: Set up React + Vite project (30 min)
3. ✅ Task #2: Configure shared packages (1 hour)
4. ✅ Task #3: Connect to Strapi backend (1 hour)
5. ✅ Task #4: Set up CI/CD pipelines (1 hour)

**Total: ~4 hours to have both projects running locally**

---

**Status: ✅ DECISION LOCKED**

Framework decision finalized and ready for implementation.

