# CRITICAL FIX: Corrected Vercel Website Settings

**Issue:** Path doubling error persists even after removing `--cwd` flag  
**Root Cause:** Root Directory setting in Vercel causing duplication  
**Solution:** Clear the Root Directory field in Vercel project settings

---

## THE PROBLEM

Vercel is applying the Root Directory setting TWICE:

1. Workflow runs from: `~/work/newskarnataka/newskarnataka-website/`
2. Vercel reads: Root Directory = `newskarnataka-website`
3. Vercel applies: Root Directory from the setting
4. Result: `newskarnataka-website/newskarnataka-website` (doubled)

---

## THE FIX: Clear Root Directory in Vercel

### For Website Project

**URL:** https://vercel.com/rajkumaropus-7015/newskarnataka-website/settings

**Step 1: Clear Root Directory**
1. Go to Settings → General
2. Find "Root Directory" field
3. **CLEAR the field** (delete `newskarnataka-website`)
4. Leave it **EMPTY**
5. Click "Save"

**Step 2: Keep All Other Settings**
- Build Command: `npm run build` ✓ (keep)
- Output Directory: `.next` ✓ (keep)
- Install Command: `npm ci --legacy-peer-deps` ✓ (keep)
- Node.js Version: `20.x` ✓ (keep)

---

## WHY THIS WORKS

### Before (Broken)

```
GitHub Actions:    ~/work/newskarnataka/newskarnataka-website/
Vercel Setting:    Root Directory = "newskarnataka-website"
Result:            ~/work/.../newskarnataka-website/newskarnataka-website ❌
```

### After (Fixed)

```
GitHub Actions:    ~/work/newskarnataka/newskarnataka-website/
Vercel Setting:    Root Directory = "" (EMPTY)
Result:            ~/work/newskarnataka/newskarnataka-website/ ✓
```

---

## QUICK REFERENCE

| Setting | Old Value | New Value |
|---------|-----------|-----------|
| Root Directory | `newskarnataka-website` | **EMPTY** |
| Build Command | `npm run build` | `npm run build` |
| Output Directory | `.next` | `.next` |
| Install Command | `npm ci --legacy-peer-deps` | `npm ci --legacy-peer-deps` |
| Node.js Version | `20.x` | `20.x` |

---

## IMPORTANT NOTE

This fix works because:
- GitHub Actions already positions us in the correct directory via `defaults.run.working-directory`
- We don't need Vercel to ALSO apply a Root Directory
- Vercel should use the current directory (where `.vercel/` config file is)

---

## REPEAT FOR CONSOLE PROJECT

Do the same for Console project:

**URL:** https://vercel.com/rajkumaropus-7015/newskarnataka-console/settings

**Action:** Clear Root Directory field (leave empty)

---

## THEN RETRY DEPLOYMENT

1. Clear both Root Directory fields in Vercel
2. Trigger workflow again
3. Deployment should succeed

---

**Status:** AWAITING VERCEL SETTINGS UPDATE

Please:
1. Go to Website project settings
2. Clear the Root Directory field
3. Repeat for Console project
4. Reply when done: "✅ Vercel settings cleared"
5. Then trigger workflow again
