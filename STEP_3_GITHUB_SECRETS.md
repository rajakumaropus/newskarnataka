# 🔐 STEP 3: ADD GITHUB SECRETS

**Status:** Website ✅ | Console ✅ | Secrets ⏳ | Testing ⏳

These secrets enable automatic deployment when you push to GitHub!

---

## 📋 WHAT YOU NEED

Before adding secrets, gather these values:

### From your `.env` file:
```
VERCEL_TOKEN = vcp_65UfIWbi4c7x8c4ftcovc5Zsb2JaeuzYI4j438qM9CLUH5ziOv1l24pm
VERCEL_ORG_ID = rajkumaropus-7015
STRAPI_URL = http://103.191.208.235:1337
STRAPI_API_TOKEN = a18e5bcb9bc06d3af2e522ba790c6e9465c33fa058e2e0283576faa242a35a8129280963a7b0c908f09d3e97cd557c527e669f742c23fcd96702692280ffd4ba58fd2ff8b4d26ae26f263d6f228ef53f335fa6d33fdf513a7e6402ed02269a4d328fb1712b212420726d3e6d8996a6ebeba63c37bffcbddffabfbf91
```

### From Vercel Dashboard:
- Website Project ID: `prj_bkVUspAEPRO7h9Zc9cq48k2FkND1`
- Console Project ID: `(get from Vercel - see below)`

---

## 🔍 GET CONSOLE PROJECT ID

1. Go to: https://vercel.com/rajakumaropus-7015
2. Click on: **newskarnataka-console** project
3. Go to: **Settings** → **General**
4. Find: **Project ID** (copy it)

Example: `prj_xxxxxxxxxxxxxxxxxxxx`

**Save it!** You'll need it in Step 3.2

---

## ✅ ADD SECRETS TO GITHUB

### 3.1: Go to GitHub Secrets Page

Open: **https://github.com/rajakumaropus/newskarnataka/settings/secrets/actions**

You should see:
- Left sidebar: "Secrets and variables"
- Main area: "Actions" section
- Button: "New repository secret"

### 3.2: Add Secret #1 - VERCEL_TOKEN

```
Name:  VERCEL_TOKEN
Value: vcp_65UfIWbi4c7x8c4ftcovc5Zsb2JaeuzYI4j438qM9CLUH5ziOv1l24pm
```

**Steps:**
1. [ ] Click "New repository secret"
2. [ ] Type in Name field: `VERCEL_TOKEN`
3. [ ] Paste in Value field: (token from `.env`)
4. [ ] Click "Add secret"

### 3.3: Add Secret #2 - VERCEL_ORG_ID

```
Name:  VERCEL_ORG_ID
Value: rajkumaropus-7015
```

**Steps:**
1. [ ] Click "New repository secret"
2. [ ] Type Name: `VERCEL_ORG_ID`
3. [ ] Type Value: `rajkumaropus-7015`
4. [ ] Click "Add secret"

### 3.4: Add Secret #3 - VERCEL_PROJECT_ID_WEBSITE

```
Name:  VERCEL_PROJECT_ID_WEBSITE
Value: prj_bkVUspAEPRO7h9Zc9cq48k2FkND1
```

**Steps:**
1. [ ] Click "New repository secret"
2. [ ] Type Name: `VERCEL_PROJECT_ID_WEBSITE`
3. [ ] Paste Value: `prj_bkVUspAEPRO7h9Zc9cq48k2FkND1`
4. [ ] Click "Add secret"

### 3.5: Add Secret #4 - VERCEL_PROJECT_ID_CONSOLE

```
Name:  VERCEL_PROJECT_ID_CONSOLE
Value: (from Vercel - see section 3.1)
```

**Steps:**
1. [ ] Click "New repository secret"
2. [ ] Type Name: `VERCEL_PROJECT_ID_CONSOLE`
3. [ ] Paste Value: (Console Project ID)
4. [ ] Click "Add secret"

### 3.6: Add Secret #5 - STRAPI_URL

```
Name:  STRAPI_URL
Value: http://103.191.208.235:1337
```

**Steps:**
1. [ ] Click "New repository secret"
2. [ ] Type Name: `STRAPI_URL`
3. [ ] Type Value: `http://103.191.208.235:1337`
4. [ ] Click "Add secret"

### 3.7: Add Secret #6 - STRAPI_API_TOKEN

```
Name:  STRAPI_API_TOKEN
Value: a18e5bcb9bc06d3af2e522ba790c6e9465c33fa058e2e0283576faa242a35a8129280963a7b0c908f09d3e97cd557c527e669f742c23fcd96702692280ffd4ba58fd2ff8b4d26ae26f263d6f228ef53f335fa6d33fdf513a7e6402ed02269a4d328fb1712b212420726d3e6d8996a6ebeba63c37bffcbddffabfbf91
```

**Steps:**
1. [ ] Click "New repository secret"
2. [ ] Type Name: `STRAPI_API_TOKEN`
3. [ ] Paste Value: (from `.env` file)
4. [ ] Click "Add secret"

---

## ✅ VERIFY ALL SECRETS

After adding all 6, you should see:

```
✅ VERCEL_TOKEN
✅ VERCEL_ORG_ID
✅ VERCEL_PROJECT_ID_WEBSITE
✅ VERCEL_PROJECT_ID_CONSOLE
✅ STRAPI_URL
✅ STRAPI_API_TOKEN
```

All 6 should be listed on the Secrets page.

---

## 🎯 WHAT THESE SECRETS DO

| Secret | Purpose |
|--------|---------|
| `VERCEL_TOKEN` | Authenticate to Vercel API |
| `VERCEL_ORG_ID` | Your Vercel organization |
| `VERCEL_PROJECT_ID_WEBSITE` | Deploy to website project |
| `VERCEL_PROJECT_ID_CONSOLE` | Deploy to console project |
| `STRAPI_URL` | Backend API URL |
| `STRAPI_API_TOKEN` | Backend API authentication |

When you push to GitHub, GitHub Actions will:
1. Read these secrets
2. Build your apps
3. Deploy to Vercel automatically!

---

## ⏱️ TIME ESTIMATE

- Getting Console Project ID: 2 minutes
- Adding 6 secrets: 5 minutes
- **Total: 7 minutes**

---

## 🎉 WHEN YOU'RE DONE

After adding all 6 secrets:

✅ Step 3 is complete!  
✅ CI/CD is now enabled!  
✅ Next: Verify deployments are live

---

**Ready? Go to GitHub and add the secrets!**

