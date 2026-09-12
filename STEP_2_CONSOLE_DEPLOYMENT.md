# 🎯 STEP 2: CREATE CONSOLE PROJECT ON VERCEL

**Status:** Website ✅ | Console ⏳ | Secrets ⏳ | Testing ⏳

---

## 📋 WHAT YOU'RE DOING

Creating the second Vercel project for the React admin console.

**Expected Time:** 5-10 minutes

---

## ✅ YOUR CHECKLIST

### 2.1: Go to Vercel Dashboard

- [ ] Open: **https://vercel.com/dashboard**
- [ ] You should be logged in (from Step 1)

### 2.2: Click "Add New"

- [ ] Click **"Add New"** button (top left)
- [ ] Select **"Project"**

### 2.3: Import Repository

- [ ] Click **"Import Git Repository"**
- [ ] Search for: `rajakumaropus/newskarnataka`
- [ ] Click on it to select

### 2.4: Configure Console Project

Fill in these fields exactly:

| Field | Value | Check |
|-------|-------|-------|
| **Project Name** | `newskarnataka-console` | [ ] |
| **Root Directory** | `newskarnataka-console` | [ ] |
| **Framework Preset** | `Other` | [ ] |
| **Build Command** | `npm run build` | [ ] |
| **Output Directory** | `dist` | [ ] |
| **Install Command** | `npm install` | [ ] |

### 2.5: Add Environment Variables

Under "Environment Variables", add these 2 variables:

**Variable 1:**
```
Name:  VITE_STRAPI_URL
Value: http://103.191.208.235:1337
```
- [ ] Added

**Variable 2:**
```
Name:  VITE_STRAPI_API_TOKEN
Value: (Copy from your .env file - the long token)
```
- [ ] Added

### 2.6: Deploy

- [ ] Clicked **"Deploy"** button
- [ ] ⏳ Waiting for build to complete (this takes 5-10 minutes)
- [ ] ✅ You should see: **"Successfully deployed"** message

### 2.7: Get Console Project ID

After deployment completes:

1. [ ] Click on the project name (top left) or go back to dashboard
2. [ ] Click **"Settings"** (top navigation bar)
3. [ ] Scroll down to **"General"** section
4. [ ] Find **"Project ID"** field
5. [ ] **Copy it** (it looks like: `prj_xxxxxxxxxxxx`)
6. [ ] Save it for next step

### 2.8: Verify Console is Live

- [ ] Open: **https://newskarnataka-console.vercel.app**
- [ ] Should see: Login page
- [ ] Should have: Email input, Password input, Login button

---

## 📝 WHAT TO COPY

When you get the Console Project ID from Step 2.7:

```
VERCEL_PROJECT_ID_CONSOLE = (paste it here)
```

You'll need this in the next step!

---

## ✅ WHEN YOU'RE DONE

After Step 2.7, you should have:

✅ Console project created on Vercel  
✅ Console Project ID copied  
✅ Console live at: https://newskarnataka-console.vercel.app  

**Next:** Come back with the Console Project ID to continue!

---

## 🆘 TROUBLESHOOTING

### Build is taking too long
- Normal! Console build can take 5-10 minutes
- Don't close the page, wait it out

### Build failed
- Click on the failed deployment
- Check "Build Logs"
- Common issues:
  - Missing env var (make sure both are added)
  - Wrong root directory (should be `newskarnataka-console`)

### Can't find Environment Variables field
- Scroll down on the project configuration page
- It's after the "Framework" settings
- Look for "Environment Variables" section

### Console won't load
- Make sure Strapi is running: http://103.191.208.235:1337
- Check browser console (F12) for errors
- Try hard refresh: Ctrl+Shift+Delete (Windows)

---

**Ready? Go to https://vercel.com/dashboard and start Step 2!**

