# Step 4: Trigger Test Deployment via GitHub Actions

**Task:** Trigger the GitHub Actions workflow to test deployment  
**URL:** https://github.com/rajakumaropus/newskarnataka/actions  
**Estimated Time:** 2 minutes to trigger, then 8-14 minutes to deploy  
**Status:** IN PROGRESS

---

## WHAT THIS STEP DOES

This step manually triggers the GitHub Actions workflow, which will:

1. **Build Website** (Next.js)
   - Install dependencies with npm ci
   - Compile with npm run build
   - Output to `.next/`

2. **Build Console** (Vite React)
   - Install dependencies with npm ci
   - Compile with npm run build
   - Output to `dist/`

3. **Deploy Both Apps** to Vercel (in parallel)
   - Website → https://newskarnataka-website.vercel.app
   - Console → https://newskarnataka-console.vercel.app

**Expected Duration:** 8-14 minutes total

---

## HOW TO TRIGGER THE WORKFLOW

### Option A: Manual Trigger via GitHub UI (Recommended - Fastest)

1. **Open GitHub Actions Page**
   - Go to: https://github.com/rajakumaropus/newskarnataka/actions
   - You should see the "Deploy to Vercel" workflow listed on the left

2. **Select the Workflow**
   - Click on "Deploy to Vercel" in the left sidebar
   - This shows previous runs and allows you to trigger a new one

3. **Click "Run workflow"**
   - Look for the "Run workflow" button (usually top right or top left)
   - It's a dropdown button with a play icon

4. **Confirm Trigger**
   - Click "Run workflow" in the dropdown
   - A new workflow run should appear immediately
   - Status will be "Queued" then "In progress"

5. **Watch for Status Change**
   - Wait for the status to change from "Queued" to "In progress"
   - Both jobs should appear: `deploy-website` and `deploy-console`

---

### Option B: Push a Commit (Automatic Trigger)

If you prefer to trigger via a commit:

1. **Make a Small Change** (e.g., update README.md)
2. **Commit and Push**
   ```bash
   git add README.md
   git commit -m "test: trigger deployment"
   git push origin main
   ```
3. **Workflow Triggers Automatically**
   - Check https://github.com/rajakumaropus/newskarnataka/actions
   - New run should appear within seconds

---

## WHAT TO LOOK FOR

### Successful Trigger

After triggering, you should see:

```
Deploy to Vercel (latest)
Status: In progress (yellow circle spinning)
Triggered: just now
Branch: main
```

### Within the Workflow

You should see **2 jobs running in parallel**:

```
deploy-website  [████░░░░░] 25% - In progress
deploy-console  [████░░░░░] 25% - In progress
```

---

## EXPECTED TIMELINE

```
Time     Event
────────────────────────────────────────────
0:00     Workflow triggered
0:05     Both jobs: Checkout + Node setup
0:10     Both jobs: Install Vercel CLI
0:15     Both jobs: Pull Vercel environment
0:20     Both jobs: Install dependencies (npm ci)
0:40     Both jobs: Build locally (npm run build)
0:50     Both jobs: Deploy to Vercel
1:00     Website deployment starts
1:05     Console deployment starts
1:10     First app deployed (Website)
1:14     Second app deployed (Console)
────────────────────────────────────────────
Total:   8-14 minutes
```

---

## VERIFICATION CHECKLIST

After triggering, verify:

- [ ] Workflow appears in the actions list
- [ ] Status shows "In progress" (not failed or cancelled)
- [ ] Both jobs visible: `deploy-website` and `deploy-console`
- [ ] Jobs are running (not queued indefinitely)
- [ ] No immediate error messages

---

## IF WORKFLOW FAILS TO TRIGGER

**Problem: "Run workflow" button not visible**

Solution:
1. Refresh the page (Ctrl+R / Cmd+R)
2. Make sure you're on the "Deploy to Vercel" workflow page
3. Try Option B: Push a commit instead

**Problem: Workflow triggered but shows error immediately**

This usually means:
- GitHub Secrets not set correctly
- Workflow file has syntax error
- Check the error message in the workflow run

---

## NEXT STEP

Once the workflow is **triggered and running**:

1. Reply: **"✅ Step 4 Done - Workflow Triggered"**
2. Move to Step 5: Monitor workflow execution

---

## HELP

**Can't find the Actions page?**
- URL: https://github.com/rajakumaropus/newskarnataka/actions
- Make sure you're logged in to GitHub

**Workflow not triggering?**
- Refresh the page
- Try the commit option (Option B) instead
- Check that `.github/workflows/deploy.yml` exists in the repo

**Need to cancel the workflow?**
- Go to the workflow run
- Click the workflow
- Look for "Cancel workflow" button

---

**Status: AWAITING TRIGGER**

Please trigger the workflow using Option A or Option B, then proceed to Step 5.
