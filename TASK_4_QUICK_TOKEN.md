# 🔐 TASK #4: Quick API Token Setup

**Time:** 5 minutes  
**Prerequisite:** You have Strapi admin access

---

## ⚡ QUICK STEPS

### 1. Open Strapi Admin
```
URL: http://103.191.208.235:1337/admin
Email: reachus@opusinfiniti.com
Password: Opus@321$%^
```

### 2. Create API Token
- **Left sidebar** → **Settings** (gear icon at bottom)
- Click **API Tokens**
- Click **Create new API token**
- Fill form:
  ```
  Name: NewsKarnataka SampleData
  Description: For populating sample data
  Type: Full access
  Duration: 30 days
  ```
- Click **Save**
- **Copy the token immediately** (you only see it once!)

### 3. Save Token
Create a file (don't commit to git):
```
File: d:\Personal\Kiro\newsKarnataka\API_TOKEN.txt
Content: [paste your token here]
```

### 4. Test Token (Optional)
```powershell
# Test if token works
$token = Get-Content "d:\Personal\Kiro\newsKarnataka\API_TOKEN.txt"

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

curl.exe -X GET "http://103.191.208.235:1337/api/articles" -H "Authorization: Bearer $token"
```

---

## ✅ YOU'RE DONE!

The token is ready to use for sample data creation.

---

## 📝 NEXT: Use token with sample data script

```powershell
$token = Get-Content "d:\Personal\Kiro\newsKarnataka\API_TOKEN.txt"

.\scripts\create-sample-data.ps1 `
  -StrapiUrl "http://103.191.208.235:1337" `
  -ApiToken $token
```

