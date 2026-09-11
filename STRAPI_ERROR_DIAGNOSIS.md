# 🔧 STRAPI ERROR DIAGNOSIS & TROUBLESHOOTING

**Error:** `Unexpected token '<', "<!DOCTYPE "..." is not valid JSON`

**Status:** Server returning HTML error page instead of JSON API response

---

## 🚨 ROOT CAUSE ANALYSIS

This error occurs when:
1. ❌ Strapi backend service is **DOWN** or **CRASHING**
2. ❌ API endpoint returning **500 error** (HTML error page)
3. ❌ **Server misconfiguration** or database connection issue
4. ❌ **Memory/resource exhaustion** on hosting server

---

## 🔍 DIAGNOSTIC STEPS

### Step 1: Check Strapi Admin Health

**Action:** Try to access the Strapi homepage (not admin)

```
URL: https://strapi.opusinfiniti.com/
Expected: Strapi welcome page or JSON API response
Actual: ??? (report what you see)
```

**What to report:**
- ✅ Strapi page loads - server is UP
- ❌ Error page - server has issue
- ⏳ Timeout - server unreachable

---

### Step 2: Check Strapi API Endpoint

**Action:** Open browser dev tools and check network tab

1. Press **F12** to open Developer Tools
2. Go to **Network** tab
3. Refresh the admin page (where you see the error)
4. Look for failed requests - click on them
5. Check the response (should be JSON, but if HTML → ERROR)

**What to look for:**
```
Request URL: https://strapi.opusinfiniti.com/api/...
Status: 500 (means server error)
Response: <html>... (if HTML instead of JSON → problem)
```

**Screenshot or copy the response** so I can see what's happening.

---

### Step 3: Check Server Logs

**You need to contact your server admin or hosting provider:**

**Information to request:**
1. **Strapi process status** - Is it running?
2. **Server logs** - Recent errors in past 30 minutes
3. **Database connection** - Can Strapi connect to PostgreSQL?
4. **Memory/CPU usage** - Is server out of resources?
5. **Recent deployments** - Was anything changed recently?

---

## 🛠️ COMMON FIXES

### Fix #1: Restart Strapi Service

**If you have server access:**

```bash
# Stop Strapi
docker stop newskarnataka-strapi

# Wait 10 seconds
sleep 10

# Start Strapi
docker start newskarnataka-strapi

# Check status
docker ps | grep strapi
```

**Then try admin again:** https://strapi.opusinfiniti.com/admin

---

### Fix #2: Restart Docker Container

**If running in Docker:**

```bash
# Rebuild and restart
docker-compose down
docker-compose up -d

# Check logs
docker-compose logs strapi
```

---

### Fix #3: Check Database Connection

**Verify database is accessible:**

```bash
# Test connection (Windows PowerShell)
psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT 1;"

# Expected: (1 row) - means DB is accessible
```

---

### Fix #4: Clear Strapi Cache & Rebuild

**If Strapi crashed due to cache issue:**

```bash
# Stop Strapi
docker stop newskarnataka-strapi

# Remove build artifacts
docker exec newskarnataka-strapi rm -rf .next build

# Restart
docker start newskarnataka-strapi
```

---

## 📋 TROUBLESHOOTING CHECKLIST

- [ ] Strapi admin page accessible at https://strapi.opusinfiniti.com/
- [ ] No 500 errors in browser console
- [ ] Database connection working
- [ ] Strapi process running
- [ ] No server resource issues (CPU/Memory)
- [ ] Recent deployments checked
- [ ] Logs reviewed for errors

---

## ❓ NEXT STEPS

**Option A: You have server access**
1. Try restarting Strapi (Fix #1 or #2)
2. Check logs with: `docker-compose logs strapi`
3. Report what you find

**Option B: Hosted server (no direct access)**
1. Contact your hosting provider/server admin
2. Ask them to:
   - Check Strapi process status
   - Review recent server logs
   - Restart Strapi if needed
3. Provide them this diagnostic guide

**Option C: Send me the error details**
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh admin page
4. Find the failed request
5. Click on it → Response tab
6. Copy the HTML/error message
7. Send it to me

---

## 📞 WHAT TO SEND ME

When you have the diagnostic info, send:

1. **What page appears?**
   - Strapi login page?
   - Error page?
   - Blank page?
   - Timeout?

2. **Browser DevTools Network Response (copy-paste):**
   ```
   [paste response here]
   ```

3. **Server logs (if accessible):**
   ```
   [paste recent errors here]
   ```

4. **Database connectivity test result:**
   ```
   [paste test result here]
   ```

---

**Status: WAITING FOR DIAGNOSTICS**

Let me know what you find! 🔍

