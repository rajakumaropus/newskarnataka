# 🚀 TASK #5 - EMAIL CONFIGURATION: QUICK GUIDE

**Project:** NewsKarnataka Platform  
**Task:** Day 4-5 Email Configuration  
**Status:** READY FOR EXECUTION  
**Time:** 1-2 hours  

---

## 🎯 TASK #5 QUICK STEPS

### Step 1: Navigate to Email Configuration

**Location in Strapi Admin:**
```
Settings (left sidebar)
  → EMAIL PLUGIN
  → Configuration
```

**Expected Screen:**
- Email configuration form loads
- Provider selection dropdown
- SMTP fields (host, port, username, password)
- From email and name fields

**Action:** [ ] Navigate to Email Configuration

---

### Step 2: Select Email Provider

**Available Options:**
- Sendgrid
- Mailgun
- AWS SES
- Gmail SMTP
- Custom SMTP

**For Week 1 Testing, use: Gmail SMTP**

**Why Gmail?**
- Free to use
- Easy to setup
- Reliable for testing
- No cost

**Action:**
1. Find **"Provider"** dropdown
2. Select provider (Gmail or your preferred option)
3. Note: Provider field may auto-populate based on selection

**Status:** [ ] PROVIDER SELECTED

---

### Step 3: Configure SMTP Settings

**For Gmail SMTP:**

```
Provider:           Gmail (or SMTP depending on options)
SMTP Host:          smtp.gmail.com
SMTP Port:          587 (TLS) or 465 (SSL)
SMTP Username:      your-email@gmail.com
SMTP Password:      [App Password - NOT regular password]
From Email:         noreply@newskarnataka.com
From Name:          NewsKarnataka Platform
Secure (TLS):       true or checked
```

**Important: Gmail App Password**
- Regular Gmail password won't work
- Need to generate App Password
- Visit: https://myaccount.google.com/app-passwords
- Select: Mail + Windows Computer
- Copy the 16-character password
- Use that password in the form

**Action:**
1. Find **SMTP Host** field → Enter: `smtp.gmail.com`
2. Find **SMTP Port** field → Enter: `587`
3. Find **SMTP Username** field → Enter: `your-email@gmail.com`
4. Find **SMTP Password** field → Enter: `[Your App Password]`
5. Find **From Email** field → Enter: `noreply@newskarnataka.com`
6. Find **From Name** field → Enter: `NewsKarnataka Platform`
7. Find **Secure/TLS** toggle → Turn ON (if available)

**Status:** [ ] SMTP SETTINGS ENTERED

---

### Step 4: Save Email Configuration

**Action:**
1. Review all settings
2. Click **"Save"** button (usually blue button at top right)
3. Wait for success message

**Expected:** ✅ "Email configuration saved" or similar message

**Status:** [ ] CONFIGURATION SAVED

---

### Step 5: Send Test Email

**Action:**
1. Look for **"Send a test email"** button or link
2. If prompted for email address, enter your email
3. Click **"Send Test Email"** or similar button
4. Wait for confirmation (should appear within 5-10 seconds)

**Expected:** ✅ "Test email sent successfully" message

**Status:** [ ] TEST EMAIL SENT

---

### Step 6: Verify Email Delivery

**Action:**
1. Check your email inbox
2. Wait 1-2 minutes (sometimes delayed)
3. Look for email from: **NewsKarnataka Platform** <noreply@newskarnataka.com>
4. Open the email
5. Verify it contains test/configuration message

**Expected Result:**
```
From:    NewsKarnataka Platform <noreply@newskarnataka.com>
To:      your-email@example.com
Subject: Test Email or Configuration Test
Body:    Email configuration test successful
```

**Status:** [ ] TEST EMAIL RECEIVED

---

## ✅ TASK #5 COMPLETION CHECKLIST

- [ ] Email provider selected
- [ ] SMTP Host configured
- [ ] SMTP Port configured
- [ ] SMTP Username configured
- [ ] SMTP Password configured
- [ ] From Email configured
- [ ] From Name configured
- [ ] Secure/TLS enabled
- [ ] Configuration saved
- [ ] Test email sent
- [ ] Test email received

---

## 📝 EMAIL CONFIGURATION SUMMARY

**Document your settings:**

```
Email Configuration Summary
══════════════════════════════════════════

Provider:            Gmail SMTP
SMTP Host:           smtp.gmail.com
SMTP Port:           587
SMTP Username:       your-email@gmail.com
From Email:          noreply@newskarnataka.com
From Name:           NewsKarnataka Platform
Secure (TLS):        [ ] ENABLED
Test Email Status:   [ ] RECEIVED [ ] PENDING [ ] FAILED

Configuration Date:  _______________
Configured By:       _______________
Sign-off:            [ ] APPROVED [ ] NEEDS REVISION
```

---

## 🚨 TROUBLESHOOTING

### Test Email Not Received

**Check:**
1. Spam/Junk folder (common for first emails)
2. Forwarding rules
3. Email filters
4. Wait 5 minutes (sometimes delayed)
5. Verify email address entered correctly

**If Still Not Received:**
1. Check SMTP credentials are correct
2. Verify Gmail app password (not regular password)
3. Check "From Email" is valid format (example@domain.com)
4. Try different port (465 instead of 587)
5. Check firewall/network allows SMTP connection

### Authentication Failed

**Solution:**
1. Use Gmail App Password (not regular password)
2. Enable "Less secure app access" (if using regular password)
3. Verify username format (usually full email)
4. Check for extra spaces in credentials

---

## ✅ SIGN-OFF

**Task #5 Complete:** [ ] YES [ ] NO

**Email Configuration Verified:** [ ] YES [ ] NO

**Test Email Received:** [ ] YES [ ] NO

**Ready for Tasks #6-7 (Comprehensive Testing):** [ ] YES [ ] NO

---

**Follow the 6 steps above and confirm when complete!**

