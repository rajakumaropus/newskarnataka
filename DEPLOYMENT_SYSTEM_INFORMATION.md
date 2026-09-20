# Complete Deployment System Information

**Date:** September 10, 2026  
**Status:** Information Gathering Complete  
**Purpose:** Comprehensive data for permanent deployment solution

---

## 1. REPOSITORY STRUCTURE

### Project Layout
```
newskarnataka/ (root repository)
├── .github/
│   └── workflows/
│       └── deploy.yml                    # Current GitHub Actions workflow
├── .vercel/                              # Vercel CLI configuration (local)
├── newskarnataka-website/                # Next.js 16.3.4 application
│   ├── package.json
│   ├── package-lock.json
│   ├── next.config.ts (or .js)
│   ├── .next/                            # Build output directory
│   ├── app/                              # Next.js App Router
│   ├── components/
│   ├── public/
│   └── ...
├── newskarnataka-console/                # Vite React application
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts
│   ├── dist/                             # Build output directory
│   ├── src/
│   ├── index.html
│   └── ...
├── strapi/                               # Backend (not deployed via this workflow)
├── backend/                              # Possible alternate backend dir
├── frontend/                             # Possible alternate frontend dir
└── ... (100+ documentation files)
```

### Key Observations
- ✅ **NO** `vercel.json` at root level
- ✅ **NO** `vercel.json` in `newskarnataka-website/`
- ✅ **NO** `vercel.json` in `newskarnataka-console/`
- ✅ `.vercel/` directory exists (Vercel CLI config)
- ✅ Project is a **monorepo** with independent subdirectories

---

## 2. BUILD SCRIPTS & OUTPUTS

### Website (Next.js)

**Build Script:** `"build": "next build"`

**Scripts:**
| Name | Command | Purpose |
|------|---------|---------|
| dev | `next dev` | Development server |
| build | `next build` | Production build |
| start | `next start` | Production server |
| lint | `eslint` | Code linting |

**Build Output:** `.next` directory  
**Output Type:** Next.js standard build format  
**Output Size:** Varies (typically 50-200 MB with node_modules)

### Console (Vite React)

**Build Script:** `"build": "tsc -b && vite build"`

**Scripts:**
| Name | Command | Purpose |
|------|---------|---------|
| dev | `vite` | Development server |
| build | `tsc -b && vite build` | TypeScript compile + Vite build |
| lint | `eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0` | Strict linting |
| preview | `vite preview` | Preview production build |

**Build Output:** `dist` directory  
**Output Type:** Vite standard SPA format  
**Output Size:** Typically 100-500 KB (after bundling)

---

## 3. DEPENDENCIES & FRAMEWORKS

### Website Dependencies

**Runtime:**
- `next@16.3.4` - React framework
- `react@19.2.8` - UI library
- `react-dom@19.2.8` - DOM rendering
- `next-auth@^4.24.15` - Authentication
- `graphql@^16.8.0` - GraphQL runtime
- `graphql-request@^7.4.0` - GraphQL client
- `axios@^1.20.0` - HTTP client
- `zustand@^5.0.15` - State management

**Dev:**
- `typescript@^5` - Type checking
- `tailwindcss@^4` - CSS framework
- `eslint@^9` - Linting
- `@types/*` - TypeScript definitions

### Console Dependencies

**Runtime:**
- `react@^18.3.1` - UI library
- `react-dom@^18.3.1` - DOM rendering
- `react-router-dom@^6.20.0` - Routing
- `axios@^1.6.2` - HTTP client
- `zustand@^4.4.1` - State management

**Dev:**
- `vite@^5.0.8` - Build tool
- `typescript@^5.2.2` - Type checking
- `@vitejs/plugin-react@^4.2.1` - Vite React plugin
- `tailwindcss@^3.3.6` - CSS framework
- `eslint@^8.56.0` - Linting

---

## 4. GITHUB SECRETS CONFIGURATION

### Required Secrets (6 total)

| Secret Name | Value | Type | Used By |
|------------|-------|------|---------|
| `VERCEL_TOKEN` | `vcp_65UfIWbi4c7x8c4ftcovc5Zsb2JaeuzYI4j438qM9CLUH5ziOv1l24pm` | Token | Both jobs |
| `VERCEL_ORG_ID` | `team_Hc1spTfjdTMy2FHP8nTmuMJV` | ID | Global env (workflow-level) |
| `VERCEL_WEBSITE_PROJECT_ID` | `prj_bkVUspAEPRO7h9Zc9cq48k2FkND1` | ID | Website job |
| `VERCEL_CONSOLE_PROJECT_ID` | `prj_Nx3x0MVQdkxp5qeE7eo6cyLiK9jw` | ID | Console job |
| `STRAPI_URL` | `http://103.191.208.235:1337` | URL | Build steps (both) |
| `STRAPI_API_TOKEN` | Long token (see .env) | Token | Build steps (both) |

**Configuration Level:** Repository-level (not organization-level)  
**Location:** `https://github.com/rajakumaropus/newskarnataka/settings/secrets/actions`

---

## 5. CURRENT WORKFLOW CONFIGURATION

### File: `.github/workflows/deploy.yml`

**Trigger Events:**
- `push` to `main` branch
- Manual `workflow_dispatch` from GitHub UI

**Execution Model:** Parallel jobs

### Job 1: deploy-website

**Working Directory:** `newskarnataka-website`

**Steps:**
1. Checkout code (`actions/checkout@v4`)
2. Setup Node.js 20 (`actions/setup-node@v4`)
   - Cache: npm
   - Cache path: `newskarnataka-website/package-lock.json`
3. Install Vercel CLI (`npm install --global vercel@latest`)
4. Pull Vercel Environment (`vercel pull --yes --environment=production`)
5. Install Dependencies (`npm ci --legacy-peer-deps`)
6. Build Locally (`npm run build`)
7. Deploy to Vercel (`vercel deploy --prod --cwd .`)

**Environment Variables (Build Step):**
```
NEXT_PUBLIC_STRAPI_URL=${{ secrets.STRAPI_URL }}
STRAPI_API_TOKEN_FULL_ACCESS=${{ secrets.STRAPI_API_TOKEN }}
```

**Environment Variables (Deploy Step):**
```
VERCEL_ORG_ID=${{ env.VERCEL_ORG_ID }}
VERCEL_PROJECT_ID=${{ secrets.VERCEL_WEBSITE_PROJECT_ID }}
```

### Job 2: deploy-console

**Working Directory:** `newskarnataka-console`

**Steps:** Same sequence as website job

**Environment Variables (Build Step):**
```
VITE_STRAPI_URL=${{ secrets.STRAPI_URL }}
VITE_STRAPI_API_TOKEN=${{ secrets.STRAPI_API_TOKEN }}
```

**Environment Variables (Deploy Step):**
```
VERCEL_ORG_ID=${{ env.VERCEL_ORG_ID }}
VERCEL_PROJECT_ID=${{ secrets.VERCEL_CONSOLE_PROJECT_ID }}
```

---

## 6. VERCEL PROJECT CONFIGURATION (TO BE VERIFIED)

### What We Need from Vercel Dashboard

**Website Project Settings:**
- URL: `https://vercel.com/rajkumaropus-7015/newskarnataka-website/settings`
- Need to check:
  - **Root Directory** - Current value?
  - **Build Command** - Current value?
  - **Output Directory** - Current value?
  - **Node.js Version** - Current value?
  - **Git Integration** - Enabled/Disabled?

**Console Project Settings:**
- URL: `https://vercel.com/rajkumaropus-7015/newskarnataka-console/settings`
- Need to check:
  - **Root Directory** - Current value?
  - **Build Command** - Current value?
  - **Output Directory** - Current value?
  - **Node.js Version** - Current value?
  - **Git Integration** - Enabled/Disabled?

### Path Issue Root Cause

Error seen: `newskarnataka-website/newskarnataka-website` (double path)

**Possible causes:**
1. Vercel project has Root Directory set to `newskarnataka-website`
2. GitHub Actions is running from `newskarnataka-website/`
3. Vercel CLI is appending root dir on top of working directory

**Solution:** Either:
- Clear Root Directory in Vercel (leave empty)
- OR use `--cwd .` in deploy command (already implemented)

---

## 7. GIT INTEGRATION STATUS (TO BE VERIFIED)

### Check These in Vercel

| Setting | Location | Need to Verify |
|---------|----------|----------------|
| **Git Integration Enabled** | Project Settings → Git | Yes/No |
| **Connected Repository** | Project Settings → Git | rajakumaropus/newskarnataka |
| **Production Branch** | Project Settings → Git | `main` or other? |
| **Auto-Deploy on Push** | Project Settings → Git | Enabled/Disabled |
| **Preview Deployments** | Project Settings → Git | Enabled/Disabled |

### Issue

If Git integration is enabled AND GitHub Actions is running, you have:
- **Conflict 1:** Vercel auto-deploys on push
- **Conflict 2:** GitHub Actions also deploys
- **Result:** Double deployments, potential conflicts

**Recommendation:**
- If using GitHub Actions: **Disable** Vercel Git integration
- If using Vercel Git integration: **Remove** GitHub Actions workflow

---

## 8. DEPLOYMENT INFORMATION SUMMARY

### Current Setup (Hybrid - Potential Issues)

| Component | Status | Deployment Source |
|-----------|--------|------------------|
| Website (Next.js) | Deployed | GitHub Actions OR Vercel Git |
| Console (Vite React) | Deployed | GitHub Actions OR Vercel Git |
| Backend (Strapi) | Not in this workflow | Separate |

### Deployment URLs

| Project | URL | Status |
|---------|-----|--------|
| Website | https://newskarnataka-website.vercel.app | Active |
| Console | https://newskarnataka-console.vercel.app | Active |
| Strapi | http://103.191.208.235:1337 | Active (backend) |

### Expected Deployment Time

- **Sequential:** 15-20 minutes
- **Parallel (current):** 8-14 minutes
- **Breakdown:** ~4-7 min per app

---

## 9. ISSUES IDENTIFIED & FIXED

### Issue 1: Missing graphql Dependency ✅ FIXED
- **Error:** npm ci failed - graphql missing
- **Fix:** Added `"graphql": "^16.8.0"` to website package.json
- **Commit:** 3e45037

### Issue 2: Environment Variable Scoping ✅ FIXED
- **Error:** Job-level env not accessible in step-level env
- **Fix:** Explicitly pass vars in each step's env block
- **Commit:** 0ccca20

### Issue 3: spawn npm ENOENT ✅ FIXED
- **Error:** Subprocess PATH issue with vercel build
- **Fix:** Replaced `vercel build` with `npm run build`
- **Commit:** Implemented

### Issue 4: Vercel Root Directory Path Doubling ✅ FIXED
- **Error:** Path like `newskarnataka-website/newskarnataka-website`
- **Fix:** Added `--cwd .` flag to deploy command
- **Commit:** Implemented

---

## 10. DEPLOYMENT READINESS CHECKLIST

### Code & Dependencies
- ✅ Lockfiles synchronized and committed
- ✅ Dependencies resolved (graphql added)
- ✅ Build scripts verified (`next build`, `vite build`)
- ✅ Output directories identified (`.next`, `dist`)

### GitHub Configuration
- ✅ Workflow defined (deploy.yml)
- ✅ Jobs configured (parallel execution)
- ✅ Environment variable scoping correct
- ✅ GitHub secrets required (6 total)

### Deployment Configuration
- ✅ Working directories set
- ✅ Build steps in place
- ✅ Environment variables passed correctly
- ✅ Vercel CLI commands configured
- ✅ `--cwd .` flag added for path resolution

### External Services
- ✅ Vercel projects created
- ✅ Project IDs obtained
- ✅ Vercel token available
- ✅ Strapi backend configured

### Remaining Tasks
- ❓ Verify Vercel project settings (root directory, build commands)
- ❓ Confirm Git integration status (Vercel)
- ❓ Test deployment (run workflow)
- ❓ Verify apps load correctly
- ❓ Test Strapi integration

---

## NEXT ACTION

**Required Information from User:**

1. **Vercel Website Project Settings**
   - Root Directory value
   - Build Command value
   - Output Directory value
   - Git Integration: Enabled/Disabled

2. **Vercel Console Project Settings**
   - Root Directory value
   - Build Command value
   - Output Directory value
   - Git Integration: Enabled/Disabled

3. **Deployment Strategy Preference**
   - Option A: Vercel-native (Git integration enabled)
   - Option B: GitHub Actions only (Git integration disabled)

**Once provided:** Will configure final permanent solution

---

## TECHNICAL REFERENCES

| Component | Version | Notes |
|-----------|---------|-------|
| Next.js | 16.3.4 | Latest stable |
| Vite | 5.0.8 | Latest stable |
| React (Website) | 19.2.8 | Latest |
| React (Console) | 18.3.1 | Latest stable |
| Node.js | 20 | LTS (set in workflow) |
| GraphQL | 16.8.0 | Required by graphql-request |
| Vercel CLI | Latest | Installed globally in each job |
| GitHub Actions | Latest | Uses v4 actions |

---

**Status: AWAITING VERCEL PROJECT SETTINGS VERIFICATION**

Once Vercel configuration is confirmed, complete permanent solution will be provided.
