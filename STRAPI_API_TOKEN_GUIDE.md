# 🔑 Strapi API Token Creation Guide

**Task:** Get an API token from Strapi to use with the sample data script

---

## 📋 STEPS TO CREATE API TOKEN

### Step 1: Login to Strapi Admin
- URL: http://103.191.208.235:1337/admin
- Email: reachus@opusinfiniti.com
- Password: Opus@321$%^

### Step 2: Navigate to Settings
In the left sidebar:
1. Click **Settings** (gear icon at bottom)
2. Click **API Tokens** in the left menu

### Step 3: Create New Token
1. Click **Create new API token** button
2. Fill in the form:
   - **Name**: `NewsKarnataka Sample Data`
   - **Description**: `Token for populating sample data for development`
   - **Type**: Select **Full access** (or Custom with all permissions)
   - **Duration**: Optional (can leave blank for no expiry)

### Step 4: Generate & Copy Token
1. Click **Save**
2. Copy the generated token (you'll see a long string starting with something like `abc123...`)
3. **IMPORTANT**: Save this token somewhere safe - you'll only see it once!

### Step 5: Use the Token

Use this token with the sample data script:

```powershell
.\scripts\create-sample-data.ps1 `
  -StrapiUrl "http://103.191.208.235:1337" `
  -ApiToken "your_token_here"
```

---

## 🔒 SECURITY NOTE

- Never commit API tokens to git
- Use environment variables in production
- Tokens with "Full access" should only be for development
- Create limited-scope tokens for production APIs

---

## ✅ VERIFICATION

Once you have the token, test it:

```powershell
# Test if token works
$headers = @{
    "Authorization" = "Bearer your_token_here"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "http://103.191.208.235:1337/api/articles" `
    -Method GET `
    -Headers $headers
```

If successful, you'll get a list of articles (may be empty).

---

## 📍 TOKEN LOCATION IN ADMIN UI

- **Left Sidebar** → **Settings** → **API Tokens**
- If you don't see "API Tokens", you may need admin permissions
- Contact: reachus@opusinfiniti.com

---

**Ready to create the token? Go to http://103.191.208.235:1337/admin**

