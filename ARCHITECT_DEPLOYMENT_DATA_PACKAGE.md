# NewsKarnataka Deployment Architecture Data Package
**Prepared For:** Senior Solution Architect  
**Date:** September 10, 2026  
**Status:** Ready for Architecture Review

---

## EXECUTIVE SUMMARY

This document provides comprehensive technical data for designing a production-grade `deploy.yml` GitHub Actions workflow. The project deploys two separate applications to Vercel from a monorepo structure.

**Project:** NewsKarnataka  
**Repository:** https://github.com/rajakumaropus/newskarnataka  
**Scope:** CI/CD workflow for Next.js website + Vite React console → Vercel  
**Previous Attempts:** 40+ iterations with partial/incomplete solutions  

---

## I. PROJECT STRUCTURE

### Repository Layout
```
newskarnataka/
├── .github/
│   └── workflows/
│       └── deploy.yml                    # ⚠️ Current workflow (FAILING)
├── .env                                  # Credentials (DO NOT COMMIT)
├── .env.example                          # Template
├── .gitignore
├── .vercel/                              # Vercel CLI config
├── newskarnataka-website/                # Next.js 16.3.4 application
│   ├── package.json
│   ├── package-lock.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── articles/[slug]/page.tsx
│   │   ├── categories/[slug]/page.tsx
│   │   └── search/page.tsx
│   └── components/
│       ├── ArticleCard.tsx
│       ├── CategoryFilter.tsx
│       ├── Pagination.tsx
│       └── SearchBar.tsx
├── newskarnataka-console/                # Vite React application
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── src/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── index.html
└── strapi/                               # Backend (Strapi CMS)
    └── ...
```

### Deployment Architecture
```
GitHub Repository (main branch)
    ↓
    Trigger: push to main
    ↓
    GitHub Actions Workflow (deploy.yml)
    ├─ Job 1: deploy-website
    │  ├── Checkout code
    │  ├── Setup Node 20
    │  ├── Install dependencies (npm ci)
    │  ├── Pull Vercel environment
    │  ├── Build (Vercel build)
    │  └── Deploy (Vercel deploy --prebuilt)
    │
    ├─ Job 2: deploy-console
    │  ├── Checkout code
    │  ├── Setup Node 20
    │  ├── Install dependencies (npm ci)
    │  ├── Pull Vercel environment
    │  ├── Build (Vercel build)
    │  └── Deploy (Vercel deploy --prebuilt)
    │
    └─ Output
        ├── Website: https://newskarnataka-website.vercel.app
        └── Console: https://newskarnataka-console.vercel.app
```

---

## II. APPLICATIONS SPECIFICATIONS

### A. Website Application (Next.js 16.3.4)

**Location:** `newskarnataka-website/`

**Framework:** Next.js 16.3.4 (App Router)  
**Runtime:** Node.js 20  
**Package Manager:** npm  

**Scripts:**
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

**Build Output:** `.next/` directory  
**Build Command:** `npm run build` or `next build`  
**Start Command:** `npm start` or `next start`  

**Dependencies (Production):**
```json
{
  "axios": "^1.20.0",          // HTTP client
  "graphql": "^16.8.0",        // GraphQL runtime
  "graphql-request": "^7.4.0", // GraphQL client
  "next": "16.3.4",            // Next.js framework
  "next-auth": "^4.24.15",     // Authentication
  "react": "19.2.8",           // React UI library
  "react-dom": "19.2.8",       // React DOM
  "zustand": "^5.0.15"         // State management
}
```

**DevDependencies:**
```json
{
  "@tailwindcss/postcss": "^4",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "eslint": "^9",
  "eslint-config-next": "16.3.4",
  "tailwindcss": "^4",
  "typescript": "^5"
}
```

**Lockfile:** `newskarnataka-website/package-lock.json`  
**Critical Note:** Lockfile must include all transitive dependencies including:
- `graphql@16.14.2` (required by graphql-request@^7.4.0)
- All picomatch versions resolved to `^4.0.7`

**Environment Variables (Build Time):**
```bash
NEXT_PUBLIC_STRAPI_URL=http://103.191.208.235:1337
STRAPI_API_TOKEN_FULL_ACCESS=<FULL_ACCESS_TOKEN>
```

**Vercel Configuration:**
- **Project ID:** `prj_bkVUspAEPRO7h9Zc9cq48k2FkND1`
- **Framework:** Next.js (auto-detected)
- **Build Command:** `next build`
- **Output Directory:** `.next`
- **Install Command:** `npm ci`
- **Node Version:** 20

---

### B. Console Application (Vite + React)

**Location:** `newskarnataka-console/`

**Framework:** Vite 5.0.8 + React 18.3.1  
**Runtime:** Node.js 20  
**Package Manager:** npm  
**Module Type:** ESM (`"type": "module"`)

**Scripts:**
```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "preview": "vite preview"
}
```

**Build Output:** `dist/` directory  
**Build Command:** `npm run build` (runs TypeScript compile + Vite build)  
**Start Command:** `npm run preview`

**Dependencies (Production):**
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.20.0",
  "axios": "^1.6.2",
  "zustand": "^4.4.1"
}
```

**DevDependencies:**
```json
{
  "@types/react": "^18.2.43",
  "@types/react-dom": "^18.2.17",
  "@typescript-eslint/eslint-plugin": "^6.15.0",
  "@typescript-eslint/parser": "^6.15.0",
  "@vitejs/plugin-react": "^4.2.1",
  "eslint": "^8.56.0",
  "eslint-plugin-react-hooks": "^4.6.0",
  "eslint-plugin-react": "^7.33.2",
  "typescript": "^5.2.2",
  "vite": "^5.0.8",
  "tailwindcss": "^3.3.6",
  "postcss": "^8.4.31",
  "autoprefixer": "^10.4.16"
}
```

**Lockfile:** `newskarnataka-console/package-lock.json`

**Environment Variables (Build Time):**
```bash
VITE_STRAPI_URL=http://103.191.208.235:1337
VITE_STRAPI_API_TOKEN=<FULL_ACCESS_TOKEN>
```

**Vercel Configuration:**
- **Project ID:** `prj_Nx3x0MVQdkxp5qeE7eo6cyLiK9jw`
- **Framework:** Vite (may need manual selection)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm ci`
- **Node Version:** 20

---

## III. VERCEL CREDENTIALS & CONFIGURATION

### Vercel Team Information
```
Organization Name: rajkumaropus-7015
Vercel Team ID: team_Hc1spTfjdTMy2FHP8nTmuMJV
Vercel User ID: DvbvnqeMdj9Xxxm5DVRfmYa9
```

### Project IDs
```
Website Project ID: prj_bkVUspAEPRO7h9Zc9cq48k2FkND1
Console Project ID: prj_Nx3x0MVQdkxp5qeE7eo6cyLiK9jw
```

### Vercel Token
```
Token: vcp_65UfIWbi4c7x8c4ftcovc5Zsb2JaeuzYI4j438qM9CLUH5ziOv1l24pm
Scope: Read+Write access to projects
Expiration: Active (check Vercel dashboard for renewal date)
```

### Deployment URLs
```
Website: https://newskarnataka-website.vercel.app
Console: https://newskarnataka-console.vercel.app
```

---

## IV. GITHUB SECRETS REQUIRED

**All secrets MUST be configured in GitHub repository settings at:**  
`https://github.com/rajakumaropus/newskarnataka/settings/secrets/actions`

| Secret Name | Value | Source | Required |
|---|---|---|---|
| `VERCEL_TOKEN` | `vcp_65UfIWbi4c7x8c4ftcovc5Zsb2JaeuzYI4j438qM9CLUH5ziOv1l24pm` | Vercel Account → Tokens | YES |
| `VERCEL_ORG_ID` | `team_Hc1spTfjdTMy2FHP8nTmuMJV` | Vercel Team Settings | YES |
| `VERCEL_WEBSITE_PROJECT_ID` | `prj_bkVUspAEPRO7h9Zc9cq48k2FkND1` | Vercel Project Settings | YES |
| `VERCEL_CONSOLE_PROJECT_ID` | `prj_Nx3x0MVQdkxp5qeE7eo6cyLiK9jw` | Vercel Project Settings | YES |
| `STRAPI_URL` | `http://103.191.208.235:1337` | Strapi Backend Location | YES |
| `STRAPI_API_TOKEN` | `a18e5bcb9bc06d3af2e522ba790c6e9465c33fa058e2e0283576faa242a35a8129280963a7b0c908f09d3e97cd557c527e669f742c23fcd96702692280ffd4ba58fd2ff8b4d26ae26f263d6f228ef53f335fa6d33fdf513a7e6402ed02269a4d328fb1712b212420726d3e6d8996a6ebeba63c37bffcbddffabfbf91` | Strapi Dashboard | YES |

---

## V. ENVIRONMENT VARIABLE MAPPING

### Website Application (Next.js)
```bash
# Build-time variables (set in GitHub Actions)
NEXT_PUBLIC_STRAPI_URL=${{ secrets.STRAPI_URL }}
STRAPI_API_TOKEN_FULL_ACCESS=${{ secrets.STRAPI_API_TOKEN }}

# Result: Available in browser as window.process.env.NEXT_PUBLIC_STRAPI_URL
```

### Console Application (Vite React)
```bash
# Build-time variables (set in GitHub Actions)
VITE_STRAPI_URL=${{ secrets.STRAPI_URL }}
VITE_STRAPI_API_TOKEN=${{ secrets.STRAPI_API_TOKEN }}

# Result: Available as import.meta.env.VITE_STRAPI_URL
```

### Vercel Deployment
```bash
# Vercel Environment Variables (set via GitHub Actions)
VERCEL_TOKEN=${{ secrets.VERCEL_TOKEN }}
VERCEL_ORG_ID=${{ secrets.VERCEL_ORG_ID }}
VERCEL_PROJECT_ID=${{ secrets.VERCEL_WEBSITE_PROJECT_ID }}  # Per job
```

---

## VI. BUILD & DEPLOYMENT WORKFLOW

### Workflow Trigger
```yaml
on:
  push:
    branches: [main]      # Deploy on push to main
  workflow_dispatch       # Manual trigger capability
```

### Execution Strategy

**Recommended Approach:** Parallel Deployment
- Job 1: Website deployment (runs in parallel with Job 2)
- Job 2: Console deployment (runs in parallel with Job 1)
- Expected Duration: 8-14 minutes total

**Alternative Approach:** Sequential Deployment
- Useful if: Resource constraints, cross-app dependencies, sequential validation required

### Build Process for Each Application

#### Website (Next.js)
```bash
# Step 1: Checkout code
git checkout <commit>

# Step 2: Setup environment
node --version  # Should be 20.x

# Step 3: Install dependencies
npm ci
# This uses package-lock.json for reproducible installs
# CRITICAL: package-lock.json must match package.json

# Step 4: Pull Vercel environment configuration
npx --yes vercel@latest pull \
  --yes \
  --environment=production \
  --token="<VERCEL_TOKEN>"
# Creates .vercel/ configuration directory

# Step 5: Build
npx --yes vercel@latest build --prod \
  --token="<VERCEL_TOKEN>"
# Produces: .vercel/output/
# Executes: "next build" → .next/

# Step 6: Deploy
npx --yes vercel@latest deploy \
  --prebuilt \
  --prod \
  --token="<VERCEL_TOKEN>"
# Uploads .vercel/output/ to Vercel edge network
```

#### Console (Vite React)
```bash
# Same steps as website, but:
# Step 5: Build
npx --yes vercel@latest build --prod \
  --token="<VERCEL_TOKEN>"
# Executes: "tsc -b && vite build" → dist/

# Step 6: Deploy
npx --yes vercel@latest deploy \
  --prebuilt \
  --prod \
  --token="<VERCEL_TOKEN>"
```

---

## VII. CRITICAL ISSUES & ROOT CAUSES

### Issue #1: npm ci Fails - Lockfile Out of Sync

**Error Message:**
```
npm ERR! code EUSAGE
npm ERR! Invalid: lock file's picomatch@2.3.2 does not satisfy picomatch@4.0.7
npm ERR! Missing: graphql@16.14.2 from lock file
```

**Root Cause:**
- `graphql-request@^7.4.0` has peer dependency on `graphql@14-16`
- `graphql` was NOT listed as direct dependency in `package.json`
- `npm ci` refuses to use inconsistent lockfile

**Solution:**
1. Add graphql as direct dependency to `newskarnataka-website/package.json`:
   ```json
   "dependencies": {
     "graphql": "^16.8.0",
     "graphql-request": "^7.4.0"
   }
   ```

2. Regenerate lockfile:
   ```bash
   cd newskarnataka-website
   rm -rf node_modules
   npm install
   npm ci  # Verify
   ```

3. Commit both files:
   ```bash
   git add package.json package-lock.json
   git commit -m "fix: add graphql dependency and regenerate lockfile"
   ```

4. Workflow will use `npm ci` with the fixed lockfile

**Verification:**
- Both lockfiles committed and up-to-date
- `npm ls graphql` shows graphql in dependency tree
- `npm ci` exits with code 0

### Issue #2: Working Directory Context

**Configuration:**
```yaml
defaults:
  run:
    working-directory: newskarnataka-website  # Per-job scope
```

**Impact:**
- All steps in job run relative to specified directory
- Cache paths must match: `newskarnataka-website/package-lock.json`
- Vercel commands run from app directory (not repo root)

### Issue #3: Node.js Version Incompatibility

**Requirement:** Node 20.x  
**Reason:** Next.js 16.3.4 requires Node 18+; Vite 5.0.8 requires Node 16+

**Configuration:**
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
```

**Deprecation Warning (Non-Breaking):**
```
node: The "NODE_OPTIONS=--openssl-legacy-provider" environment variable
is deprecated and will be removed in Node 24.
```

This warning is informational and does NOT cause deployment failure.

---

## VIII. VERCEL CLI DEPLOYMENT PATTERN

**Official Pattern (Recommended):**
```bash
# 1. Pull environment configuration from Vercel
npx --yes vercel@latest pull --yes --environment=production

# 2. Build locally
npx --yes vercel@latest build --prod

# 3. Deploy pre-built output
npx --yes vercel@latest deploy --prebuilt --prod
```

**Why This Pattern:**
- Separates concerns: build vs deployment
- Uses `--prebuilt` flag to skip rebuild on Vercel
- Reduces build time on Vercel servers
- Deterministic: Build happens once in CI, not twice (CI + Vercel)
- Cache efficient: Leverages GitHub Actions node_modules cache

**NOT Recommended Patterns:**
- Using `npm run build` then `vercel deploy` (causes double build)
- `vercel deploy --prod` without `--prebuilt` (wasteful)
- Global `npm install -g vercel` (fragile, downloads on every run)
- Custom build scripts (deviates from Vercel standards)

---

## IX. GITHUB ACTIONS CONFIGURATION CHECKLIST

### Secrets Setup
```
☐ VERCEL_TOKEN = vcp_65UfIWbi4c7x8c4ftcovc5Zsb2JaeuzYI4j438qM9CLUH5ziOv1l24pm
☐ VERCEL_ORG_ID = team_Hc1spTfjdTMy2FHP8nTmuMJV
☐ VERCEL_WEBSITE_PROJECT_ID = prj_bkVUspAEPRO7h9Zc9cq48k2FkND1
☐ VERCEL_CONSOLE_PROJECT_ID = prj_Nx3x0MVQdkxp5qeE7eo6cyLiK9jw
☐ STRAPI_URL = http://103.191.208.235:1337
☐ STRAPI_API_TOKEN = a18e5bcb9bc06d3af2e522ba790c6e9465c33fa058e2e0283576faa242a35a8129280963a7b0c908f09d3e97cd557c527e669f742c23fcd96702692280ffd4ba58fd2ff8b4d26ae26f263d6f228ef53f335fa6d33fdf513a7e6402ed02269a4d328fb1712b212420726d3e6d8996a6ebeba63c37bffcbddffabfbf91
```

### Node Setup
```
☐ Setup Node.js 20.x
☐ Enable npm cache: cache: npm
☐ Specify lockfile: cache-dependency-path: newskarnataka-website/package-lock.json
☐ Specify lockfile: cache-dependency-path: newskarnataka-console/package-lock.json
```

### Build Configuration
```
☐ Website build command: npx --yes vercel@latest build --prod
☐ Console build command: npx --yes vercel@latest build --prod
☐ Environment variables passed at build time
☐ --prod flag for production optimization
```

### Deployment Configuration
```
☐ Deploy command: npx --yes vercel@latest deploy --prebuilt --prod
☐ Use --prebuilt to skip Vercel rebuild
☐ Token passed securely via ${{ secrets.VERCEL_TOKEN }}
☐ Org ID set per job: env: VERCEL_ORG_ID
☐ Project ID set per job via secrets
```

---

## X. TESTING & VERIFICATION STRATEGY

### Pre-Deployment Testing (Local)

**1. Dependency Verification**
```bash
# Website
cd newskarnataka-website
npm ls graphql        # Should show graphql@16.x.x
npm ls picomatch      # Should show picomatch@4.0.7
npm ci --dry-run      # Verify lockfile consistency

# Console
cd ../newskarnataka-console
npm ci --dry-run
```

**2. Build Verification**
```bash
# Website
npm run build
ls -la .next/

# Console
npm run build
ls -la dist/
```

**3. Vercel CLI Simulation**
```bash
# Simulate workflow locally
npx --yes vercel@latest pull --yes --environment=production
npx --yes vercel@latest build --prod
ls -la .vercel/output/
```

### Post-Deployment Testing (Production)

**1. Website Health Check**
```bash
curl -I https://newskarnataka-website.vercel.app
# Should return: HTTP 200 OK
# Should have: Cache-Control headers
```

**2. Console Health Check**
```bash
curl -I https://newskarnataka-console.vercel.app
# Should return: HTTP 200 OK
```

**3. API Integration**
```bash
# Website should fetch from Strapi
curl "https://newskarnataka-website.vercel.app/api/articles"
# Should return: Strapi articles data

# Console should fetch from Strapi
curl "https://newskarnataka-console.vercel.app/api/health"
# Should return: 200 OK
```

---

## XI. COMMON PITFALLS & SOLUTIONS

| Pitfall | Symptom | Solution |
|---|---|---|
| Lockfile out of sync | `npm ci` fails with EUSAGE | Regenerate lockfile locally, commit both package.json + package-lock.json |
| Wrong working directory | Commands run from repo root instead of app dir | Set `defaults.run.working-directory` per job |
| Missing environment vars | Build succeeds but app can't connect to Strapi | Set `env:` block in build step, NOT in job |
| Global vercel install | Vercel CLI fragile/slow | Use `npx --yes vercel@latest` for every command |
| npm install instead of npm ci | Lockfile might change in CI | Use ONLY `npm ci` in CI/CD |
| Missing Node version | Different build environment | Explicitly set `node-version: 20` |
| Secrets not configured | Build step fails | Add all 6 secrets in GitHub repo settings |
| Incorrect Project IDs | Deploy goes to wrong Vercel project | Verify IDs from `vercel.json` or Vercel dashboard |
| graphql not in dependencies | npm ci fails with "Missing: graphql" | Add `"graphql": "^16.8.0"` to package.json |

---

## XII. REFERENCE DATA FOR ARCHITECT

### Package Versions Summary
```
Website (Next.js):
- Next.js 16.3.4
- React 19.2.8
- TypeScript 5.x
- Tailwind 4.x
- Node 20.x

Console (Vite React):
- Vite 5.0.8
- React 18.3.1
- TypeScript 5.2.2
- Tailwind 3.3.6
- Node 20.x
```

### Repository Links
```
GitHub: https://github.com/rajakumaropus/newskarnataka
Actions: https://github.com/rajakumaropus/newskarnataka/actions
Website: https://newskarnataka-website.vercel.app
Console: https://newskarnataka-console.vercel.app
Strapi API: http://103.191.208.235:1337
```

### Known Working Commits
```
3e45037: fix: add graphql as direct dependency and regenerate lockfile
906f7a7: Rewrite: Deploy workflow using official Vercel pattern
```

---

## XIII. ARCHITECT'S DESIGN CHECKLIST

Before writing deploy.yml, architect should verify/decide:

```
☐ Parallel or sequential job execution?
☐ Single workflow file or separate workflows per app?
☐ Cache strategy: npm, Docker layers, or none?
☐ Matrix strategy for testing on multiple Node versions?
☐ Approval gates before production deployment?
☐ Rollback strategy (e.g., previous Vercel deployment)?
☐ Notifications: Slack, email, GitHub comment?
☐ Retry logic for failed steps?
☐ Timeout limits per job?
☐ Artifact retention (logs, build outputs)?
```

---

## CONCLUSION

This data package provides all technical requirements for designing production-grade GitHub Actions workflow. The architect should focus on:

1. **Correctness:** Lockfiles must be committed and in sync
2. **Simplicity:** Use Vercel's official CLI pattern (pull → build → deploy --prebuilt)
3. **Reliability:** Parallel jobs with proper environment variable scoping
4. **Security:** All credentials via GitHub Secrets, never hardcoded

All dependency data, credential IDs, and configuration mappings are provided above.

---

**Prepared by:** AI Agent  
**Review Date:** September 10, 2026  
**Status:** Ready for Architecture Review
