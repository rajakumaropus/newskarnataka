# WordPress Migration Setup - Complete Guide

## Current Status

We have successfully:
- ✅ Connected to WordPress and fetched 500 articles
- ✅ Connected to Strapi backend
- ❌ **Blocked:** API token doesn't have write permissions (403 Forbidden)

## The Problem

The current Strapi API token has **read-only** permissions. To import articles, we need a token with **full write access**.

## Solution: Generate Full-Access API Token

### Step 1: Go to Strapi Admin

Visit: http://103.191.208.235:1337/admin

### Step 2: Create New API Token

1. **Left sidebar** → **Settings** (gear icon)
2. **GLOBAL SETTINGS** section → **API Tokens**
3. Click **Create new API token**
4. **Fill in:**
   - **Name:** `WordPress Migration Token`
   - **Description:** `Full access token for WordPress content migration`
   - **Token duration:** Leave empty (never expires)
   - **Token type:** Select **Full access** or **Custom**

5. If you select **Custom**, enable:
   - ✅ Articles: CREATE, READ, UPDATE, DELETE
   - ✅ Categories: CREATE, READ, UPDATE, DELETE
   - ✅ Tags: CREATE, READ, UPDATE, DELETE
   - ✅ Authors: CREATE, READ, UPDATE, DELETE

6. Click **Save**
7. **Copy the token** (you won't see it again!)

### Step 3: Update Environment Variable

Update the `.env` file in your workspace:

```bash
STRAPI_API_TOKEN=YOUR_NEW_FULL_ACCESS_TOKEN_HERE
```

### Step 4: Run Migration Again

```bash
node wordpress-scraper.js
```

---

## Alternative Method: Manual Import via Strapi Admin

If token generation doesn't work, we can manually import articles via the Strapi Admin UI:

### Quick Manual Process

1. **Go to Strapi Admin:** http://103.191.208.235:1337/admin
2. **Click Articles** in left sidebar
3. **Click "Create new entry"**
4. **Fill in:**
   - Title
   - Slug
   - Excerpt
   - Description
   - Content
   - Category
   - Author
   - Tags
   - Status: `Published`

5. Click **Save**

**Note:** This is slower but guaranteed to work. We can batch this by creating 10-20 sample articles first.

---

## Quick Test: Verify Token Permissions

Run this test to check if token works:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://103.191.208.235:1337/api/articles \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"data": {"title": "Test Article"}}'
```

If it returns **200/201** → Token has write access ✅
If it returns **403** → Token is read-only ❌

---

## Migration Script Ready

The migration script (`wordpress-scraper.js`) is configured to:
- Fetch all WordPress articles automatically
- Transform to Strapi schema
- Import 500+ articles in batch
- Handle errors gracefully

**Just provide a full-access token and it will work!**

---

## Next Steps

1. **Generate full-access token** in Strapi Admin
2. **Update `.env`** with new token
3. **Run:** `node wordpress-scraper.js`
4. **Wait** 5-10 minutes for import to complete
5. **Verify** in Strapi Admin that articles are imported

---

## FAQ

**Q: Where do I find the API Tokens section?**
A: Settings (gear icon) → Global Settings → API Tokens

**Q: Do I need to restart Strapi after creating a token?**
A: No, the token works immediately.

**Q: Can I use the same token for production?**
A: Not recommended. Create one token for migration, another for production with limited permissions.

**Q: How long does 500 articles take to import?**
A: Approximately 5-10 minutes with rate limiting.

**Q: What if some articles fail?**
A: The script logs failures and continues. You can re-run it - duplicate articles are skipped.

---

## Success Indicator

Once import completes, you should see:

```
╔════════════════════════════════════════════════════════╗
║  Migration Complete ✅                                ║
╚════════════════════════════════════════════════════════╝

📊 Articles:
   ✅ Successfully imported: 500
   ℹ️  Already exist: 0
   ❌ Failed: 0
   📦 Total processed: 500

📁 Categories: 47
🏷️ Tags: 100
```

Then the Console dashboard will show article counts > 0! 🎉

---

## Support

Need help with token generation? Check the Strapi docs:
https://docs.strapi.io/dev-docs/tokens/management

Or let me know the exact error you see!
