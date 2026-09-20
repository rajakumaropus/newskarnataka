# Deployment Issues - Root Cause Analysis & Fix

## Summary
The `.github/workflows/deploy.yml` file has been rewritten from scratch following **official Vercel documentation** and GitHub Actions best practices. All previous issues stemmed from incorrect workflow patterns and missing configurations.

---

## Issues Encountered (Chronological)

### Issue 1: Environment Variable Reference Mismatch
**Error:** `Environment Variable "NEXT_PUBLIC_STRAPI_URL" references Secret "strapi_url", which does not exist`

**Root Cause:**
- Vercel project had `Root Directory` set to `newskarnataka-website`
- Workflow tried to set env vars only during GitHub Actions build, not in Vercel
- Vercel's stored config referenced invalid secret names

**Resolution:** 
- Move all env var setup to job-level environment blocks
- Use GitHub secrets directly instead of relying on Vercel's stored values

---

### Issue 2: Double Nesting with Root Directory
**Error:** `The provided path ".../newskarnataka-website/newskarnataka-website" does not exist`

**Root Cause:**
- Workflow deployed with `--cwd "$GITHUB_WORKSPACE/newskarnataka-website"`
- Vercel project's `Root Directory` was also set to `newskarnataka-website`
- Vercel CLI appended the path twice

**Attempted Fixes (All Ineffective):**
1. Remove `--cwd` flag → Still failed, wrong path used
2. Change Vercel Root Directory to `.` → Couldn't access Vercel dashboard (403 errors)
3. Use `--cwd` from repo root → Still double nesting

**Real Solution:** 
Use official Vercel pattern:
- `vercel pull` - fetches Vercel project config automatically
- `vercel build --prod` - builds using Vercel's configuration
- `vercel deploy --prebuilt --prod` - deploys pre-built output

---

### Issue 3: Shell Spawning Error (spawn sh ENOENT)
**Error:** `Error: spawn sh ENOENT` during `vercel build`

**Root Cause:**
- Global `npm install --global vercel@latest` doesn't guarantee shell availability
- Nested working directories lose shell context
- Vercel CLI tried to spawn `/bin/sh` and couldn't find it

**Attempted Fix:** Added `shell: bash` to defaults

**Real Solution:**
- Use `npx --yes vercel@latest` (resolves from project context)
- Ensures shell is available through npm's execution context
- Doesn't rely on global installation fragility

---

### Issue 4: Stale Lockfile Inconsistency
**Error:** `Invalid: lock file's picomatch@2.3.2 does not satisfy picomatch@4.0.7`

**Root Cause:**
- `package.json` and `package-lock.json` were out of sync
- Multiple failed lockfile regenerations
- `npm ci` strictly enforces lockfile consistency (correct behavior)

**Root Cause of Root Cause:**
- Workflow was trying to modify lockfile during CI (`npm install --save-dev vercel`)
- This added Vercel as a devDependency, changing the lockfile
- Earlier workflows left inconsistent state

**Real Solution:**
- Regenerate both lockfiles locally and commit fresh ones
- Use `npm ci` in CI (never `npm install`)
- Use `npx --yes` to avoid modifying lockfile

---

### Issue 5: Missing VERCEL_PROJECT_ID
**Error:** `You specified VERCEL_ORG_ID but you forgot to specify VERCEL_PROJECT_ID`

**Root Cause:**
- `VERCEL_ORG_ID` was set globally in workflow
- `VERCEL_PROJECT_ID` was not set for `vercel pull` step
- `vercel pull` requires both org and project to download environment

**Solution:**
- Move `VERCEL_ORG_ID` to job-level env
- Add `VERCEL_PROJECT_ID` to job-level env for each job
- Store project IDs in GitHub secrets

---

### Issue 6: Dependency Installation After `npm ci`
**Root Cause:**
- Workflow ran `npm install --save-dev vercel` after `npm ci`
- This contradicts the purpose of `npm ci` (clean, reproducible install)
- Modified the lockfile that was already committed

**Solution:**
- Remove the install step entirely
- Use `npx --yes vercel@latest` for immediate execution

---

## Official Vercel Pattern (From Documentation)

The correct pattern for GitHub Actions is:

```yaml
1. vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
   # Downloads Vercel project config and environment variables

2. vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
   # Builds project using Vercel's build system
   # Creates .vercel/output directory

3. vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
   # Deploys pre-built output (skips build on Vercel side)
```

**Why This Works:**
- `vercel pull` fetches project config and respects Root Directory setting
- `vercel build` uses Vercel's official build pipeline
- `vercel deploy --prebuilt` uploads pre-built artifacts, eliminating double-processing
- No global installations needed (uses `npx`)
- No lockfile modifications during CI

---

## Configuration Requirements

### GitHub Secrets (Required)
- `VERCEL_TOKEN` — Vercel authentication token
- `VERCEL_WEBSITE_PROJECT_ID` — Website project ID (prj_bkVUspAEPRO7h9Zc9cq48k2FkND1)
- `VERCEL_CONSOLE_PROJECT_ID` — Console project ID (prj_Nx3x0MVQdkxp5qeE7eo6cyLiK9jw)
- `STRAPI_URL` — Strapi API endpoint
- `STRAPI_API_TOKEN` — Strapi API token (full access)

### Vercel Project Configuration
- Each project must have a valid `Root Directory` setting
- Environment variables can be set in Vercel dashboard OR passed via GitHub Actions
- Both approaches work; GitHub Actions secrets are recommended for CI/CD

### Local Lockfile State
- Both `newskarnataka-website/package-lock.json` and `newskarnataka-console/package-lock.json` must be in sync with their `package.json`
- Verify: `npm ci` in each directory completes without errors
- Commit fresh lockfiles before pushing

---

## Architecture of New Workflow

### Separation of Concerns
- **Website job** — Next.js 16 build for newskarnataka-website
- **Console job** — Vite React build for newskarnataka-console
- Both jobs run in **parallel** for efficiency
- Each job has isolated env vars and credentials

### Error Prevention
1. **Bash shell guaranteed** — `shell: bash` in defaults prevents spawn errors
2. **Environment isolation** — Each job defines its own env vars, no global pollution
3. **Explicit working directory** — `working-directory` in defaults is clear
4. **npm caching** — Speeds up repeated builds
5. **npx execution** — No fragile global installations
6. **Vercel official pattern** — Follows Vercel's documented best practice

---

## Testing the New Workflow

Before pushing, verify:

1. **Lockfiles are valid:**
   ```bash
   cd newskarnataka-website && npm ci
   cd ../newskarnataka-console && npm ci
   ```

2. **GitHub secrets are set:**
   - Verify all 5 secrets exist in repository settings
   - Verify `VERCEL_TOKEN` has access to both projects

3. **Vercel projects are accessible:**
   - Each project should have `Root Directory` set to `.` or the app directory name
   - Environment variables in Vercel dashboard should not conflict with GitHub secrets

4. **Deployment:**
   - Push to main branch (or manually trigger with workflow_dispatch)
   - Monitor GitHub Actions for build progress
   - Verify apps deploy successfully

---

## Reference Links

- [Vercel for GitHub](https://vercel.com/docs/git/vercel-for-github)
- [Vercel CLI Deploy](https://vercel.com/docs/cli/deploy)
- [GitHub Actions Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [npm ci Documentation](https://docs.npmjs.com/cli/v8/commands/npm-ci)

---

## Deployment Targets (After Fix)

- **Website:** https://newskarnataka-website.vercel.app
- **Console:** https://newskarnataka-console.vercel.app

Both should deploy successfully in ~5-10 minutes after workflow completes.
