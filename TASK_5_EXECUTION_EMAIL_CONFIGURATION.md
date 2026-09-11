# 🚀 TASK #5 EXECUTION GUIDE: EMAIL & PROVIDER CONFIGURATION

**Project:** NewsKarnataka Platform  
**Task:** Day 4-5 Email & Provider Configuration  
**Status:** READY FOR EXECUTION  
**Estimated Time:** 1-2 hours  

---

## 🎯 TASK #5 OBJECTIVES

### Goals
1. ✅ Configure SMTP email settings
2. ✅ Setup email provider (SendGrid, Mailgun, or direct SMTP)
3. ✅ Configure From email and From name
4. ✅ Send test email
5. ✅ Verify email delivery
6. ✅ Setup authentication providers (optional for Week 1)
7. ✅ Document all configurations

---

## 📍 CURRENT STATUS

**Prerequisites:**
- ✅ Strapi admin access working
- ✅ Database verified
- ✅ API tokens generated (Task #3)
- ✅ CORS configured (Task #4)
- ✅ Ready for email configuration

---

## 📋 STEP-BY-STEP EXECUTION

### STEP 1: Login to Strapi Admin

**Action:**
1. Open browser
2. Navigate to: https://strapi.opusinfiniti.com/admin
3. Login with credentials:
   - Email: reachus@opusinfiniti.com
   - Password: Opus@321$%^

**Expected:** Dashboard displays

**Verification:** [ ] LOGGED IN

---

### STEP 2: Navigate to Email Configuration

**Action:**
1. Click **Settings** (gear icon, bottom left)
2. Look for **Email Configuration** or **Email** in left menu
3. Common locations:
   - Settings → Email
   - Settings → Providers → Email
   - Settings → Email Configuration

**Alternative Paths:**
- Settings → Settings (or Advanced Settings) → Email
- Look for "Email" or "Notifications" in menu

**Expected Screen:**
```
Email Configuration
├─ Provider dropdown (SMTP, SendGrid, Mailgun, etc.)
├─ From Email field
├─ From Name field
├─ SMTP Host field
├─ SMTP Port field
├─ SMTP Username field
├─ SMTP Password field
├─ Secure/TLS toggle
├─ Test Email button
└─ Save Changes button
```

**Verification:** [ ] EMAIL CONFIGURATION PAGE ACCESSIBLE

---

### STEP 3: Select Email Provider

**What is an Email Provider?**
- Service that sends emails on your behalf
- Options:
  1. **Direct SMTP** - Your own mail server
  2. **SendGrid** - Cloud email service
  3. **Mailgun** - Cloud email service
  4. **AWS SES** - Amazon email service

**For Week 1, we recommend: SMTP**
- If you have existing mail server
- Or use generic SMTP settings

**Action:**
1. Find the **"Provider"** dropdown
2. Click it to see available options
3. Select: **SMTP** (or your preferred provider)

**Common SMTP Providers:**
```
Gmail:              smtp.gmail.com
Mailgun:            smtp.mailgun.org
SendGrid:           smtp.sendgrid.net
AWS SES:            email-smtp.[region].amazonaws.com
Your own server:    [your-mail-server.com]
```

**For Testing (Temporary):**
- Use: Gmail SMTP (free)
- Or: Mailgun (free tier available)

**Verification:** [ ] SMTP PROVIDER SELECTED

---

### STEP 4: Configure SMTP Settings

**What you need:**
1. **SMTP Host** - Mail server address
2. **SMTP Port** - Usually 587 (TLS) or 465 (SSL)
3. **SMTP Username** - Your email account
4. **SMTP Password** - Email password or app password
5. **From Email** - Email address shown as sender
6. **From Name** - Display name for sender

**Example Configuration (Gmail):**
```
Provider:           SMTP
SMTP Host:          smtp.gmail.com
SMTP Port:          587
SMTP Username:      your-email@gmail.com
SMTP Password:      your-app-password (NOT your regular password)
From Email:         noreply@newskarnataka.com
From Name:          NewsKarnataka Platform
Secure (TLS/SSL):   true
```

**Example Configuration (Mailgun):**
```
Provider:           SMTP
SMTP Host:          smtp.mailgun.org
SMTP Port:          587
SMTP Username:      postmaster@sandboxXXXXXXXXXX.mailgun.org
SMTP Password:      [Your Mailgun SMTP password]
From Email:         noreply@newskarnataka.com
From Name:          NewsKarnataka Platform
Secure (TLS/SSL):   true
```

**Example Configuration (Your Own Server):**
```
Provider:           SMTP
SMTP Host:          mail.newskarnataka.com
SMTP Port:          587 or 465
SMTP Username:      [Your mail account]
SMTP Password:      [Your password]
From Email:         noreply@newskarnataka.com
From Name:          NewsKarnataka Platform
Secure (TLS/SSL):   true
```

**Action:**

1. **SMTP Host Field:**
   - Enter your mail server address
   - Example: `smtp.gmail.com`

2. **SMTP Port Field:**
   - Enter port number
   - Usually: `587` (for TLS) or `465` (for SSL)
   - For Gmail: `587`

3. **SMTP Username Field:**
   - Enter your email account
   - Example: `your-email@gmail.com`

4. **SMTP Password Field:**
   - Enter password
   - ⚠️ **Important:** Use app password, not regular password
   - Gmail: Generate app password (https://myaccount.google.com/app-passwords)
   - Mailgun: Use SMTP password from dashboard

5. **From Email Field:**
   - Enter sender email
   - Example: `noreply@newskarnataka.com`
   - Can be any email address (doesn't need to match account)

6. **From Name Field:**
   - Enter display name
   - Example: `NewsKarnataka Platform`
   - This appears as sender name in emails

7. **Secure/TLS Toggle:**
   - Set to: **ON** or **TRUE**
   - Ensures encrypted connection

**Visual Example:**
```
┌─────────────────────────────────────┐
│ Email Configuration                  │
├─────────────────────────────────────┤
│ Provider:     SMTP                   │
│ SMTP Host:    smtp.gmail.com         │
│ SMTP Port:    587                    │
│ Username:     your-email@gmail.com   │
│ Password:     [••••••••••••]         │
│ From Email:   noreply@newskarnat... │
│ From Name:    NewsKarnataka Platform │
│ Secure:       [ON]                   │
│                                      │
│ [Cancel] [Save] [Send Test Email]   │
└─────────────────────────────────────┘
```

**Verification:** [ ] ALL SMTP SETTINGS ENTERED

---

### STEP 5: Save Email Configuration

**Action:**
1. Review all settings:
   - [ ] Provider: SMTP
   - [ ] SMTP Host: Filled
   - [ ] SMTP Port: Filled (587 or 465)
   - [ ] Username: Filled
   - [ ] Password: Filled
   - [ ] From Email: Filled
   - [ ] From Name: Filled
   - [ ] Secure: ON/TRUE

2. Click **"Save"** or **"Save Changes"** button
3. Wait for confirmation (2-5 seconds)

**Expected:**
```
✅ "Email configuration saved successfully"
Or similar success message
```

**Verification:** [ ] EMAIL CONFIGURATION SAVED

---

### STEP 6: Send Test Email

**Action:**
1. Find **"Send Test Email"** button or link
2. May appear after saving configuration
3. Or might be in a separate "Test" section
4. Click on "Send Test Email"

**If prompted for email address:**
1. Enter a test email address
   - Your email: your-email@gmail.com
   - Or: test@example.com
2. Click "Send" button
3. Wait 5-10 seconds

**Expected:**
```
✅ "Test email sent successfully"
Or similar confirmation message
```

**Verification:** [ ] TEST EMAIL SENT

---

### STEP 7: Verify Email Delivery

**Action:**
1. Check your inbox (the email address you entered)
2. Wait 1-2 minutes for email to arrive
3. Look for email from: **NewsKarnataka Platform** (or your From Name)
4. Subject: Usually "Test Email" or "Configuration Test"

**Expected Email:**
```
From:    NewsKarnataka Platform <noreply@newskarnataka.com>
To:      your-email@example.com
Subject: Test Email Configuration
Body:    Email configuration test successful
```

**If email doesn't arrive:**
- [ ] Check spam/junk folder
- [ ] Check forwarding rules
- [ ] Verify SMTP credentials are correct
- [ ] Try again after 5 minutes
- [ ] Check Strapi logs for errors

**Verification:** [ ] TEST EMAIL RECEIVED

---

### STEP 8: Document Email Configuration

**Create a file:** `STRAPI_EMAIL_CONFIG.txt`

**Content:**
```
═══════════════════════════════════════════════════════════
STRAPI EMAIL CONFIGURATION
═══════════════════════════════════════════════════════════

Email Provider:                 SMTP
SMTP Host:                      smtp.gmail.com
SMTP Port:                      587
SMTP Username:                  your-email@gmail.com
SMTP Password:                  [••••••••••••]
From Email:                     noreply@newskarnataka.com
From Name:                      NewsKarnataka Platform
Secure (TLS/SSL):               true

Configuration Date:             [TODAY'S DATE]
Test Email Sent:                [YES/NO]
Test Email Status:              [RECEIVED/PENDING]
Configured By:                  ___________________________

SECURITY NOTES:
- SMTP password stored securely (not in git)
- Email provider credentials protected
- Test email verified successfully

═══════════════════════════════════════════════════════════
```

**Verification:** [ ] EMAIL CONFIG DOCUMENTED

---

### STEP 9: Setup Authentication Providers (Optional for Week 1)

**What are Authentication Providers?**
- Allow users to login with external accounts
- Examples: Google, GitHub, Facebook
- Optional for Week 1 - can add later

**Current Status:**
- Email & Password authentication: ✅ Default (already working)
- OAuth providers: ⏳ Optional for Week 8+

**For Week 1:**
- Leave at default
- Document for future use

**Verification:** [ ] AUTH PROVIDERS UNDERSTOOD

---

### STEP 10: Verify Provider Configuration

**Action:**
1. In Strapi admin, look for **Providers** section
2. Should show list of available providers:
   - Email & Password (✅ Active by default)
   - Google OAuth (⏳ Can be added later)
   - GitHub OAuth (⏳ Can be added later)
   - etc.

**For Week 1:**
- [ ] Email & Password: Active
- [ ] OAuth: Not needed yet

**Verification:** [ ] PROVIDERS VERIFIED

---

## 📊 TASK #5 COMPLETION CHECKLIST

### Email Configuration
- [ ] Provider selected (SMTP)
- [ ] SMTP host configured
- [ ] SMTP port configured (587 or 465)
- [ ] Username configured
- [ ] Password configured
- [ ] From email configured
- [ ] From name configured
- [ ] Secure/TLS enabled
- [ ] Configuration saved

### Testing
- [ ] Test email sent successfully
- [ ] Test email received in inbox
- [ ] Sender name correct
- [ ] Content displays properly

### Documentation
- [ ] Email configuration documented
- [ ] SMTP credentials secured
- [ ] Authentication providers reviewed
- [ ] Webhook framework understood (optional)

---

## ✅ SUCCESS CRITERIA

### Task #5 Complete When:
✅ SMTP configured in Strapi
✅ Email test sent successfully
✅ Test email received and verified
✅ From email and name correct
✅ Configuration saved
✅ All documentation complete

---

## 🎯 NEXT STEPS

After Task #5 complete:

**Task #6: API Connection Testing** (1-2 hours)
- Test CRUD operations with all tokens
- Verify all endpoints working
- Measure performance

**Task #7: Comprehensive Testing** (1-2 hours)
- Run 23-test suite
- Verify 95%+ pass rate
- Document results

**Task #8: Readiness Assessment** (1 hour)
- Final checklist
- Sign-off for Week 2
- Go/No-Go decision

See: `WEEK_1_TESTING_REPORT.md` for detailed testing framework

---

## 🚨 TROUBLESHOOTING

### Issue: SMTP authentication fails
**Solution:**
1. Verify username and password are correct
2. For Gmail: Use app password (not regular password)
3. Check if 2FA is enabled (requires app password)
4. Verify SMTP host is correct for your provider
5. Try different port (587 vs 465)

### Issue: Email not received
**Solution:**
1. Check spam/junk folder
2. Verify "From Email" is valid
3. Check email forwarding rules
4. Wait 5 minutes (sometimes delayed)
5. Try with different test email address
6. Check Strapi logs for errors

### Issue: Can't find Email Configuration
**Solution:**
1. Look in Settings menu thoroughly
2. Search for "email" or "notification"
3. Try: Settings → Email or Settings → Providers
4. May be named differently in your Strapi version

---

## 📝 REFERENCE FILES

**Detailed Technical Guides:**
- `WEEK_1_DAY_4_5_CORS_EMAIL_SETUP.md` (comprehensive email section)

---

## ✅ SIGN-OFF

**Task #5 Completion:**

**Completed By:**
- Name: ___________________________
- Date: ___________________________
- Time: ___________________________

**Email Configuration Complete: [ ] YES [ ] NO**
**Test Email Received: [ ] YES [ ] NO**
**Ready for Task #6: [ ] YES [ ] NO**

---

**Execute the steps above and confirm when complete.**

