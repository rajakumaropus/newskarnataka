# Step 5: Monitor Workflow Execution

**Task:** Monitor GitHub Actions workflow and verify both jobs complete successfully  
**URL:** https://github.com/rajakumaropus/newskarnataka/actions  
**Estimated Time:** 8-14 minutes (passive monitoring)  
**Status:** PENDING (After Step 4 triggers workflow)

---

## WHAT TO MONITOR

After triggering the workflow in Step 4, you'll monitor two parallel jobs:

### Job 1: deploy-website (Next.js)
- Builds Website Next.js application
- Expected output: `.next/` directory
- Expected time: ~8-10 minutes

### Job 2: deploy-console (Vite React)
- Builds Console Vite React application
- Expected output: `dist/` directory
- Expected time: ~8-10 minutes

---

## HOW TO MONITOR

### Step 1: Open the Workflow Run

1. Go to: https://github.com/rajakumaropus/newskarnataka/actions
2. Click on the "Deploy to Vercel" workflow run (top of list)
3. You should see the workflow details page

### Step 2: Watch Both Jobs

You should see:

```
deploy-website  ████░░░░░ (In progress)
deploy-console  ████░░░░░ (In progress)
```

Both jobs run **in parallel**, so they should progress together.

### Step 3: Monitor Progress

The jobs progress through these stages:

1. **Checkout** (~10 seconds)
   - Cloning repository code

2. **Setup Node** (~20 seconds)
   - Installing Node.js 20
   - Setting up npm cache

3. **Install Vercel CLI** (~30 seconds)
   - Installing vercel@latest globally

4. **Pull Vercel Environment** (~20 seconds)
   - Downloading Vercel project configuration
   - Setting up environment variables

5. **Install Dependencies** (~2-3 minutes)
   - Running `npm ci --legacy-peer-deps`
   - Installing all project dependencies

6. **Build Locally** (~2-3 minutes)
   - Running `npm run build`
   - Compiling the application

7. **Deploy to Vercel** (~1-2 minutes)
   - Uploading build to Vercel
   - Vercel processes deployment

---

## EXPECTED TIMELINE

```
Time      deploy-website              deploy-console
─────────────────────────────────────────────────────────
0:00      Triggered
0:10      ✓ Checkout done             ✓ Checkout done
0:30      ✓ Node setup done           ✓ Node setup done
1:00      ✓ Vercel CLI done           ✓ Vercel CLI done
1:20      ✓ Pull env done             ✓ Pull env done
4:20      ✓ Dependencies done         ✓ Dependencies done
6:20      ✓ Build done                ✓ Build done
7:20      ✓ Deploy to Vercel          ✓ Deploy to Vercel
8:00      ✓ Deployed successfully     ✓ Deployed successfully
─────────────────────────────────────────────────────────
Total:    8-14 minutes
```

---

## SUCCESS INDICATORS

### During Execution

✓ Both jobs show progress bars advancing  
✓ No red X marks or error icons  
✓ Jobs run in parallel (not sequentially)  
✓ Each step completes without errors  
✓ Estimated time is 8-14 minutes total  

### After Completion

✓ Both jobs show green checkmark ✓  
✓ Status: "All jobs succeeded"  
✓ No failed jobs  
✓ No cancelled jobs  
✓ Deployment URLs show in Vercel  

---

## FAILURE INDICATORS

❌ Red X mark on a job  
❌ Status: "Failed" or "Error"  
❌ One or both jobs cancelled  
❌ Error message in logs  
❌ Stuck on same step for >2 minutes  

---

## COMMON BUILD/DEPLOY FAILURES

### Issue: "spawn npm ENOENT" Error

**Cause:** npm not found in subprocess  
**Solution:** Already fixed in workflow (using npm run build)  
**Status:** Should not occur

### Issue: Missing Dependencies

**Cause:** lockfile mismatch or missing packages  
**Solution:** Already fixed (regenerated lockfiles)  
**Status:** Should not occur

### Issue: Vercel Authentication Failed

**Cause:** VERCEL_TOKEN invalid or expired  
**Solution:** Check GitHub Secrets (Step 3)  
**Status:** Verify VERCEL_TOKEN is correct

### Issue: Project Not Found

**Cause:** VERCEL_PROJECT_ID wrong or doesn't exist  
**Solution:** Verify project IDs in Vercel  
**Status:** Verify both project IDs match

### Issue: Environment Variable Not Found

**Cause:** STRAPI_URL or STRAPI_API_TOKEN missing  
**Solution:** Check GitHub Secrets  
**Status:** Verify all 5 secrets are set

---

## READING THE LOGS

If a job fails, you can view the logs:

### To View Job Logs

1. Click on the failed job (deploy-website or deploy-console)
2. Click on the failed step
3. Read the error message
4. Look for:
   - Red error text
   - Stack traces
   - Error codes

### Common Error Messages

```
Error: VERCEL_TOKEN not found
→ Check GitHub Secrets, add VERCEL_TOKEN

Error: spawn npm ENOENT
→ npm not available in subprocess (shouldn't happen)

Error: Project not found
→ Check VERCEL_PROJECT_ID values

Error: Build failed
→ Check build scripts, dependencies, or code issues
```

---

## WHAT TO DO WHILE WAITING

While the 8-14 minute deployment runs:

- [ ] Leave the Actions page open
- [ ] Monitor progress occasionally
- [ ] Don't make any code changes
- [ ] Don't push new commits
- [ ] Prepare for Step 6 & 7 (app verification)

---

## WHEN DEPLOYMENT SUCCEEDS

When both jobs show green ✓ and status is "All jobs succeeded":

1. Reply: **"✅ Step 5 Done - Deployment Successful"**
2. Proceed to Step 6: Verify Website app loads

---

## IF DEPLOYMENT FAILS

If a job fails (red X):

1. Click on the failed job
2. Read the error message
3. Note the error
4. Reply with the error message
5. We'll diagnose and fix

---

## MONITORING TIPS

- **Refresh the page** every 1-2 minutes to see latest status
- **Watch the progress bars** to see which step is running
- **Check estimated time** - usually shows 8-14 min
- **Don't cancel** unless absolutely necessary
- **Be patient** - builds take time

---

## NEXT STEPS

| Status | Action |
|--------|--------|
| Both ✓ green | → Step 6: Verify Website loads |
| One or both ❌ red | → Diagnose error, re-run if needed |
| Stuck/queued | → Wait a bit, then check GitHub status |

---

**Status: AWAITING WORKFLOW COMPLETION**

Step 5 begins after Step 4 triggers the workflow. Monitor the workflow run and report when both jobs complete successfully.
