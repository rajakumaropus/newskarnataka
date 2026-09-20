# Step 2: Update Vercel Console Project Settings

**Task:** Configure Console project in Vercel dashboard  
**URL:** https://vercel.com/rajkumaropus-7015/newskarnataka-console/settings  
**Estimated Time:** 5 minutes  
**Status:** IN PROGRESS

---

## INSTRUCTIONS

### Part A: Root Directory

1. **Go to Vercel Dashboard**
   - URL: https://vercel.com/rajkumaropus-7015/newskarnataka-console/settings
   - Log in if needed

2. **Find "Root Directory" Setting**
   - Look for: Settings → General → Root Directory
   - Or search for "Root Directory" on the page

3. **Clear Current Value** (if any)
   - Click the input field
   - Delete any existing value
   - Enter: `newskarnataka-console`

4. **Save Changes**
   - Click "Save" button (usually at bottom of form)
   - Wait for confirmation

### Part B: Build Command

1. **Find "Build Command" Setting**
   - Look for: Settings → General → Build Command
   - Or search for "Build Command" on the page

2. **Set Build Command**
   - Click the input field
   - Clear if needed
   - Enter: `npm run build`
   - This tells Vercel to use Vite build

3. **Save Changes**
   - Click "Save" button
   - Wait for confirmation

### Part C: Output Directory

1. **Find "Output Directory" Setting**
   - Look for: Settings → General → Output Directory
   - Or search for "Output Directory" on the page

2. **Set Output Directory**
   - Click the input field
   - Clear if needed
   - Enter: `dist`
   - This is where Vite stores build output (different from Next.js)

3. **Save Changes**
   - Click "Save" button
   - Wait for confirmation

### Part D: Install Command

1. **Find "Install Command" Setting**
   - Look for: Settings → General → Install Command
   - Or search for "Install Command" on the page

2. **Set Install Command**
   - Click the input field
   - Clear if needed
   - Enter: `npm ci --legacy-peer-deps`
   - This installs dependencies reproducibly

3. **Save Changes**
   - Click "Save" button
   - Wait for confirmation

### Part E: Node.js Version

1. **Find "Node.js Version" Setting**
   - Look for: Settings → General → Node.js Version
   - Or search for "Node.js Version" on the page

2. **Set Node.js Version**
   - Click the dropdown/input field
   - Select or enter: `20.x` or `20`
   - Must match GitHub Actions (Node 20)

3. **Save Changes**
   - Click "Save" button
   - Wait for confirmation

### Part F: Disable Git Integration

1. **Go to Git Section**
   - Look for: Settings → Git
   - Or find "Git" tab/section in Settings

2. **Disconnect Repository** (if connected)
   - Look for: "Disconnect Repository" button
   - If you see "Repository Connected" or similar
   - Click "Disconnect" to disable Git integration
   - This prevents Vercel from auto-deploying

3. **Confirm Disconnection**
   - Click "Disconnect" button in confirmation dialog
   - Wait for confirmation that Git integration is disabled

---

## VERIFICATION

After completing all settings, verify:

✅ Root Directory = `newskarnataka-console`  
✅ Build Command = `npm run build`  
✅ Output Directory = `dist`  
✅ Install Command = `npm ci --legacy-peer-deps`  
✅ Node.js Version = `20.x` or `20`  
✅ Git Integration = DISCONNECTED (no auto-deploy)

---

## SETTINGS SUMMARY

| Setting | Value |
|---------|-------|
| Root Directory | newskarnataka-console |
| Build Command | npm run build |
| Output Directory | dist |
| Install Command | npm ci --legacy-peer-deps |
| Node.js Version | 20.x |
| Git Integration | Disabled |

---

## KEY DIFFERENCE FROM STEP 1

⚠️ **Important:** The Console project has DIFFERENT settings than the Website:

| Setting | Website | Console |
|---------|---------|---------|
| Root Directory | `newskarnataka-website` | `newskarnataka-console` |
| Output Directory | `.next` | `dist` |
| Everything else | Same | Same |

---

## NEXT AFTER COMPLETING THIS STEP

Once all settings are saved and verified:
1. Confirm with message: "✅ Step 2 Complete"
2. Will proceed to Step 3 (Verify GitHub Secrets)

---

## HELP

**Can't find a setting?**
- Search the page with Ctrl+F (Windows) or Cmd+F (Mac)
- Look for the exact setting name

**Not sure if Git is connected?**
- Go to Settings → Git
- If you see "Disconnect" button, it's connected - click it
- If you see "No repository connected", it's already disconnected

**Settings not saving?**
- Check for error messages on the page
- Try refreshing the page and checking if changes were saved
- Try again

---

**Status: AWAITING COMPLETION**

Please complete all settings above and reply with ✅ when done.
