# Add Environment Variables to Vercel Projects

**Issue:** Build fails because Vercel doesn't have the Strapi environment variables configured  
**Solution:** Add environment variables to each Vercel project  
**Status:** REQUIRED before deployment can succeed

---

## WEBSITE PROJECT: Add Environment Variables

**URL:** https://vercel.com/rajkumaropus-7015/newskarnataka-website/settings/environment-variables

### Step 1: Navigate to Environment Variables

1. Go to Website project in Vercel
2. Click Settings (top navigation)
3. Click "Environment Variables" (left sidebar)
4. You should see an input field to add new variables

### Step 2: Add NEXT_PUBLIC_STRAPI_URL

1. In "Name" field: `NEXT_PUBLIC_STRAPI_URL`
2. In "Value" field: `http://103.191.208.235:1337`
3. Select Environment: Check all three (Production, Preview, Development)
4. Click "Add"

### Step 3: Add NEXT_PUBLIC_STRAPI_API_TOKEN

1. In "Name" field: `NEXT_PUBLIC_STRAPI_API_TOKEN`
2. In "Value" field: (Copy from your `.env` file - the STRAPI_API_TOKEN value)
3. Select Environment: Check all three (Production, Preview, Development)
4. Click "Add"

### Verification

You should now see:
```
NEXT_PUBLIC_STRAPI_URL              = http://103.191.208.235:1337
NEXT_PUBLIC_STRAPI_API_TOKEN        = (hidden token)
```

---

## CONSOLE PROJECT: Add Environment Variables

**URL:** https://vercel.com/rajkumaropus-7015/newskarnataka-console/settings/environment-variables

### Step 1: Navigate to Environment Variables

1. Go to Console project in Vercel
2. Click Settings (top navigation)
3. Click "Environment Variables" (left sidebar)
4. You should see an input field to add new variables

### Step 2: Add VITE_STRAPI_URL

1. In "Name" field: `VITE_STRAPI_URL`
2. In "Value" field: `http://103.191.208.235:1337`
3. Select Environment: Check all three (Production, Preview, Development)
4. Click "Add"

### Step 3: Add VITE_STRAPI_API_TOKEN

1. In "Name" field: `VITE_STRAPI_API_TOKEN`
2. In "Value" field: (Copy from your `.env` file - the STRAPI_API_TOKEN value)
3. Select Environment: Check all three (Production, Preview, Development)
4. Click "Add"

### Verification

You should now see:
```
VITE_STRAPI_URL                     = http://103.191.208.235:1337
VITE_STRAPI_API_TOKEN               = (hidden token)
```

---

## QUICK REFERENCE

### Website Project Environment Variables

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_STRAPI_URL` | `http://103.191.208.235:1337` |
| `NEXT_PUBLIC_STRAPI_API_TOKEN` | (from `.env` STRAPI_API_TOKEN) |

### Console Project Environment Variables

| Name | Value |
|------|-------|
| `VITE_STRAPI_URL` | `http://103.191.208.235:1337` |
| `VITE_STRAPI_API_TOKEN` | (from `.env` STRAPI_API_TOKEN) |

---

## WHERE TO GET STRAPI_API_TOKEN

1. Open your `.env` file
2. Look for: `STRAPI_API_TOKEN=...`
3. Copy the full token value (the part after `=`)
4. Use in both Vercel projects

---

## IMPORTANT NOTES

- Add variables to ALL three environments: Production, Preview, Development
- Use the exact names (case-sensitive): `NEXT_PUBLIC_*` for Next.js, `VITE_*` for Vite
- Values are case-sensitive
- URL should be: `http://103.191.208.235:1337` (with http://, not https://)

---

## VERIFY SETUP

After adding environment variables:

1. Website project should show:
   - ✅ NEXT_PUBLIC_STRAPI_URL
   - ✅ NEXT_PUBLIC_STRAPI_API_TOKEN

2. Console project should show:
   - ✅ VITE_STRAPI_URL
   - ✅ VITE_STRAPI_API_TOKEN

---

## NEXT STEPS

1. Add environment variables to both Vercel projects (as above)
2. Trigger the workflow again
3. Deployment should succeed

---

**Status:** AWAITING ENVIRONMENT VARIABLES TO BE ADDED TO VERCEL
